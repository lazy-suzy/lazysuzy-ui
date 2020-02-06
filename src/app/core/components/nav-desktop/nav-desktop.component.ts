import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-desktop',
  templateUrl: './nav-desktop.component.html',
  styleUrls: ['./nav-desktop.component.less'],
})
export class NavDesktopComponent implements OnInit {
  categories = [
    {
      display: 'Living',
      subCategories: [
        {
          display: 'Sofa',
          route: '/sofa',
        },
        {
          display: 'Sectionals',
          route: '/sectionals',
        },
        {
          display: 'Sleeper & Daybeds',
          route: '/sleeper-daybeds',
        },
        {
          display: 'LoveSeat',
          route: '/loveseat',
        },
        {
          display: 'Chairs',
          route: '/chairs',
        },
      ],
    },
    {
      display: 'Bedroom',
      subCategories: [
        {
          display: 'Beds',
          route: '/beds',
        },
        {
          display: 'Headboard',
          route: '/headboard',
        },
        {
          display: 'Mattresses',
          route: '/mattresses',
        },
        {
          display: 'Storage',
          route: '/storage',
        },
        {
          display: 'Nightstands',
          route: '/nightstands',
        },
        {
          display: 'Benches',
          route: '/benches',
        },
        {
          display: 'Ottomans & Stools',
          route: '/ottomans-stools',
        },
        {
          display: 'Vanity',
          route: '/vanity',
        },
      ],
    },
    {
      display: 'Hallway',
      subCategories: [
        {
          display: 'Seating',
          route: '/seating',
        },
        {
          display: 'Tables',
          route: '/tables',
        },
        {
          display: 'Storage',
          route: '/storage',
        },
      ],
    },
    {
      display: 'Dining',
    },
    {
      display: 'Office',
    },
    {
      display: 'Bath',
    },
    {
      display: 'Outdoor',
    },
    {
      display: 'Kids',
    },
    {
      display: 'Decor',
    },
  ];
  ngOnInit() {}
}
