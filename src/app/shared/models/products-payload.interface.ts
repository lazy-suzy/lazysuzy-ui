export interface IProductsPayload {
  seo_data: ISeoData;
  total: number;
  constructor_count: number;
  sortType: ISortType[];
  limit: number;
  filterData: IFilterData;
  products: IProduct[];
}

export interface IProduct {
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
  model_code: string;
  color: string;
  collection: string;
  condition: string;
  main_image: string;
  reviews: number;
  rating: number;
  wishlisted: boolean;
  variations: (IVariationA | IVariationsB)[];
}

export interface IVariationsB {
  product_sku: string;
  variation_sku: string;
  name: string;
  has_parent_sku: boolean;
  swatch_image: string;
  image: string;
  link: string;
}

export interface IVariationA {
  time_taken: number;
  product_sku: string;
  variation_sku: string;
  name: string;
  has_parent_sku: boolean;
  image: string;
  link: string;
  swatch_image: string;
}

export interface IFilterData {
  brand: Brand[];
  price: Price;
  type: Brand[];
  color: Color[];
  category?: any;
}

export interface Color {
  name: string;
  value: string;
  hex: string;
  enabled: boolean;
  checked: boolean;
}

export interface Price {
  from: number;
  to: number;
  max: number;
  min: number;
}

export interface Brand {
  name: string;
  value: string;
  enabled: boolean;
  checked: boolean;
  count: number;
}

export interface ISortType {
  name: string;
  value: string;
  enabled: boolean;
}

export interface ISeoData {
  page_title: string;
  full_title: string;
  email_title: string;
  description: string;
  image_url: string;
}
