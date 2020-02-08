export interface INavCategory {
  display: string;
  subCategories: INavSubCategory[];
}

interface INavSubCategory {
  display: string;
  route: string;
}
