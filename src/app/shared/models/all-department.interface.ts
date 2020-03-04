export interface IAllDepartment {
  department: string;
  LS_ID: number;
  link: string;
  categories: IAllCategory[];
}

export interface IAllCategory {
  category: string;
  product_category_: string;
  filter_label: string;
  LS_ID: number;
  image: string;
  link: string;
  sub_categories: ISubCategory[];
}

interface ISubCategory {
  sub_category: string;
  link: string;
  LS_ID: number;
}
