import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';

declare const fb: any;

@Component({
  selector: 'app-board-preview',
  templateUrl: './board-preview.component.html',
  styleUrls: ['./board-preview.component.less', '../board.component.less']
})
export class BoardPreviewComponent implements OnInit {

  boards: Board[] = [];
  constructor(
    private boardService: BoardService, private route: ActivatedRoute) { }

  boardProducts = [];
  canvas: any;
  canvasMeta = {
    identifier: {
      id: "canvas-area",
      containerArea: "canvas-inner-container",
      dropArea: "#canvas-droparea",
    },
    value: {
      center: {
        x: 0,
        y: 0
      },
      aspectRatio: (16 / 9).toFixed(2),
      zoomValue: 1
    },
    currentHistoryIndex: -1,
    currentHistory: [],
  };
  appMeta = {

    board: {
      data: [],
      currentIndex: 0,
    },
    flag: {
      isBoot: true
    },
    value: {
      userID: 1,
      scaleFactor: 0
    }
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.handleResize();
  }

  ngOnInit(): void {
    // main entry point
    $(() => {
      // initialize canvas area and set up all handlers
      this.initializeCanvas(() => {
        // get all user boards
        this.getBoards();
      });
    });
  }

  getBoards(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    this.boardService.getBoardByID(uuid)
      .subscribe(response => {
        let boardFound = false;
        this.appMeta.board.data = response;
        this.appMeta.board.data.forEach((boardObject, objectIndex) => {
          // convert state back to json
          this.appMeta.board.data[objectIndex].state = JSON.parse(boardObject.state);
          if (boardObject.uuid == uuid) {
            boardFound = true;
            this.appMeta.board.currentIndex = objectIndex;
            this.canvasMeta.currentHistory.push(boardObject.state);
            this.canvasMeta.currentHistoryIndex++;
            this.updateStateFromHistory();
          }
        });
      });
  }

  initializeCanvas = (callback) => {
    this.canvas = new fb.Canvas(this.canvasMeta.identifier.id, {
      containerClass: this.canvasMeta.identifier.containerArea,
      preserveObjectStacking: true,
      width: $(this.canvasMeta.identifier.dropArea).parent().width(),
      height: $(this.canvasMeta.identifier.dropArea).parent().width() / Number.parseFloat(this.canvasMeta.value.aspectRatio),
      selection: true
    });

    // update canvas center point
    this.updateCanvasCenter();
    if (callback)
      callback();
  };

  updateCanvasCenter = () => {
    let center = this.canvas.getCenter();
    this.canvasMeta.value.center = {
      x: center.left,
      y: center.top
    };
  };

  updateStateFromHistory = () => {
    return this.canvas.loadFromJSON(this.canvasMeta.currentHistory[this.canvasMeta.currentHistoryIndex], () => {
      if (this.appMeta.flag.isBoot) {
        this.appMeta.flag.isBoot = false;
        this.enterPreviewMode();
        this.handleResize(true);
      }
    });
  };

  handleResize = (forceUpdate = false) => {
    let previousWidth = forceUpdate
      ? this.appMeta.board.data[this.appMeta.board.currentIndex].state.canvas.width
      : this.canvas.width;
    let currentWidth = $(this.canvasMeta.identifier.dropArea)
      .parent()
      .width();

    this.appMeta.value.scaleFactor = currentWidth / previousWidth;

    this.canvas.setWidth(currentWidth);
    this.canvas.setHeight(currentWidth / Number.parseFloat(this.canvasMeta.value.aspectRatio));

    if (this.canvas.backgroundImage) {
      this.canvas.backgroundImage.scaleX *= this.appMeta.value.scaleFactor;
      this.canvas.backgroundImage.scaleY *= this.appMeta.value.scaleFactor;
    }

    // scale objects
    this.canvas.getObjects().map((o) => {
      o.scaleX *= this.appMeta.value.scaleFactor;
      o.scaleY *= this.appMeta.value.scaleFactor;
      o.top *= this.appMeta.value.scaleFactor;
      o.left *= this.appMeta.value.scaleFactor;
      o.setCoords();
    });

    // update canvas center point
    this.updateCanvasCenter();
  };
  enterPreviewMode = () => {

    this.canvas.hoverCursor = 'pointer';
    this.canvas.selection = false;
    this.canvas.discardActiveObject();

    this.canvas.getObjects().forEach(object => {
      object.selectable = false;
      object.editable = false;
    });

    let imageObjects = this.canvas.getObjects('image');
    imageObjects.forEach((object, index) => {
      this.boardProducts.push({
        main_image: object.referenceObject.path ? object.referenceObject.path : "",
        site: object.referenceObject.brand ? object.referenceObject.brand : "",
        name: object.referenceObject.name ? object.referenceObject.name : "",
        is_price: object.referenceObject.price ? object.referenceObject.price : "",
        sku: object.referenceObject.sku ? object.referenceObject.sku : ""
      });
      let objectCenter = object.getCenterPoint();
      let textToInsert = new fb.Text(` ${index + 1} `, {
        left: objectCenter.x,
        top: objectCenter.y,
        fontSize: 20,
        fill: '#fff',
        backgroundColor: '#b76e79',
        controlVisible: false,
        selectable: false
      });

      this.canvas.add(textToInsert);
    });

    this.canvas.renderAll();
  };

}