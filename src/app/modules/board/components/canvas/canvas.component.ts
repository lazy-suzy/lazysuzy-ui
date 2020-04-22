import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/shared/services/board/board.service.js';
import { Subject } from 'rxjs';
declare const fb: any;

import * as _can from './canvas.js';
import { canvasMeta, appMeta } from './allboards.js';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnInit {

  unsubscribe$: Subject<boolean> = new Subject();

  canvas: any;

  canvasMeta = { ...canvasMeta };
  appMeta = { ...appMeta };

  constructor() { }

  ngOnInit(): void {
    // this.canvas = new fb.Canvas('canvas');
    this.initializeCanvas();
    this.canvas.add(new fb.Text('Hello From Canvas!!'));
  }

  initializeCanvas() {
    this.canvas = new fb.Canvas('canvas', {
      containerClass: this.canvasMeta.identifier.containerArea,
      preserveObjectStacking: true,
      width: $(this.canvasMeta.identifier.dropArea)
        .parent()
        .width(),
      height:
        $(this.canvasMeta.identifier.dropArea)
          .parent()
          .width() / Number(this.canvasMeta.value.aspectRatio),
      selection: true
    });
  }

  zoomIn() {
    this.canvasMeta.flag.isZoomed = true;
    this.canvasMeta.value.zoomValue += this.canvasMeta.value.zoomFactor;
    this.canvas.zoomToPoint(this.canvasMeta.value.center, this.canvasMeta.value.zoomValue);
    // handleResize();
  }

  handleResize(event, forceUpdate) {
    let previousWidth = forceUpdate
      ? this.appMeta.board.data[this.appMeta.board.currentIndex].state.canvas.width
      : this.canvas.width;
    let currentWidth = $(this.canvasMeta.identifier.dropArea)
      .parent()
      .width();

    this.appMeta.value.scaleFactor = currentWidth / previousWidth;

    this.canvas.setWidth(currentWidth);
    this.canvas.setHeight(currentWidth / Number(this.canvasMeta.value.aspectRatio));

    if (this.canvas.backgroundImage) {
      this.canvas.backgroundImage.scaleX *= this.appMeta.value.scaleFactor;
      this.canvas.backgroundImage.scaleY *= this.appMeta.value.scaleFactor;
    }

    // scale objects
    this.canvas.getObjects().map(o => {
      o.scaleX *= this.appMeta.value.scaleFactor;
      o.scaleY *= this.appMeta.value.scaleFactor;
      o.top *= this.appMeta.value.scaleFactor;
      o.left *= this.appMeta.value.scaleFactor;
      o.setCoords();
    });

    // update canvas center point
    this.updateCanvasCenter();
  }

  updateCanvasCenter() {
    let center = this.canvas.getCenter();
    this.canvasMeta.value.center = {
      x: center.left,
      y: center.top
    };
  }

  addProductToBoard(product) {
    console.log("Printing from this.", product);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  handleToolboxActions(action) {
    console.log("Printing from canvas", action);
    this.zoomIn();
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  handleTextActions(action) {

    console.log("Printing from canvas", action);
    alert("This is printed from canvas, it means canvas component is able to recieve inputs from the board and can do its work when its integrated.");
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

}
