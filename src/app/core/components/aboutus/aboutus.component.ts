import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.less'],
})
export class AboutusComponent implements OnInit {
  logoPath: string = 'assets/image/color_logo_transparent.png';

  constructor() {}

  ngOnInit() {}
}
