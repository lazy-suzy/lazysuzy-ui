import { IProductFilter } from './../shared/models';

export const MOCK_PRODUCT_FILTERS: IProductFilter[] = [
  {
    display: 'brand',
    options: [
      {
        display: 'CB2',
        selected: false,
        value: 'cb2',
      },
      {
        display: 'Crate & Barrel',
        selected: false,
        value: 'cab',
      },
      {
        display: 'Pier 1',
        selected: false,
        value: 'pier1',
      },
      {
        display: 'West Elm',
        selected: false,
        value: 'westelm',
      },
      {
        display: 'World Market',
        selected: false,
        value: 'nw',
      },
    ],
  },
  {
    display: 'price',
    options: [
      {
        display: '$0-50',
        selected: false,
        value: '50',
      },
    ],
  },
  {
    display: 'type',
    options: [
      {
        display: 'storage',
        selected: false,
        value: 'storage',
      },
    ],
  },
  {
    display: 'color',
    options: [
      {
        display: 'black',
        selected: false,
        value: 'black',
      },
      {
        display: 'blue',
        selected: false,
        value: 'blue',
      },
      {
        display: 'brown',
        selected: false,
        value: 'brown',
      },
      {
        display: 'green',
        selected: false,
        value: 'green',
      },
    ],
  },
];
