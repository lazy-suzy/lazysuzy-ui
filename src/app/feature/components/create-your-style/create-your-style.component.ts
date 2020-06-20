import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-create-your-style',
  templateUrl: './create-your-style.component.html',
  styleUrls: ['./create-your-style.component.less'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(50%)' }),
        animate('400ms ease-in', style({ transform: 'translateX(50%)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ]
})
export class CreateYourStyleComponent implements OnInit {
  videoSource = 'https://lazysuzy.com/vd/lz-landing-design.mp4';
  constructor() {}

  ngOnInit() {}
}
