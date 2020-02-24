export interface IProductFilter {
  display: string;
  options: IProductFilterOption[];
}

export interface IProductFilterOption {
  display: string;
  value: string;
  selected: boolean;
}
