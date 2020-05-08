import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SideNavItems } from './../sidenavitems';
import { ShortcutInput } from "ng-keyboard-shortcuts";
import * as $ from 'jquery';
import { Board } from '../board';
import { BoardService } from '../board.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Asset } from '../asset';
declare const fb: any;

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.less', '../board.component.less']
})
export class BoardViewComponent implements OnInit, AfterViewInit {

  shortcuts: ShortcutInput[] = [];

  selectedItem = 'select';
  selectedCategory = null;
  showLoader = false;
  productForPreview = null;
  sideBarItems = SideNavItems;
  @ViewChild('browsefilter', { static: false }) browsefilter?: OverlayPanel;

  constructor(
    private cookieService: CookieService,
    public boardService: BoardService,
    private route: ActivatedRoute
  ) { }

  selectSideBarItem(item) {
    this.selectedItem = item.value;
    if (this.selectedItem === 'browse') {
      let selCat = this.boardService.getCategory();
      this.getBrowseData(selCat);
    }
    this.handlePreviewMode(this.selectedItem);
  }

  handleAddProductBoardPreview($event) { }

  handleSelectCategory($event) {
    this.boardService.setCategory($event);
    this.selectSideBarItem({
      name: 'Browse',
      label: 'Browse',
      value: 'browse',
      route: 'board-browse'
    });
  }

  handleProductPreview(product) {
    this.productForPreview = { ...product };
  }

  handleClearProductPreview(product) {
    this.productForPreview = null;
  }

  getBrowseData(categ) {
    this.selectedCategory = categ;
    this.showLoader = true;
    this.boardService.getBrowseTabData(this.selectedCategory).subscribe((s: any) => {
      this.remoteProducts = [...(s.products) || []];
      this.remoteProducts = this.remoteProducts.map((ele, i) => {
        return {
          ...ele,
          refId: i
        };
      });
      this.boardService.setBoardData(this.remoteProducts,this.selectedCategory, s.filterData || {});
      this.showLoader = false;
    });
  }

  handleGoToSelect(event) {
    this.boardService.resetBoard();
    this.selectSideBarItem({
      name: 'Select',
      label: 'Select',
      value: 'select',
      route: 'board-select'
    });
  }

  handleUpdatesFromFilter(event) {
    if (event.name === 'TOGGLE_FILTER_OVERLAY' && !event.value) {
      this.browsefilter.hide();
    }
  }

  canvas: any;
  canvasMeta = {
    identifier: {
      // simple identifier
      id: "canvas-area",
      containerArea: "canvas-inner-container",
      // specific identifier
      dropArea: "#canvas-droparea",
    },
    value: {
      center: {
        x: 0,
        y: 0
      },
      aspectRatio: (16 / 9).toFixed(2),
      zoomValue: 1,
      zoomFactor: 0.1,
      borderColor: "blue",
      cornerSize: 10,
      cornerColor: "red",
      transparentCorners: false,
      cloneOffset: 20,
      hideControls: {
        tl: false,
        tr: false,
        bl: false,
        br: false,
        ml: false,
        mt: false,
        mr: false,
        mb: false,
        mtr: false
      },
      textControl: {
        tl: true,
        tr: true,
        bl: true,
        br: true,
        ml: true,
        mt: false,
        mr: true,
        mb: false,
        mtr: true
      },
      imageControl: {
        tl: true,
        tr: true,
        bl: true,
        br: true,
        ml: false,
        mt: false,
        mr: false,
        mb: false,
        mtr: true
      },
      propertiesToInclude: [
        "transparentCorners",
        "borderColor",
        "cornerSize",
        "cornerColor",
        "referenceObject"
      ],
      crop: {
        control: {
          tl: true,
          tr: true,
          bl: true,
          br: true,
          ml: true,
          mt: true,
          mr: true,
          mb: true,
          mtr: false
        },
        active: null,
        copy: null,
        box: null,
      }
    },

    configuration: {},

    currentHistoryIndex: -1,
    currentHistory: [],

    flag: {
      isDirty: false,
      panningEnabled: false,
      cropEnabled: false,
      isZoomed: false,
      isCurrentSelectionEmpty: true,
      isCurrentObjectText: false,
      isCurrentObjectImage: false,
      isCurrentObjectTransparentable: false,
      isCurrentObjectTransparentSelected: false,
    }
  };
  appMeta = {

    asset: [],
    board: {
      data: [],
      currentIndex: 0,
      update: {
        exist: false,
        method: () => { },
        delay: 2000
      }
    },
    flag: {
      isFontToolbarDirty: false,
      // isBoardDirty: false,
      isAssetDirty: false,
      isProductPanelDirty: false,
      isBoardItemDirty: false,
      isBoot: true,
      isPreviewEnabled: false
    },
    value: {
      fontFamily: "Arial",
      fontSize: "14",
      fontColor: "#000000",
      userID: 1,
      currentSelectedItem: 0,
      lastVisitedTab: "",
      scaleFactor: 0
    },
    identifier: {
      customProduct: '.product-image[type="custom"]',

      boardTitle: ".board-title",
      tab: '.nav-link',
      currentDragableObject: ".dragging",

      fontFamily: ".js-font-select",
      fontSize: ".js-font-select-size",
      fontColor: ".js-font-select-color",

      completeToolbarElement: ".top-panel",
      completeTitleElement: ".d-flex:has(.canvas-title-bar)",

      fontToolbarElement: ".editor-icons",
      imageToolbarElement: ".image-icons",
      cropToolbarElement: ".crop-toolbar",
      transparentToolbarElement: ".do-transparent",
      undoTransparentToolbarElement: ".undo-transparent",

      dropzoneElement: ".add-new",

      uploadByURL: "input[name='url']",
      uploadByURLName: "input[name='name']",
      uploadByURLPrice: "input[name='price']",
      uploadByURLIsPrivate: "input[name='is_private']",
      uploadByURLSubmit: "#step3 .red-button",

      backgroundColorElement: ".canvas-pallete-color",
      floorPatternElement: ".canvas-pallete-wood-patterns",

      manualDrop: ".manual-drop",
    }
  };

  facebookRedirect = "";
  googleRedirect = "";
  remoteProducts = [];
  boardPreviewProducts = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.handleResize();
  }

  ngOnInit(): void {
    // main entry point
    $(() => {
      this.getConfig(() => {
        // initialize canvas area and set up all handlers
        this.initializeCanvas(() => {
          // initialize toolbar and other area and set up all handlers
          this.initializeAppMeta();
          // get all user boards
          this.getBoards();
          // get all user assets
          this.getAssets();
          // setup upload methods
          // this.initializeUploadMethods();
        });
      });
    });
  }
  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: "up",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'top', -1),
        preventDefault: true
      },
      {
        key: "down",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'top', 1),
        preventDefault: true
      },
      {
        key: "left",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'left', -1),
        preventDefault: true
      },
      {
        key: "right",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'left', 1),
        preventDefault: true
      },
      {
        key: "shift + up",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'top', -10),
        preventDefault: true
      },
      {
        key: "shift + down",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'top', 10),
        preventDefault: true
      },
      {
        key: "shift + left",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'left', -10),
        preventDefault: true
      },
      {
        key: "shift + right",
        command: e => this.applyShortcut('activeObjectFetchAssign', 'left', 10),
        preventDefault: true
      },
      {
        key: "esc",
        command: e => this.applyShortcut("deselectOrCancel", ''),
        preventDefault: true
      },
      {
        key: "t",
        command: e => this.applyShortcut("addText", ''),
        preventDefault: true
      },
      {
        key: "del",
        command: e => this.applyShortcut("action", 'delete'),
        preventDefault: true
      },
      {
        key: ["ctrl + z", "cmd + z"],
        command: e => this.applyShortcut("direct", 'undo'),
        preventDefault: true
      },
      {
        key: ["ctrl + y", "cmd + y"],
        command: e => this.applyShortcut("direct", 'redo'),
        preventDefault: true
      },
      {
        key: ["ctrl + plus", "cmd + plus", "ctrl + =", "cmd + ="],
        command: e => this.applyShortcut("direct", 'zoomIn'),
        preventDefault: true
      },
      {
        key: ["ctrl + -", "cmd + -", "ctrl + _", "cmd + _"],
        command: e => this.applyShortcut("direct", 'zoomOut'),
        preventDefault: true
      },
      {
        key: ["ctrl + a", "cmd + a"],
        command: e => this.applyShortcut("direct", "selectAll"),
        preventDefault: true
      },
      {
        key: ["ctrl + d", "cmd + d"],
        command: e => this.applyShortcut("action", "duplicate"),
        preventDefault: true
      },
      {
        key: ["ctrl + f", "cmd + f"],
        command: e => this.applyShortcut("action", "flip"),
        preventDefault: true
      },
      {
        key: ["ctrl + b", "cmd + b"],
        command: e => this.applyShortcut("toggleBackground", ""),
        preventDefault: true
      },
      {
        key: ["ctrl + r", "cmd + r"],
        command: e => this.applyShortcut("initializeCrop", ""),
        preventDefault: true
      },
      {
        key: ["ctrl + up", "cmd + up"],
        command: e => this.applyShortcut("action", "bringForward"),
        preventDefault: true
      },
      {
        key: ["ctrl + down", "cmd + down"],
        command: e => this.applyShortcut("action", "sendBackward"),
        preventDefault: true
      },
      {
        key: "enter",
        command: e => this.applyShortcut("confirmCrop", ""),
        preventDefault: true
      },
    );
    // Object.keys(boardShortcuts).forEach((i) => { this.shortcuts.push(boardShortcuts[i]) });
  }

  applyShortcut = (action, name, value = 0) => {
    let activeObject = this.canvas.getActiveObject();

    if (action == "deselectOrCancel") {
      if (this.canvasMeta.flag.cropEnabled)
        this.handleCrop(false);
      else
        this.canvas.discardActiveObject();
    }
    else if (action == "action" && activeObject)
      this.action(name);
    else if (action == "activeObjectFetchAssign" && activeObject)
      activeObject.set(name, activeObject[name] + value);
    else if (action == "direct")
      this[name]();
    else if (action == "initializeCrop" && activeObject && activeObject.type == "image")
      this.handleCrop();
    else if (action == "confirmCrop" && activeObject && this.canvasMeta.flag.cropEnabled)
      this.handleCrop(true);
    else if (action == "toggleBackground" && activeObject) {
      if ((this.canvasMeta.flag.isCurrentObjectTransparentable &&
        !this.canvasMeta.flag.isCurrentObjectTransparentSelected) == true)
        this.action('transparent');
      else if ((this.canvasMeta.flag.isCurrentObjectTransparentable &&
        this.canvasMeta.flag.isCurrentObjectTransparentSelected) == true)
        this.action('undoTransparent');
    }
    else if (action == "addText") {
      let textToInsert = new fb.Textbox("Text", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "#000000"
      });
      textToInsert.setControlsVisibility(this.canvasMeta.value.textControl);
      this.applyDrop(false, textToInsert);
    }

    this.canvas.requestRenderAll();
  }

  getConfig = (callback) => {
    // this.canvasMeta.configuration = response.reduce(function (r, e) {
    //   r[e.name] = e.value;
    //   return r;
    // }, {});

    if (callback)
      callback();
  };

  getBoards = () => {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    this.boardService.getBoardByID(uuid).
      subscribe(response => {
        let boardFound = false;
        this.appMeta.board.data = response;
        this.appMeta.board.data.forEach((boardObject, objectIndex) => {
          // convert state back to json
          this.appMeta.board.data[objectIndex].state = JSON.parse(boardObject.state);
          if (boardObject.uuid == uuid) {
            boardFound = true;
            this.appMeta.board.currentIndex = objectIndex;
            $(this.appMeta.identifier.boardTitle).val(boardObject.title);
            this.canvasMeta.currentHistory.push(boardObject.state);
            this.canvasMeta.currentHistoryIndex++;
            this.updateStateFromHistory();
          }
        });

        // if board does not exist redirect user to board list
        if (boardFound == false)
          console.log(this.appMeta.board.data, 'not found');
        else {
          if (this.cookieService.get('backgroundColor') && this.cookieService.get('backgroundColor').length > 0) {
            this.canvas.setBackgroundColor(this.cookieService.get('backgroundColor'), function () {
              this.canvas.renderAll();
              this.saveHistory();
            });
            this.cookieService.set('backgroundColor', "");
          }
          if (this.cookieService.get('backgroundImage') && this.cookieService.get('backgroundImage').length > 0) {
            fb.Image.fromURL(this.cookieService.get('backgroundImage'), function (img) {
              img.set({ originX: 'left', originY: 'top', scaleX: this.canvas.width / img.width, scaleY: this.canvas.height / img.height });
              this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
              this.saveHistory();
            });
            this.cookieService.set('backgroundImage', "");
          }
        }
      });
  };

  getAssets = () => {
    this.boardService.getBoards()
      .subscribe(response => {
        if (response.length > 0) {
          this.appMeta.asset = response;
          this.appMeta.flag.isAssetDirty = true;
          this.appMeta.flag.isProductPanelDirty = true;
          this.renderAppMeta();
        }
      });
  };

  initializeCanvas = (callback) => {
    this.canvas = new fb.Canvas(this.canvasMeta.identifier.id, {
      containerClass: this.canvasMeta.identifier.containerArea,
      preserveObjectStacking: true,
      width: $(this.canvasMeta.identifier.dropArea).parent().width(),
      height: $(this.canvasMeta.identifier.dropArea).parent().width() / Number.parseFloat(this.canvasMeta.value.aspectRatio),
      selection: true
    });

    // add class for detection
    $(".lazysuzy-board").on('dragstart dragend', (e) => {
      $(e.target).toggleClass(this.appMeta.identifier.currentDragableObject.replace(".", ""));
    });

    // update canvas center point
    this.updateCanvasCenter();

    // bind drop area events
    $(this.canvasMeta.identifier.dropArea).bind("drop", (e) => {
      let draggedObject = $(this.appMeta.identifier.currentDragableObject);
      let dropType = draggedObject.attr("drop-type");
      let referenceID = draggedObject.parent().attr('data-product');
      let referenceType = draggedObject.parent().attr("type");
      this.handleDrop(e, draggedObject, dropType, referenceID, referenceType);
    });

    // handle canvas events
    this.canvas.on("selection:created", this.handleSelection);
    this.canvas.on("selection:updated", this.handleSelection);
    this.canvas.on("selection:cleared", this.handleSelection);

    // stop objects from going out of canvas area
    this.canvas.on("object:moving", (e) => {
      return;
      var obj = e.target;
      var boundingRect = obj.getBoundingRect();
      // if object is too big ignore
      if (obj.currentHeight > obj.this.canvas.height || obj.currentWidth > obj.this.canvas.width || obj.clipPath)
        return;

      obj.setCoords();

      if (!this.canvasMeta.flag.cropEnabled) {
        if (boundingRect.top < 0 || boundingRect.left < 0) {
          obj.top = Math.max(obj.top, obj.top - boundingRect.top);
          obj.left = Math.max(obj.left, obj.left - boundingRect.left);
        }

        if (boundingRect.top + boundingRect.height > obj.this.canvas.height || boundingRect.left + boundingRect.width > obj.this.canvas.width) {
          obj.top = Math.min(obj.top, obj.this.canvas.height - boundingRect.height + obj.top - boundingRect.top);
          obj.left = Math.min(obj.left, obj.this.canvas.width - boundingRect.width + obj.left - boundingRect.left);
        }
      }

    });
    this.canvas.on("object:modified", this.saveHistory);

    this.canvas.on("mouse:down", (e) => {
      if (this.canvasMeta.flag.isZoomed && !this.canvas.getActiveObject()) {
        this.canvasMeta.flag.panningEnabled = true;
        this.canvas.defaultCursor = "move";
        this.canvas.selection = false;
      }
      else if (this.canvasMeta.flag.cropEnabled)
        // if cropbox exist and empty area was clicked
        if (this.canvasMeta.value.crop.box && e.target == null) {
          this.canvas.setActiveObject(this.canvasMeta.value.crop.box);
          this.handleCrop(true);
        }
    });
    this.canvas.on("mouse:up", (e) => {

      this.canvasMeta.flag.panningEnabled = false;
      this.canvas.defaultCursor = "default";
      this.canvas.selection = true;

    });
    this.canvas.on("mouse:move", (e) => {
      if (this.canvasMeta.flag.panningEnabled && e && e.e) {
        let delta = new fb.Point(e.e.movementX, e.e.movementY);
        this.canvas.relativePan(delta);

        if (this.canvasMeta.value.zoomValue > 1)
          this.keepPositionInBounds();
      }

    });

    if (callback)
      callback();
  };

  initializeAppMeta = () => {
    // Initialize font values
    $(this.appMeta.identifier.fontFamily).change((e) => {
      this.appMeta.value.fontFamily = $(e.currentTarget).val().toString().replace("+", " ");
      this.appMeta.flag.isFontToolbarDirty = true;
      this.updateCurrentObject(true);
    });
    $(this.appMeta.identifier.fontSize).change((e) => {
      this.appMeta.value.fontSize = $(e.currentTarget).val().toString();
      this.appMeta.flag.isFontToolbarDirty = true;
      this.updateCurrentObject(true);
    });
    $(this.appMeta.identifier.fontColor).on("input", (e) => {
      this.appMeta.value.fontColor = $(e.currentTarget).val().toString();
      this.appMeta.flag.isFontToolbarDirty = true;
      this.updateCurrentObject(true);
    });
    $(this.appMeta.identifier.backgroundColorElement).click((e) => {
      let backgroundColor = $(e.currentTarget).css("background-color");
      this.canvas.setBackgroundColor(backgroundColor, function () {
        this.canvas.renderAll();
        this.saveHistory();
      });
    });
    $(this.appMeta.identifier.floorPatternElement).click((e) => {
      let src = $(e.currentTarget).attr("src");
      fb.Image.fromURL(src, function (img) {
        img.set({ originX: 'left', originY: 'top', scaleX: this.canvas.width / img.width, scaleY: this.canvas.height / img.height });
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
      });
    });

    $(this.appMeta.identifier.boardTitle).change((e) => {
      this.appMeta.board.data[this.appMeta.board.currentIndex].title = $(this.appMeta.identifier.boardTitle).val();

      if (this.appMeta.board.update.exist == false) {
        this.appMeta.board.update.exist = true;
        this.appMeta.board.update.method = this.debounce(this.updateBoard, this.appMeta.board.update.delay);
      }

      this.appMeta.board.update.method();
    });

    // handle custom product click for bottom sheet render
    $(document).on('click', this.appMeta.identifier.customProduct, (e) => {
      this.appMeta.flag.isProductPanelDirty = true;
      this.appMeta.value.currentSelectedItem = Number.parseInt($(e.currentTarget).attr('data-product'));
      this.renderAppMeta();
    });

    // handle manual add
    $(document).on('click', this.appMeta.identifier.manualDrop, (e) => {
      console.log(e);
      let dropType = $(e.currentTarget).attr('drop-type');
      if (dropType == "image") {
        let referenceID = $(e.currentTarget).attr('data-product');
        let referenceType = $(e.currentTarget).attr('type');
        let draggedObject = $('.product-image[type="' + referenceType + '"][data-product="' + referenceID + '"] img');
        // console.log(draggedObject, dropType, referenceID, referenceType);
        this.handleDrop(false, draggedObject, dropType, referenceID, referenceType);
      }
      else if (dropType == "text")
        this.handleDrop(false, $(e.target), dropType, false, false);
    });


    // Render first updates
    this.updateToolbar();
  };

  initializeUploadMethods = () => {
    /*
    // #1 Using Dropzone
    let myDropzone = new Dropzone(this.appMeta.identifier.dropzoneElement, {
      url: this.appMeta.endpoint.api,
      autoProcessQueue: true,
      maxFilesize: 20,
      acceptedFiles: "image/bmp, image/x-bmp, image/x-bitmap, image/x-xbitmap, image/x-win-bitmap, image/x-windows-bmp, image/ms-bmp, image/x-ms-bmp, image/gif, image/x-icon, image/x-ico, image/vnd.microsoft.icon, image/jpx, image/jpm, image/jpeg, image/pjpeg, image/png,image/x-png, image/tiff",
      sending: (file, xhr, formData) => {
        formData.append("operation", "file");
        formData.append("user_id", this.appMeta.value.userID);
        formData.append("data[name]", "custom");
        formData.append("data[brand]", "custom");
      },
      success: (file, response) => {
        // remove preview
        myDropzone.removeFile(file);
        this.appMeta.asset.unshift(response);
        this.appMeta.flag.isAssetDirty = true;
        this.renderAppMeta();
      },
      error: (file, error, xhr) => {
        myDropzone.removeFile(file);
      }
    });

    // #2 Upload by URL
    $(this.appMeta.identifier.uploadByURLSubmit).click(() => {
      // Not empty
      if ($(this.appMeta.identifier.uploadByURL).val().length > 0) {
        $.post(this.appMeta.endpoint.api, {
          operation: "fetch",
          url: $(this.appMeta.identifier.uploadByURL).val(),
          user_id: this.appMeta.value.userID,
          data: {
            name: $(this.appMeta.identifier.uploadByURLName).val(),
            price: $(this.appMeta.identifier.uploadByURLPrice).val(),
            is_private: $(this.appMeta.identifier.uploadByURLIsPrivate).is(":checked") ? 1 : 0,
          }
        }, (response) => {
          $(this.appMeta.identifier.uploadByURL).val('');
          $(this.appMeta.identifier.uploadByURLName).val('');
          $(this.appMeta.identifier.uploadByURLPrice).val('');
          this.appMeta.asset.unshift(response);
          this.appMeta.flag.isAssetDirty = true;
          this.renderAppMeta();
        });
      }
    });
    */
  }

  updateCanvasCenter = () => {
    let center = this.canvas.getCenter();
    this.canvasMeta.value.center = {
      x: center.left,
      y: center.top
    };
  };

  updateCurrentObject = (forceUpdate = false) => {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type == "textbox") {
        if (this.appMeta.flag.isFontToolbarDirty) {
          activeObject.set("fontFamily", this.appMeta.value.fontFamily);
          activeObject.set("fontSize", this.appMeta.value.fontSize);
          activeObject.set("fill", this.appMeta.value.fontColor);
        }
      } else if (activeObject.type == "image") {

      }
    }

    // request render at the end
    this.canvas.requestRenderAll();
    // mark all actions completed
    Object.keys(this.appMeta.flag).map((flag) => this.appMeta.flag[flag] = false);

    if (forceUpdate)
      this.saveHistory();
  };

  updateStateFromHistory = () => {
    return this.canvas.loadFromJSON(this.canvasMeta.currentHistory[this.canvasMeta.currentHistoryIndex], () => {
      if (this.appMeta.flag.isBoot) {
        this.appMeta.flag.isBoot = false;
        this.handleResize(true);
      }
    });
  };

  handleSelection = () => {
    let activeObject = this.canvas.getActiveObject();
    // reset selection
    this.canvasMeta.flag.isCurrentObjectText = this.canvasMeta.flag.isCurrentObjectImage = this.canvasMeta.flag.isCurrentObjectTransparentSelected = this.canvasMeta.flag.isCurrentObjectTransparentable = this.canvasMeta.flag.isCurrentSelectionEmpty = false;

    if (activeObject) {
      if (activeObject.type == "textbox") {
        this.appMeta.value.fontFamily = activeObject.fontFamily;
        this.appMeta.value.fontSize = activeObject.fontSize;
        this.appMeta.value.fontColor = activeObject.fill;
        this.appMeta.flag.isFontToolbarDirty = true;
        this.canvasMeta.flag.isCurrentObjectText = true;
      }
      else if (activeObject.type == "image") {
        this.canvasMeta.flag.isCurrentObjectImage = true;
        this.canvasMeta.flag.isCurrentObjectTransparentable = activeObject.referenceObject.type == "custom";
        this.canvasMeta.flag.isCurrentObjectTransparentSelected = activeObject.getSrc().includes(activeObject.referenceObject.transparentPath);
      }
    }
    else
      this.canvasMeta.flag.isCurrentSelectionEmpty = true;

    this.updateToolbar();
  };

  handleDrop = (e, draggedObject, dropType, referenceID, referenceType) => {
    if (dropType == 'image') {
      let referenceObjectValue: any = {
        type: referenceType
      };

      if (referenceType == 'custom') {
        referenceObjectValue.id = this.appMeta.asset[referenceID].asset_id;
        referenceObjectValue.path = this.appMeta.asset[referenceID].path;
        referenceObjectValue.transparentPath =
          this.appMeta.asset[referenceID].transparent_path;
        referenceObjectValue.name = this.appMeta.asset[referenceID].name;
        referenceObjectValue.price = this.appMeta.asset[referenceID].price;
        referenceObjectValue.brand = this.appMeta.asset[referenceID].brand;
        referenceObjectValue.sku = '';
      } else if (referenceType == 'default') {
        referenceObjectValue.id = this.remoteProducts[referenceID].id;
        referenceObjectValue.isTransparent = 1;
        referenceObjectValue.path = this.remoteProducts[referenceID].main_image;
        referenceObjectValue.transparentPath = '';
        referenceObjectValue.name = this.remoteProducts[referenceID].name;
        referenceObjectValue.price = this.remoteProducts[referenceID].is_price;
        referenceObjectValue.brand = this.remoteProducts[referenceID].site;
        referenceObjectValue.sku = this.remoteProducts[referenceID].sku;
      }

      let imageToInsert = new fb.Image(draggedObject[0], {
        lockScalingFlip: true,
        referenceObject: referenceObjectValue
      });

      this.applyDrop(e, imageToInsert);

      // fb.Image.fromURL(draggedObject[0].src, (imageToInsert) => {
      //   imageToInsert.lockScalingFlip = true;
      //   imageToInsert.referenceObject = referenceObjectValue;
      //   this.applyDrop(e, imageToInsert);
      // }, { crossOrigin: 'anonymous' });

      // fb.util.loadImage(draggedObject[0].src,
      //   (img) => {
      //     imageToInsert = new fb.Image(img, {
      //       lockScalingFlip: true
      //     });
      //     imageToInsert.scale(this.canvasMeta.value.scaleFactor);
      //     imageToInsert.setControlsVisibility(this.canvasMeta.value.imageControl);
      //     this.applyDrop(e, imageToInsert);
      //   }, null, {
      //     // crossOrigin: 'anonymous'
      //   }
      // );

    } else if (dropType == 'text') {
      let textToInsert = new fb.Textbox(draggedObject.text(), {
        fontFamily: draggedObject.text(),
        fontSize: 24,
        fill: "#000000"
      });
      textToInsert.setControlsVisibility(this.canvasMeta.value.textControl);
      this.applyDrop(e, textToInsert);
    }
  };

  applyDrop = (e, objectToInsert) => {
    if (objectToInsert) {
      let x = 0;
      let y = 0;

      // if object is more then 30% size on canvas then make it 30%
      if (objectToInsert.width / this.canvas.getWidth() >= 0.3)
        objectToInsert.scale((this.canvas.getWidth() * 0.3) / objectToInsert.width);
      else if (objectToInsert.height / this.canvas.getHeight() >= 0.3)
        objectToInsert.scale((this.canvas.getHeight() * 0.3) / objectToInsert.height);

      if (e) {
        let offset = $('#' + this.canvasMeta.identifier.id).offset();
        x = e.clientX - offset.left;
        y = e.clientY - offset.top;
      } else {
        x =
          this.canvasMeta.value.center.x -
          (objectToInsert.width * objectToInsert.scaleX) / 2;
        y =
          this.canvasMeta.value.center.y -
          (objectToInsert.height * objectToInsert.scaleY) / 2;
      }

      objectToInsert.set({
        left: x,
        top: y,
        transparentCorners: this.canvasMeta.value.transparentCorners,
        borderColor: this.canvasMeta.value.borderColor,
        cornerSize: this.canvasMeta.value.cornerSize,
        cornerColor: this.canvasMeta.value.cornerColor
      });
      this.canvas.add(objectToInsert);
      this.canvas.setActiveObject(objectToInsert);
      this.canvas.requestRenderAll();
      this.saveHistory();
    }
  };

  updateCanvasState = () => {
    this.appMeta.board.data[this.appMeta.board.currentIndex].state = this.canvas.toJSON(
      this.canvasMeta.value.propertiesToInclude
    );
    this.appMeta.board.data[this.appMeta.board.currentIndex].state.canvas = {
      width: this.canvas.width,
      height: this.canvas.height
    };
    return this.appMeta.board.data[this.appMeta.board.currentIndex].state;
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

  saveHistory = () => {
    if (this.canvasMeta.flag.cropEnabled) return;

    let currentState = this.canvas.toJSON(this.canvasMeta.value.propertiesToInclude);

    this.canvasMeta.flag.isDirty = true;

    if (this.appMeta.board.update.exist == false) {
      this.appMeta.board.update.exist = true;
      this.appMeta.board.update.method = this.debounce(
        this.updateBoard,
        this.appMeta.board.update.delay
      );
    }

    // If a modification took place while under undo/redo state
    if (this.canvasMeta.currentHistoryIndex !== this.canvasMeta.currentHistory.length - 1)
      this.canvasMeta.currentHistory.splice(this.canvasMeta.currentHistoryIndex + 1);

    this.canvasMeta.currentHistory.push(currentState);
    this.canvasMeta.currentHistoryIndex++;

    this.appMeta.board.data[this.appMeta.board.currentIndex].state = currentState;
    // call the method
    this.appMeta.board.update.method();
  };

  updateBoard = () => {
    if (this.canvasMeta.flag.cropEnabled) return;

    let previewObject = '';
    try {
      previewObject = this.canvas.toDataURL({
        format: 'image/jpeg',
        quality: 0.2
        // multiplier: 0.2
      });
    } catch (err) {
      previewObject =
        'data:image/png;base64,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';
      console.log(err);
    }

    this.boardService.updateBoard(new Board({
      uuid: this.appMeta.board.data[this.appMeta.board.currentIndex].uuid,
      title: this.appMeta.board.data[this.appMeta.board.currentIndex].title,
      state: JSON.stringify(this.updateCanvasState()),
      preview: previewObject
    })).subscribe(board => {
      this.canvasMeta.flag.isDirty = false;
    });
  };

  updateToolbar = () => {
    if (this.appMeta.flag.isFontToolbarDirty) {
      $(this.appMeta.identifier.fontFamily)
        .val(this.appMeta.value.fontFamily)
        .attr('selected', "true");
      $(this.appMeta.identifier.fontSize)
        .val(this.appMeta.value.fontSize)
        .attr('selected', "true");
      $(this.appMeta.identifier.fontColor)
        .val(this.appMeta.value.fontColor)
    }

    // toggle visibility of toolbar elements based on flag
    $(this.appMeta.identifier.fontToolbarElement).toggle(
      this.canvasMeta.flag.isCurrentObjectText
    );
    $(this.appMeta.identifier.imageToolbarElement).toggle(
      this.canvasMeta.flag.isCurrentObjectImage
    );
    $(this.appMeta.identifier.transparentToolbarElement).toggle(
      this.canvasMeta.flag.isCurrentObjectTransparentable &&
      !this.canvasMeta.flag.isCurrentObjectTransparentSelected
    );
    $(this.appMeta.identifier.undoTransparentToolbarElement).toggle(
      this.canvasMeta.flag.isCurrentObjectTransparentable &&
      this.canvasMeta.flag.isCurrentObjectTransparentSelected
    );
    $(this.appMeta.identifier.completeToolbarElement).toggle(
      !this.appMeta.flag.isPreviewEnabled || !this.canvasMeta.flag.isCurrentSelectionEmpty
    );
    // had to do it this way because of css important on flex
    $(this.appMeta.identifier.completeTitleElement).css(
      'visibility',
      this.appMeta.flag.isPreviewEnabled ? 'hidden' : 'visible'
    );
    $(this.appMeta.identifier.cropToolbarElement).toggle(this.canvasMeta.flag.cropEnabled);
  };

  renderAppMeta = () => {

    // enable
    // if (this.appMeta.flag.isAssetDirty) {
    //   this.appMeta.flag.isAssetDirty = false;
    //   $(this.appMeta.template.privateProduct.container).html(
    //     this.appMeta.template.privateProduct.renderer({
    //       products: this.appMeta.asset
    //         .filter(x => x.user_id == this.appMeta.value.userID)
    //         .map(x => {
    //           return {
    //             main_image: this.appMeta.endpoint.uploadsDir + (x.transparent_path ? x.transparent_path : x.path),
    //             type: 'custom'
    //           };
    //         })
    //     })
    //   );
    //   $(this.appMeta.template.publicProduct.container).html(
    //     this.appMeta.template.publicProduct.renderer({
    //       products: this.appMeta.asset
    //         .filter(x => !x.is_private)
    //         .map(x => {
    //           return {
    //             main_image: x.transparent_path ? x.transparent_path : x.path,
    //             type: 'custom'
    //           };
    //         })
    //     })
    //   );
    // }

    // if (this.appMeta.flag.isProductPanelDirty) {
    //   this.appMeta.flag.isProductPanelDirty = false;
    //   $(this.appMeta.template.productPanel.container).html(
    //     this.appMeta.template.productPanel.renderer({
    //       index: this.appMeta.value.currentSelectedItem,
    //       main_image: this.appMeta.asset[this.appMeta.value.currentSelectedItem]
    //         .transparent_path
    //         ? this.appMeta.asset[this.appMeta.value.currentSelectedItem].transparent_path
    //         : this.appMeta.asset[this.appMeta.value.currentSelectedItem].path,
    //       type: 'custom',
    //       name: this.appMeta.asset[this.appMeta.value.currentSelectedItem].name,
    //       site: 'custom',
    //       is_price: this.appMeta.asset[this.appMeta.value.currentSelectedItem].price
    //     })
    //   );
    // }

    if (this.appMeta.flag.isBoardItemDirty) {
      this.appMeta.flag.isBoardItemDirty = false;

      let imageObjects = this.canvas.getObjects('image');

      imageObjects.forEach((object, index) => {
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

      if (imageObjects.length > 0) {
        this.boardPreviewProducts = imageObjects.map((x, y) => {
          return {
            index: y + 1,
            name: x.referenceObject.name,
            brand: x.referenceObject.brand,
            price: x.referenceObject.price
              ? '$' + x.referenceObject.price
              : ''
          };
        })
      }
    }
  };

  debounce = (func, wait, immediate = false) => {
    var timeout;

    return function () {
      var context = this,
        args = arguments;
      var callNow = immediate && !timeout;
      clearTimeout(timeout);

      // Set the new timeout
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      }, wait);
      if (callNow) func.apply(context, args);
    };
  };

  keepPositionInBounds = () => {
    let zoom = this.canvas.getZoom();
    let xMin = ((2 - zoom) * this.canvas.getWidth()) / 2;
    let xMax = (zoom * this.canvas.getWidth()) / 2;
    let yMin = ((2 - zoom) * this.canvas.getHeight()) / 2;
    let yMax = (zoom * this.canvas.getHeight()) / 2;

    let point = new fb.Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2);
    let center = fb.util.transformPoint(point, this.canvas.viewportTransform);

    let clampedCenterX = this.clamp(center.x, xMin, xMax);
    let clampedCenterY = this.clamp(center.y, yMin, yMax);

    let diffX = clampedCenterX - center.x;
    let diffY = clampedCenterY - center.y;

    if (diffX != 0 || diffY != 0) {
      this.canvas.relativePan(new fb.Point(diffX, diffY));
    }
  };

  clamp = (value, min, max) => {
    return Math.max(min, Math.min(value, max));
  };

  zoomIn = () => {
    this.canvasMeta.flag.isZoomed = true;
    this.canvasMeta.value.zoomValue += this.canvasMeta.value.zoomFactor;
    this.canvas.zoomToPoint(this.canvasMeta.value.center, this.canvasMeta.value.zoomValue);
    this.handleResize();
  };

  zoomOut = () => {
    if (this.canvasMeta.value.zoomValue > 0.5) {
      // set default color
      this.canvas.setBackgroundColor('#f2f3f4');
      this.canvasMeta.value.zoomValue -= this.canvasMeta.value.zoomFactor;
      this.canvas.zoomToPoint(this.canvasMeta.value.center, this.canvasMeta.value.zoomValue);
      // handling a glitch in zooming out with background
      // this.keepPositionInBounds();
    } else this.canvasMeta.flag.isZoomed = false;

    this.handleResize();
  };

  undo = () => {
    // Undo is possible
    if (this.canvasMeta.currentHistoryIndex > 0) {
      this.canvasMeta.currentHistoryIndex--;
      this.updateStateFromHistory();
    }
  };
  redo = () => {
    // Redo is possible
    if (this.canvasMeta.currentHistoryIndex < this.canvasMeta.currentHistory.length - 1) {
      this.canvasMeta.currentHistoryIndex++;
      this.updateStateFromHistory();
    }
  };
  selectAll = () => {
    this.canvas.discardActiveObject();
    let selection = new fb.ActiveSelection(this.canvas.getObjects(), {
      canvas: this.canvas,
    });
    this.canvas.setActiveObject(selection);
    this.canvas.requestRenderAll();
  };

  handleCrop = (action = undefined, secondaryAction = false) => {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.selection = true;

      if (this.canvasMeta.value.crop.box) {
        this.canvas.remove(this.canvasMeta.value.crop.box);
        this.canvasMeta.value.crop.box = false;
      }

      switch (action) {
        case true:
          this.canvasMeta.flag.cropEnabled = false;
          this.appMeta.flag.isPreviewEnabled = false;
          this.canvasMeta.value.crop.active.angle = this.canvasMeta.value.crop.copy.angle;
          this.canvasMeta.value.crop.active.flipX = this.canvasMeta.value.crop.copy.flipX;
          this.canvasMeta.value.crop.active.top = this.canvasMeta.value.crop.copy.top;
          this.canvasMeta.value.crop.active.left = this.canvasMeta.value.crop.copy.left;
          this.saveHistory();
          break;
        case false:
          if (secondaryAction) this.canvasMeta.value.crop.active.clipPath = false;
          else
            this.canvasMeta.value.crop.active.clipPath =
              this.canvasMeta.value.crop.copy.clipPath;

          this.canvasMeta.value.crop.active.dirty = true;
          this.canvasMeta.flag.cropEnabled = false;
          this.appMeta.flag.isPreviewEnabled = false;
          break;
        case undefined:
          this.canvas.selection = false;

          this.canvasMeta.flag.cropEnabled = true;
          this.appMeta.flag.isPreviewEnabled = true;

          this.canvasMeta.value.crop.copy = Object.assign({}, activeObject);

          activeObject.angle = 0;
          activeObject.flipX = false;
          // activeObject.referenceObject.isCropped = true;
          // activeObject.referenceObject.originalSrc = this.canvasMeta.value.crop.copy.src;
          this.canvasMeta.value.crop.active = activeObject;

          this.canvasMeta.value.crop.box = new fb.Rect({
            width: activeObject.width,
            height: activeObject.height,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            top: activeObject.top,
            left: activeObject.left,
            fill: '',
            transparentCorners: false
          });

          if (this.canvasMeta.value.crop.active.clipPath) {
            let center = activeObject.getCenterPoint();
            this.canvasMeta.value.crop.box.width =
              this.canvasMeta.value.crop.active.clipPath.width;
            this.canvasMeta.value.crop.box.height =
              this.canvasMeta.value.crop.active.clipPath.height;
            this.canvasMeta.value.crop.box.left =
              center.x +
              this.canvasMeta.value.crop.active.clipPath.left * activeObject.scaleX;
            this.canvasMeta.value.crop.box.top =
              center.y +
              this.canvasMeta.value.crop.active.clipPath.top * activeObject.scaleY;
          }

          this.canvasMeta.value.crop.box.on('scaling', this.applyCrop);
          this.canvasMeta.value.crop.box.on('mouseup', this.applyCrop);
          this.canvasMeta.value.crop.box.on('moving', this.applyCrop);

          this.canvasMeta.value.crop.box.setControlsVisibility(
            this.canvasMeta.value.crop.control
          );

          this.canvas.add(this.canvasMeta.value.crop.box);
          this.canvas.setActiveObject(this.canvasMeta.value.crop.box);

          break;
      }

      this.canvas
        .getObjects()
        .forEach(object => (object.selectable = this.canvas.selection));
      this.canvas.renderAll();
      this.updateToolbar();
    }
  };

  applyCrop = e => {
    let rect = this.canvasMeta.value.crop.box;
    let image = this.canvasMeta.value.crop.active;

    let maxScaleX = (image.width * image.scaleX) / rect.width;
    let maxScaleY = (image.height * image.scaleY) / rect.height;

    if (rect.scaleX > maxScaleX || rect.scaleY > maxScaleY) {
      rect.scaleX = Math.min(rect.scaleX, maxScaleX);
      rect.scaleY = Math.min(rect.scaleY, maxScaleY);
    }

    if (rect.top < image.top || rect.left < image.left) {
      rect.top = Math.max(rect.top, image.top);
      rect.left = Math.max(rect.left, image.left);
    }

    if (
      rect.top + rect.height * rect.scaleY >
      image.top + image.height * image.scaleY ||
      rect.left + rect.width * rect.scaleX >
      image.left + image.width * image.scaleX
    ) {
      rect.top = Math.min(
        rect.top,
        image.top + image.height * image.scaleY - rect.height * rect.scaleY
      );
      rect.left = Math.min(
        rect.left,
        image.left + image.width * image.scaleY - rect.width * rect.scaleX
      );
    }

    let offsetX = (rect.left - image.left) / image.scaleX;
    let offsetY = (rect.top - image.top) / image.scaleY;

    offsetX = offsetX <= 1 ? 0 : offsetX;
    offsetY = offsetY <= 1 ? 0 : offsetY;

    let mask = new fb.Rect({
      width: (rect.width * rect.scaleX) / image.scaleX,
      height: (rect.height * rect.scaleY) / image.scaleY,
      left: (image.width / 2) * -1 + offsetX,
      top: (image.height / 2) * -1 + offsetY
    });

    image.clipPath = mask;
    image.dirty = true;
  };

  action = type => {
    let activeObject = this.canvas.getActiveObject();

    switch (type) {
      case 'flip':
        activeObject.set('flipX', !activeObject.flipX);
        break;
      case 'bringForward':
        activeObject.bringForward();
        break;
      case 'sendBackward':
        activeObject.sendBackwards();
        break;
      case 'delete':
        this.canvas.remove(activeObject);
        break;
      case 'duplicate':
        activeObject.clone(clone => {
          clone.set({
            left: clone.left + this.canvasMeta.value.cloneOffset,
            top: clone.top + this.canvasMeta.value.cloneOffset
          });

          this.canvas.add(clone);
          clone.setControlsVisibility(this.canvasMeta.value.hideControls);
          this.canvas.setActiveObject(clone);
        }, this.canvasMeta.value.propertiesToInclude);

        break;
      case 'transparent':
        if (activeObject.referenceObject.type == 'custom') {
          var dimentionBefore = {
            width: activeObject.width,
            height: activeObject.height,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY
          };
          this.canvasMeta.flag.isCurrentObjectTransparentable = false;
          this.canvasMeta.flag.isCurrentObjectTransparentSelected = false;
          this.updateToolbar();
          this.boardService.updateAsset(new Asset({
            asset_id: activeObject.referenceObject.id,
          })).subscribe(response => {
              activeObject.referenceObject.transparentPath =
                response.transparent_path;
              activeObject.setSrc(response.transparent_path, () => {
                activeObject.scaleX =
                  (dimentionBefore.width * dimentionBefore.scaleX) /
                  activeObject.width;
                activeObject.scaleY =
                  (dimentionBefore.height * dimentionBefore.scaleY) /
                  activeObject.height;
                this.canvasMeta.flag.isCurrentObjectTransparentSelected = true;
                this.canvas.discardActiveObject();
                this.updateToolbar();
                this.canvas.renderAll();
              });
            });
        }
        break;
      case 'undoTransparent':
        if (activeObject.referenceObject.type == 'custom') {
          var dimentionBefore = {
            width: activeObject.width,
            height: activeObject.height,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY
          };
          this.canvasMeta.flag.isCurrentObjectTransparentable = false;
          this.canvasMeta.flag.isCurrentObjectTransparentSelected = false;
          this.updateToolbar();
          activeObject.setSrc(activeObject.referenceObject.path, () => {
            activeObject.scaleX =
              (dimentionBefore.width * dimentionBefore.scaleX) /
              activeObject.width;
            activeObject.scaleY =
              (dimentionBefore.height * dimentionBefore.scaleY) /
              activeObject.height;
            this.canvasMeta.flag.isCurrentObjectTransparentSelected = false;
            this.canvas.discardActiveObject();
            this.updateToolbar();
            this.canvas.renderAll();
          });
        }
        break;
    }

    this.canvas.requestRenderAll();
    this.saveHistory();
  };

  handlePreviewMode = (targetLink) => {
    let toggle = targetLink == 'board';
    // if a different tab was clicked and preview was enabled or disabled
    if (targetLink == 'board' || this.appMeta.value.lastVisitedTab == 'board') {
      this.appMeta.value.lastVisitedTab = targetLink;

      // check if state has changed
      if (this.appMeta.flag.isPreviewEnabled !== toggle)
        this.appMeta.flag.isPreviewEnabled = toggle;

      this.updateToolbar();
      this.canvas.selection = !toggle;
      this.canvas.discardActiveObject();

      this.canvas.getObjects().forEach(object => {
        object.selectable = !toggle;
        if (object.type == 'text' && !toggle) this.canvas.remove(object);
      });

      if (toggle) {
        this.appMeta.flag.isBoardItemDirty = true;
        this.renderAppMeta();
      }

      this.canvas.renderAll();
    }
  };

}
