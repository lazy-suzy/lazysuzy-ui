export class Asset {
  // tslint:disable-next-line: variable-name
  asset_id: number;
  name: string;
  price: string;
  brand: string;
  path: string;
  // tslint:disable-next-line: variable-name
  transparent_path: string;
  url: string;
  tags: string;
  // tslint:disable-next-line: variable-name
  is_private: number;
  // tslint:disable-next-line: variable-name
  is_active: number;
  // tslint:disable-next-line: variable-name
  created_at: string;
  // tslint:disable-next-line: variable-name
  updated_at: string;

  constructor(values = {}) {
    Object.assign(this, values);
  }
}
