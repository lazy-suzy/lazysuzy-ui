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
    percent_discount: number;
    model_code: string;
    color: string;
    collection: string;
    condition: string;
    main_image: string;
    set: any[];
    reviews: number;
    rating: number;
    in_inventory: boolean;
    inventory_product_details: {
        price: number;
        count: number;
    };
    redirect: boolean;
    redirect_url: string;
    redirect_details: {};
    wishlisted: boolean;
    variations: (IVariationA | IVariationsB)[];
}

export interface ISearchProductsPayload {
    took: number;
    timed_out: boolean;
    // tslint:disable-next-line: ban-types
    _shards: Object;
    hits: any;
}

export interface ISearchProduct {
    main_product_images: string;
    min_price: number;
    '@version': string;
    max_price: number;
    price: string;
    reviews: number;
    color: string;
    '@timestamp': Date;
    product_url: string;
    product_sku: string;
    rating: string;
    name: string;
    site: string;
    // tslint:disable-next-line: ban-types
    product_name: Object;
    site_name: string;
    is_new: boolean;
    wishlisted: boolean;
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
    shape: Shape[];
    seating: Seating[];
    mfg_country?: any[];
    designer?: any[];
    fabric?: any[];
    material?: any [];
    height?: any[];
    width?: any[];
    length?: any[];
    diameter?: any[];
    depth?: any[];
    square?: any[];
    category?: Category[];
    collection?: any;
}

export interface Shape {
    name: string;
    value: string;
    hex: string;
    enabled: boolean;
    checked: boolean;
}

export interface Seating {
    name: string;
    value: string;
    hex: string;
    enabled: boolean;
    checked: boolean;
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

export interface Category {
    name: string;
    value: string;
    enabled: boolean;
    checked: boolean;
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
    cat_image?: string;
    cat_name_long?: string;
    cat_name_short?: string;
    dept_name_long?: string;
}
