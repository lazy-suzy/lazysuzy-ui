import { Component, OnInit } from '@angular/core';
import * as fb from './fb.min.js';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // console.log(fb);
  }

  addProductToBoard(product) {
    console.log("Printing from canvas", product);
  }

}
