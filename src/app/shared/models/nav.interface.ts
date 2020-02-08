export interface INavCategory {
  display: string;
  subCategories: IMenuItem[];
}

export interface IMenuItem {
  display: string;
  route: string;
}
