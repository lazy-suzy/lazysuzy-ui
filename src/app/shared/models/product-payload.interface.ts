export interface IProductPayload {
  id: number;
  sku: string;
  is_new: boolean;
  site: string;
  name: string;
  product_url: string;
  product_detail_url: string;
  is_price: string;
  was_price: string;
  percent_discount: number;
  model_code: string;
  color: string;
  collection: string;
  condition: string;
  main_image: string;
  reviews: number;
  rating: number;
  wishlisted: boolean;
  variations: any[];
  description?: string[];
  dimension?: IDimension;
  thumb?: string[];
  features?: string[];
  on_server_images?: string[];
  department_info?: IDepartmentInfo[];
  in_inventory: boolean;
  inventory_product_details: {
    price: number;
    count: number;
  };
}

interface IDepartmentInfo {
  department_name: string;
  department_url: string;
  category_name: string;
  category_url: string;
  sub_category_name: string;
  sub_category_url: string;
}

interface IDimension {
  error: string;
}
