import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Board } from '../board';
import { BoardService } from '../board.service';

import { Font, FontPickerService } from 'ngx-font-picker';

declare const fb: any;

@Component({
  selector: 'app-board-preview',
  templateUrl: './board-preview.component.html',
  styleUrls: ['./board-preview.component.less', '../board.component.less']
})
export class BoardPreviewComponent implements OnInit {

  loadedAsEmbed = false;
  constructor(
    private boardService: BoardService, private route: ActivatedRoute, private router: Router, private fontPickerService: FontPickerService) {
    if (route.snapshot['_routerState'].url.match(/embed/))
      this.loadedAsEmbed = true;
  }

  presetFonts = [];
  boardProducts = [];
  boardState;
  boardFound = false;
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
      aspectRatio: (16 / 9).toFixed(2)
    }
  };
  appMeta = {

    board: new Board(),
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
      this.canvas = new fb.Canvas(this.canvasMeta.identifier.id, {
        containerClass: this.canvasMeta.identifier.containerArea,
        preserveObjectStacking: true,
        width: $(this.canvasMeta.identifier.dropArea).parent().width(),
        height: $(this.canvasMeta.identifier.dropArea).parent().width() / Number.parseFloat(this.canvasMeta.value.aspectRatio),
        selection: true
      });
      
      // update canvas center point
      this.updateCanvasCenter();
      
      const uuid = this.route.snapshot.paramMap.get('uuid');
      this.boardService.getBoardByID(uuid, true)
        .subscribe(response => {
          if (response[0]) {
            this.boardFound = true;
            this.appMeta.board = response[0];
            this.boardState = JSON.parse(this.appMeta.board.state.toString());
            if (this.boardState) {
              this.boardState.objects.forEach((object) => {
                if (object.type == "textbox") {
                  this.addFontFamilyIfNotAdded(object.fontFamily);
                }
              });
            }
            this.canvas.loadFromJSON(this.appMeta.board.state, () => {
              if (this.appMeta.flag.isBoot) {
                this.appMeta.flag.isBoot = false;
                this.enterPreviewMode();
                this.handleResize(true);
                setTimeout(() => {
                  for (let index = 0; index < this.canvas._objects.length; index++) {
                    if (this.canvas._objects[index].type == "textbox")
                      this.canvas._objects[index].dirty = true;
                  }
                  this.canvas.renderAll();
                }, 3000);
              }
            });
          }

          if (this.boardFound == false)
            this.router.navigate(['/']);

        });
    });
  }

  updateCanvasCenter = () => {
    let center = this.canvas.getCenter();
    this.canvasMeta.value.center = {
      x: center.left,
      y: center.top
    };
  };

  handleResize = (forceUpdate = false) => {
    let previousWidth = forceUpdate
      ? this.boardState.canvas.width
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
        brand: object.referenceObject.brand ? object.referenceObject.brand : "",
        name: object.referenceObject.name ? object.referenceObject.name : "",
        is_price: object.referenceObject.price ? object.referenceObject.price : "",
        price: object.referenceObject.price ? object.referenceObject.price : "",
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

  addFontFamilyIfNotAdded(fontFamily: string) {
    if (this.presetFonts.indexOf(fontFamily) === -1) {
      this.fontPickerService.loadFont(new Font({
        family: fontFamily
      }));
      this.presetFonts.push(fontFamily);
    }
  }

}