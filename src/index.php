<?php

$requestUrl = strtolower($_SERVER['REQUEST_URI']);
$baseURL = "https://www.lazysuzy.com";
$query = "";
$metaData = [
    'title' => "LazySuzy - Shop your home. From your home.",
    'description' => "Search and discover the latest designs and deals from America's top home brands in one place. Find and share inspiration with shoppable design boards.",
    'image' => "{$baseURL}/images/default.png",
    'url' => $requestUrl,
    'type' => "article"
];

try {
    if(preg_match('/product|products|blog|board/', $requestUrl)) {
    
        preg_match('/DB_DATABASE=(.+?)\nDB_USERNAME=(.+?)\nDB_PASSWORD=(.+?)\n/', file_get_contents('../../../lazysuzy-code/.env'), $env);
        
        if(isset($env[1]) && isset($env[2]) && isset($env[3]))
            $conn = new mysqli('localhost', $env[2], $env[3], $env[1]);
        else
            goto jump;
        
        if (!$conn->connect_error) {
          if(preg_match('/product\/([A-Za-z0-9\- ]+)/', $requestUrl, $matches)){
              if(isset($matches[1]) && !empty($matches[1]))
                  $query = "SELECT CONCAT(`master_brands`.`name`, ' ', `product_name`, ' | LazySuzy') as title, CONCAT('{$baseURL}', `main_product_images`) as image, `product_description` as description FROM `master_data` LEFT JOIN `master_brands` ON `master_data`.`brand` = `master_brands`.`value` WHERE `product_sku` = '{$matches[1]}'";
          }
          else if(preg_match('/products\/([A-Za-z\/]+)/', $requestUrl, $matches)){
              if(isset($matches[1]) && !empty($matches[1])){
                  if($matches[1] == 'all'){
                      if(isset($_GET['new']))
                        $metaData['title'] = "Shop New Arrivals for your Home | LazySuzy";
                      else if(isset($_GET['sale']))
                        $metaData['title'] = "Shop Top Deals for your Home | LazySuzy";
                      else if(isset($_GET['bestseller']))
                        $metaData['title'] = "Shop Best Sellers for your Home | LazySuzy";
                  }
                  else if(($matches[1] == 'collections') && isset($_GET['filters'])){
                      if(preg_match('/collection:([A-Za-z0-9\- ]+)/', $_GET['filters'], $collection)){
                          if(isset($collection[1]))
                            $query = "SELECT CONCAT('Shop ', `brand`, ' ', `name`, ' collection for your Home | LazySuzy') as title, CONCAT('{$baseURL}', `image_cover`) as image, `desc_header` as description FROM `master_collections` WHERE `value` = '{$collection[1]}'";
                      }
                  }
                  else if(($matches[1] == 'brand') && isset($_GET['filters'])){
                      if(preg_match('/brand:([A-Za-z0-9\- ]+)/', $_GET['filters'], $brand)){
                          if(isset($brand[1]))
                            $query = "SELECT CONCAT('Shop ', `name`, ' furniture for your home | LazySuzy') as title, CONCAT('{$baseURL}', `cover_image`) as image, `description` as description FROM `master_brands` WHERE `value` = '{$brand[1]}'";
                      }
                  }
                  else {
                      $urlChunks = explode("/" , $matches[1]);
                      // department only
                      if(isset($urlChunks[0]) && !empty($urlChunks[0]) && ((isset($urlChunks[1]) && empty($urlChunks[1])) || !isset($urlChunks[1])))
                       $query = "SELECT CONCAT('Search from hundreds of ', `dept_name_long`, ' products of top brands at once.') as title, CONCAT('{$baseURL}', `dept_image`) as image, CONCAT('Search hundreds of ', `dept_name_long`, ' from top brands at once. Add to your room designs with your own design boards.') as description FROM `mapping_core` WHERE `dept_name_url` = '{$urlChunks[0]}' AND `cat_name_url` = '' AND `dept_image` != ''";
                      // department and category
                      else if(isset($urlChunks[0]) && !empty($urlChunks[0]) && isset($urlChunks[1]) && !empty($urlChunks[1]))
                        $query = "SELECT CONCAT('Shop ', `dept_name_long` , ' ', `cat_name_short`, ' at LazySuzy') as title, CONCAT('{$baseURL}', `cat_image`) as image, CONCAT('Search hundreds of ', `cat_name_long`, ' from top brands at once. Add to your room designs with your own design boards.') as description FROM `mapping_core` WHERE `dept_name_url` = '{$urlChunks[0]}' AND `cat_name_url` = '{$urlChunks[1]}' AND `cat_image` != ''";
                  }
              }
          }
          else if(preg_match('/board\/preview\/(\w+)/', $requestUrl, $matches)){
              if(isset($matches[1]) && !empty($matches[1]))
                  $query = "SELECT CONCAT(`title` , ' by ', `username`, ' | LazySuzy') as title, CONCAT('{$baseURL}', `preview`) as image, CONCAT(\"Check out \", `username`, \"'s mood board & shop the look!\") as description FROM `board` LEFT JOIN `users` ON `board`.`user_id` = `users`.`id` WHERE `uuid` = '{$matches[1]}'";
          }
          else if(preg_match('/blog\/([A-Za-z0-9\- ]+)/', $requestUrl, $matches)){
            if(isset($matches[1]) && !empty($matches[1])){
                $response = json_decode(file_get_contents("https://wordpress.lazysuzy.com/index.php/wp-json/wp/v2/posts?_fields[]=title&_fields[]=excerpt&_fields[]=x_featured_media_original&slug={$matches[1]}"));
                if(!empty($response) && isset($response[0]) && isset($response[0]->title)){
                    $metaData['title'] = $response[0]->title->rendered;
                    $metaData['description'] = $response[0]->excerpt->rendered;
                    $metaData['image'] = $response[0]->x_featured_media_original;
                }
            }
          }
          
          if($query){
              $result = $conn->query($query);
              if ($result->num_rows > 0){
                  while($row = $result->fetch_assoc()) {
                      foreach ($row as $key => $value)
                          $metaData[$key] = htmlentities($value, ENT_IGNORE | ENT_COMPAT);
                                       
                      break;
                  }
              }
          }
      }
    }
} catch (\Exception $e) {
    
}


jump:
$meta = "<title>{$metaData['title']}</title><meta property='og:title' content=\"{$metaData['title']}\"><meta property='og:description' content=\"{$metaData['description']}\"><meta property='og:image' content=\"{$metaData['image']}\"><meta property=\"og:type\" content=\"{$metaData['type']}\"><meta property=\"og:url\" content=\"{$baseURL}{$metaData['url']}\">";
echo str_replace("<title>LazySuzy</title>", $meta, file_get_contents('index.html'));
?>
