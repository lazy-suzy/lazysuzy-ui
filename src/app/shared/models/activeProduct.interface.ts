export interface IActiveProduct {
  sku: string;
  in_inventory: boolean;
  inventory_product_details: {
    price: number;
    count: number;
    is_low: boolean;
    message: string;
    was_price: number;
  };
}
