export class Board {
  board_id: number;
  uuid: string;
  state: object;
  title: string;
  preview: string;
  type_room: number;
  type_style: number;
  type_privacy: number;
  is_published: boolean;
  is_active: boolean;
  created_at: boolean;
  updated_at: boolean;
  user_id: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
