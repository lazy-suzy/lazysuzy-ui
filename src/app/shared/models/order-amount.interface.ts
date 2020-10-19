export interface IOrderAmount {
  sales_tax_total: number;
  sub_total: number;
  shipment_total: number;
  total_cost: number;
  total_promo_discount?:number;
  original_sub_total?:number;
}
