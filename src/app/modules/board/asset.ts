export class Asset {
  asset_id: number;
  name: string;
  price: string;
  brand: string;
  path: string;
  transparent_path: string;
  is_private: number;
  is_active: number;
  created_at: string;
  updated_at: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

