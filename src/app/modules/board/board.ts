export class Board {
  board_id: number;
  uuid: string;
  state: object;
  title: string;
  preview: string;
  type_room: number;
  type_style: number;
  type_privacy: number;
  is_active: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}