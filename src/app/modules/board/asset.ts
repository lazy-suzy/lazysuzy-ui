export class Asset {
  asset_id: number;
  name: string;
  price: string;
  brand: string;
  path: string;
  transparent_path: string;
  is_private: boolean;
  is_active: boolean;
  created_at: boolean;
  updated_at: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

