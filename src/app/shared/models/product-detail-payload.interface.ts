export interface IProductDetail {
  id: number;
  sku: string;
  is_new: boolean;
  site: string;
  name: string;
  product_url: string;
  product_detail_url: string;
  is_price: string;
  was_price: string;
  percent_discount: string;
  model_code?: any;
  color: string;
  collection: string;
  condition: string;
  main_image: string;
  reviews: number;
  rating: number;
  wishlisted: boolean;
  set: any[];
  selections: any;
  redirect: boolean;
  redirect_url: string;
  redirect_details: {};
  variations: Variation[];
  description: string[];
  dimension: Dimension[];
  thumb: string[];
  features: string[];
  on_server_images: string[];
  department_info: Departmentinfo[];
}

interface Departmentinfo {
  department_name: string;
  department_url: string;
  category_name: string;
  category_url: string;
  sub_category_name: string;
  sub_category_url: string;
}

interface Dimension {
  ') or e': string;
  ').': string;
  description: string;
}

interface Variation {
  product_sku: string;
  variation_sku: string;
  name: string;
  features: Features;
  has_parent_sku: boolean;
  image: string;
  link: string;
  swatch_image: string;
  price: string;
  was_price: string;
}

interface Features {
  color: string;
  shape: string;
  fabric: string;
  delivery: string;
}
