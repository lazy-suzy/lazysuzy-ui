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
  }

  addProductToBoard(product) {
    console.log("Printing from canvas", product);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  handleToolboxActions(action) {
    console.log("Printing from canvas", action);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

}
