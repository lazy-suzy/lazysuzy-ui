export interface OrderDetailsInterface {
    status: boolean;
    data: OrderInfo[];
}

export interface OrderInfo {
    shipping_f_name: string;
    shipping_l_name: string;
    shipping_address_line1: string;
    shipping_address_line2?: any;
    shipping_state: string;
    shipping_zipcode: string;
    order_id: string;
    shipping_city: string;
    created_at: string;
    products: OrderDetailProduct[];
}

export interface OrderDetailProduct {
    quantity: number;
    price: number;
    status: string;
    note?: any;
    delivery_date: string;
    date: string;
    tracking: string;
    tracking_url: string;
    ship_code: string;
    label: string;
    product_name: string;
    image: string;
    site: string;
    product_sku: string;
}
