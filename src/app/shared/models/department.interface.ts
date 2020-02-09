export interface IDepartment {
  display: string;
  categories: ICategory[];
}

export interface ICategory {
  display: string;
  route: string;
}
