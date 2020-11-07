import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-mobile',
  templateUrl: './footer-mobile.component.html',
  styleUrls: ['./footer-mobile.component.less']
})
export class FooterMobileComponent implements OnInit {
  logopath = 'assets/image/color_logo_transparent.png';
  constructor() { }

  ngOnInit() {
  }

}
