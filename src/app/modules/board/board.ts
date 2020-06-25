export class Board {
  // tslint:disable-next-line: variable-name
  board_id: number;
  uuid: string;
  state: object;
  title: string;
  preview: string;
  // tslint:disable-next-line: variable-name
  type_room: number;
  // tslint:disable-next-line: variable-name
  type_style: number;
  // tslint:disable-next-line: variable-name
  type_privacy: number;
  // tslint:disable-next-line: variable-name
  is_private: boolean;
  // tslint:disable-next-line: variable-name
  is_published: number;
  // tslint:disable-next-line: variable-name
  is_active: boolean;
  // tslint:disable-next-line: variable-name
  created_at: boolean;
  // tslint:disable-next-line: variable-name
  updated_at: boolean;
  // tslint:disable-next-line: variable-name
  user_id: number;
  // tslint:disable-next-line: variable-name
  like_count: number;
  // tslint:disable-next-line: variable-name
  is_liked: boolean;
  constructor(values = {}) {
    Object.assign(this, values);
  }
}
