import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SideNavItems } from './../sidenavitems';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import * as $ from 'jquery';
import { Board } from '../board';
import { Asset } from '../asset';
import { BoardService } from '../board.service';
import { Observable, Subscription } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MatDialog } from '@angular/material';
import { BoardPopupComponent } from '../board-popup/board-popup.component';
import { BoardPopupConfigComponent } from '../board-popup-config/board-popup-config.component';
import { boardRoutesNames } from '../board.routes.names';
import { Font, FontPickerService } from 'ngx-font-picker';
import { environment } from 'src/environments/environment';
import { IProductPayload, IProductsPayload } from '../../../shared/models';
import { ApiService, EventEmitterService } from '../../../shared/services';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';
declare const fb: any;

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.less', '../board.component.less']
})
export class BoardViewComponent implements OnInit, AfterViewInit {
  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog,
    public boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    private fontPickerService: FontPickerService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private eventEmitterService: EventEmitterService
  ) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.currentUser = user;

    if (router.getCurrentNavigation().extras.state) {
      this.justCreated = router.getCurrentNavigation().extras.state.justCreated;
    }
  }
  shortcuts: ShortcutInput[] = [];
  productsSubscription: Subscription;
  favoriteProducts: IProductPayload[];
  selectedItem = 'select';
  selectedCategory = null;
  showLoader = false;
  productForPreview = null;
  sideBarItems = SideNavItems;
  filterData: any = {};
  pageNo = 0;
  @ViewChild('browsefilter', { static: false }) browsefilter?: OverlayPanel;
  currentUser = null;
  xpandStatus = false;
  appliedFilters: string;
  showTab;
  fontPickerObject;
  isBoardApi = true;
  justCreated = false;
  initialUserID = 0;
  userEventSubscription: Subscription;
  tabletObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Tablet
  );
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  bpSubscription: Subscription;
  tabletSubscription: Subscription;
  isTablet = false;
  isHandset = false;
  showMenu = false;
  searchText: string;
  iPageNo = 0;
  iLimit: number;
  totalCount = 0;
  hasSearched: boolean;
  hasLoadedAllProducts = false;
  private pickr: Pickr;
  color: string;
  showPicker: boolean;
  hasCanvasLoader = false;
  hasFilterEnabled = false;
  hasPanelFixed = false;
  hasToggleIconTooltip: string;
  @ViewChild('colorPicker', { static: false })
  public colorPicker: ElementRef;

  public presetFonts = [
    'Allura',
    'Amatic',
    'Arial',
    'Courier',
    'Garamond',
    'Georgia',
    'Helvetica',
    'Italianno',
    'Montserrat',
    'Open Sans',
    'Roboto Slab',
    'Times'
  ];
  public font: Font = new Font({
    family: '',
    size: '48px',
    style: 'regular',
    styles: ['regular']
  });

  canvas: any;
  canvasMeta = {
    identifier: {
      // simple identifier
      id: 'canvas-area',
      containerArea: 'canvas-inner-container',
      // specific identifier
      dropArea: '#canvas-droparea'
    },
    value: {
      center: {
        x: 0,
        y: 0
      },
      aspectRatio: (16 / 10).toFixed(2),
      zoomValue: 1,
      zoomFactor: 0.1,
      borderColor: '#b76e79',
      cornerSize: 10,
      cornerColor: '#b76e79',
      cornerStyle: 'circle',
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
        'transparentCorners',
        'borderColor',
        'cornerSize',
        'cornerColor',
        'cornerStyle',
        'referenceObject'
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
        box: null
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
      isCurrentObjectTransparentSelected: false
    }
  };
  appMeta = {
    asset: [],
    board: {
      data: [],
      currentIndex: 0,
      update: {
        exist: false,
        method: () => {},
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
      fontFamily: 'Roboto',
      fontSize: '48',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#000000',
      userID: 1,
      currentSelectedItem: 0,
      lastVisitedTab: '',
      scaleFactor: 0
    },
    identifier: {
      customProduct: '.product-image[type="custom"]',

      boardTitle: '.board-title',
      tab: '.nav-link',
      currentDragableObject: '.dragging',

      fontFamily: '.js-font-select',
      fontSize: '.js-font-select-size',
      fontColor: '.pickr',

      completeActionElement: '.item-action-icons ',
      completeTitleElement: '.top-panel-hide',

      fontToolbarElement: '.editor-icons',
      imageToolbarElement: '.image-icons',
      cropToolbarElement: '.crop-toolbar',
      transparentToolbarElement: '.do-transparent',
      undoTransparentToolbarElement: '.undo-transparent',

      dropzoneElement: '.add-new',

      uploadByURL: 'input[name="url"]',
      uploadByURLName: 'input[name="name"]',
      uploadByURLPrice: 'input[name="price"]',
      uploadByURLIsPrivate: 'input[name="is_private"]',
      uploadByURLSubmit: '#step3 .red-button',

      backgroundColorElement: '.canvas-pallete-color',
      floorPatternElement: '.canvas-pallete-wood-patterns',

      manualDrop: '.manual-drop',
      topLevelElement: '.lazysuzy-board'
    }
  };

  facebookRedirect = '';
  googleRedirect = '';
  remoteProducts = [];
  boardPreviewProducts = [];

  search(isNewSearch = false) {
    if (isNewSearch) {
      this.hasLoadedAllProducts = false;
    }
    if (this.isHandset) {
      this.hasPanelFixed = false;
    }
    if (!this.hasSearched) {
      this.remoteProducts = [];
    }
    this.showLoader = true;
    this.iLimit = 24;
    this.iPageNo = isNewSearch ? 0 : this.iPageNo;
    const queryString = JSON.stringify({
      from: this.iPageNo * this.iLimit,
      size: this.iLimit,
      query: {
        bool: {
          must: [
            {
              match: {
                name: {
                  query: this.searchText + '*'
                }
              }
            },
            {
              match: {
                image_xbg_processed: {
                  query: 1
                }
              }
            }
          ]
        }
      }
    });

    if (this.selectedItem === 'select') {
      this.selectedItem = 'browse';
    }
    this.productsSubscription = this.apiService
      .getSearchProducts(queryString)
      .subscribe((payload: any) => {
        const { hits } = payload.hits;
        this.hasSearched = true;
        const products = hits
          .map((hit: any) => hit._source)
          .map((p) => {
            return {
              ...p,
              product_detail_url: `www.lazysuzy.com/product/${p.product_sku}`
            };
          });

        this.remoteProducts = isNewSearch
          ? products
          : [...this.remoteProducts, ...(products || [])];
        this.remoteProducts = this.remoteProducts.map((ele, i) => {
          return {
            ...ele,
            site: ele.site_name,
            refId: i
          };
        });
        this.checkFilterEnabled(this.filterData);
        if (products.length < 24 || products.length === 0) {
          this.hasLoadedAllProducts = true;
        }
        this.iPageNo += 1;
        this.showLoader = false;
      });
  }
  updateFontAndSize(font: Font) {
    const fontCss = font.getStyles();
    this.appMeta.value.fontFamily = fontCss['font-family'];
    this.appMeta.value.fontSize = fontCss['font-size'].replace('px', '');
    this.appMeta.value.fontStyle = fontCss['font-style'];
    this.appMeta.value.fontWeight = fontCss['font-weight'];
    this.appMeta.flag.isFontToolbarDirty = true;
    this.addFontFamilyIfNotAdded(fontCss['font-family']);
    this.updateCurrentObject(true);
  }

  openPopup(param: string) {
    if (
      this.appMeta.board.data[this.appMeta.board.currentIndex].type_privacy ===
        0 &&
      param === 'share'
    ) {
      this.appMeta.board.data[this.appMeta.board.currentIndex].type_privacy = 1;
      this.updateBoard();
    }

    const dialogRef = this.dialog.open(BoardPopupComponent, {
      panelClass: 'board-popup-dialog-container',
      data: {
        type: param,
        board: this.appMeta.board.data[this.appMeta.board.currentIndex]
      },
      autoFocus: false,
      width: '100%'
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    // });
  }
  toggleMenu(event: any) {
    this.showMenu = !this.showMenu;
    this.hideMenuMsg(event);
  }
  openBoardConfig() {
    const dialogRef = this.dialog.open(BoardPopupConfigComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        color: this.canvas.backgroundColor
          ? (
              '#' + new fb.Color(this.canvas.backgroundColor).toHex()
            ).toLocaleLowerCase()
          : null,
        background: this.canvas.backgroundImage
          ? this.canvas.backgroundImage._element.currentSrc
          : ''
      },
      width: '70%',
      autoFocus: false
    });

    dialogRef.componentInstance.onChange.subscribe(this.handleConfigChange);
  }

  selectSideBarItem(item) {
    this.selectedItem = item.value;
    if (this.selectedItem === 'browse') {
      this.filterData = {};
      this.appliedFilters = '';
      this.iPageNo = 0;
      this.remoteProducts = [];
      this.pageNo = 0;
      const selCat = this.boardService.getCategory();
      if (this.hasSearched) {
        this.search();
      } else {
        this.getBrowseData(selCat);
      }
      this.productForPreview = null;
    }
    this.productForPreview = null;
    this.handlePreviewMode(this.selectedItem);
  }

  handleFiltersUpdates(event) {
    if (event.name === 'APPLY_FILTERS' || event.name === 'CLEAR_FILTERS') {
      // Apply filters
      this.xpandStatus = false;
      this.appliedFilters = event.payload;
      const selCat = this.boardService.getCategory();
      this.remoteProducts = [...[]];
      this.pageNo = 0;
      this.hasSearched = false;
      this.getBrowseData(selCat);
    } else if (event.name === 'CANCEL_FILTERS') {
      this.xpandStatus = false;
    }
  }

  handleAddProductBoardPreview($event) {}

  handleSelectCategory($event) {
    this.boardService.setCategory($event);
    this.hasSearched = false;
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
    if (this.selectedCategory !== categ) {
      this.hasLoadedAllProducts = false;
    }
    this.selectedCategory = categ;
    this.showLoader = true;
    this.hasSearched = false;
    this.boardService
      .getBrowseTabData(this.selectedCategory, this.appliedFilters, this.pageNo)
      .subscribe((s: any) => {
        this.remoteProducts = [...this.remoteProducts, ...(s.products || [])];
        this.remoteProducts = this.remoteProducts.map((ele, i) => {
          return {
            ...ele,
            refId: i
          };
        });
        delete s.filterData.category;
        this.filterData = s.filterData || {};
        this.pageNo++;
        this.checkFilterEnabled(this.filterData);
        if (s.products.length < 24 || s.products.length === 0) {
          this.hasLoadedAllProducts = true;
        }
        this.boardService.setBoardData(
          this.remoteProducts,
          this.selectedCategory,
          s.filterData || {}
        );
        this.showLoader = false;
      });
  }

  checkFilterEnabled(filterData) {
    const keys = Object.keys(filterData);
    const filters = keys.filter((data) => data !== 'price');
    for (const key of filters) {
      for (const i in filterData[key]) {
        if (filterData[key][i].enabled) {
          this.hasFilterEnabled = true;
          break;
        }
      }
      if (this.hasFilterEnabled) {
        break;
      }
    }
  }
  onSearchFocus() {
    if (this.isHandset) {
      this.hasPanelFixed = true;
    }
  }
  onSearchBlur() {
    if (this.isHandset) {
      this.hasPanelFixed = false;
    }
  }
  loadMore() {
    const selCat = this.boardService.getCategory();
    if (this.hasSearched) {
      this.search();
    } else {
      this.getBrowseData(selCat);
    }
  }

  handleGoToSelect(event) {
    this.boardService.resetBoard();
    this.iPageNo = 0;
    this.hasSearched = false;
    this.selectSideBarItem({
      name: 'Select',
      label: 'Select',
      value: 'select',
      route: 'board-select'
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.handleResize();
  }
  onScrollEvent(event) {
    const element: any = document.getElementsByClassName('product-container');
    if (
      element[0].scrollHeight - element[0].scrollTop ===
        element[0].clientHeight ||
      element[0].scrollHeight - element[0].scrollTop < element[0].clientHeight
    ) {
      if (this.hasLoadedAllProducts) {
        return;
      } else {
        this.loadMore();
      }
    }
  }


  hideMenuMsg(event: any) {
    event.stopPropagation();
    if (this.hasToggleIconTooltip === 'true') {
      this.hasToggleIconTooltip = 'false';
      localStorage.setItem('hasTooltip', 'false');
    }
  }

  ngOnInit(): void {
    // if there is a change in user after the first boot then redirect
    this.userEventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        if (this.appMeta.flag.isBoot) {
          this.initialUserID = user.id;
        } else {
          // if the change came after the first boot
          // redirect the user only the changed user is different then the one before
          if (this.initialUserID !== user.id) {
            this.router.navigate(['../../' + boardRoutesNames.BOARD_LIST], {
              relativeTo: this.route
            });
          }
        }
      });
    this.eventEmitterService.assets.subscribe((assets) => this.getAssets());
    // this.eventEmitterService.updateAssetsEvent
    //   .asObservable()
    //   .subscribe((user) => {
    //     console.log(user);
    //     this.getAssets();
    //   });
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
    this.hasToggleIconTooltip = localStorage.getItem('hasTooltip');
    this.productsSubscription = this.apiService
      .getWishlistProducts(this.isBoardApi)
      .subscribe((payload: IProductsPayload) => {
        this.favoriteProducts = payload.products;
        this.favoriteProducts = this.favoriteProducts.map((ele, i) => {
          return {
            ...ele,
            refId: i
          };
        });
      });
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isTablet = handset.matches;
      }
    );
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    if (!this.isTablet) {
      this.tabletSubscription = this.tabletObserver.subscribe(
        (tablet: BreakpointState) => {
          this.isTablet = tablet.matches;
        }
      );
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked() {
    $('.size-select').on('focus', (e) => {
      $('.font-picker').addClass('visibleFontPicker');
      $('.editor-icons').addClass('displayEditor');
      $('.item-action-icons').addClass('displayEditor');
    });
    $('.size-select').on('blur', (e) => {
      $('.font-picker').removeClass('visibleFontPicker');
      $('.editor-icons').removeClass('displayEditor');
      $('.item-action-icons').removeClass('displayEditor');
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if ($('.size-select').is(':focus')) {
      return;
    } else {
      // tslint:disable-next-line: deprecation
      if (event.keyCode === 46 || event.keyCode === 8) {
        this.applyShortcut('action', 'delete');
      }
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'up',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'top', -1),
        preventDefault: true
      },
      {
        key: 'down',
        command: (e) => this.applyShortcut('activeObjectFetchAssign', 'top', 1),
        preventDefault: true
      },
      {
        key: 'left',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'left', -1),
        preventDefault: true
      },
      {
        key: 'right',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'left', 1),
        preventDefault: true
      },
      {
        key: 'shift + up',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'top', -10),
        preventDefault: true
      },
      {
        key: 'shift + down',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'top', 10),
        preventDefault: true
      },
      {
        key: 'shift + left',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'left', -10),
        preventDefault: true
      },
      {
        key: 'shift + right',
        command: (e) =>
          this.applyShortcut('activeObjectFetchAssign', 'left', 10),
        preventDefault: true
      },
      {
        key: 'esc',
        command: (e) => this.applyShortcut('deselectOrCancel', ''),
        preventDefault: true
      },
      {
        key: 't',
        command: (e) => this.applyShortcut('addText', ''),
        preventDefault: true
      },
      {
        key: ['ctrl + z', 'cmd + z'],
        command: (e) => this.applyShortcut('direct', 'undo'),
        preventDefault: true
      },
      {
        key: ['ctrl + y', 'cmd + y'],
        command: (e) => this.applyShortcut('direct', 'redo'),
        preventDefault: true
      },
      {
        key: ['ctrl + plus', 'cmd + plus', 'ctrl + =', 'cmd + ='],
        command: (e) => this.applyShortcut('direct', 'zoomIn'),
        preventDefault: true
      },
      {
        key: ['ctrl + -', 'cmd + -', 'ctrl + _', 'cmd + _'],
        command: (e) => this.applyShortcut('direct', 'zoomOut'),
        preventDefault: true
      },
      {
        key: ['ctrl + a', 'cmd + a'],
        command: (e) => this.applyShortcut('direct', 'selectAll'),
        preventDefault: true
      },
      {
        key: ['ctrl + d', 'cmd + d'],
        command: (e) => this.applyShortcut('action', 'duplicate'),
        preventDefault: true
      },
      {
        key: ['ctrl + f', 'cmd + f'],
        command: (e) => this.applyShortcut('action', 'flip'),
        preventDefault: true
      },
      {
        key: ['ctrl + b', 'cmd + b'],
        command: (e) => this.applyShortcut('toggleBackground', ''),
        preventDefault: true
      },
      {
        key: ['ctrl + r', 'cmd + r'],
        command: (e) => this.applyShortcut('initializeCrop', ''),
        preventDefault: true
      },
      {
        key: ['ctrl + up', 'cmd + up'],
        command: (e) => this.applyShortcut('action', 'bringForward'),
        preventDefault: true
      },
      {
        key: ['ctrl + down', 'cmd + down'],
        command: (e) => this.applyShortcut('action', 'sendBackward'),
        preventDefault: true
      },
      {
        key: 'ctrl + u',
        command: (e) => this.openPopup('publish'),
        preventDefault: true
      },
      {
        key: 'enter',
        command: (e) => this.applyShortcut('confirmCrop', ''),
        preventDefault: true
      }
    );
    this.pickr = new Pickr({
      el: this.colorPicker.nativeElement,
      container: '.pickr-container',
      default: '#42445A',
      theme: 'nano',
      swatches: [
        '#777777',
        '#000000',
        '#0055cc',
        '#005580',
        '#468847',
        '#f89406',
        '#9d261d',
        '#7a43b6',
        '#cccccc',
        '#222222',
        '#337ab7',
        '#2f96b4',
        '#46a546',
        '#fbb450',
        '#bd362f',
        '#c3325f',
        '#eeeeee',
        '#333333',
        '#0088cc',
        '#5bc0de',
        '#62c462',
        '#ffc40d',
        '#b94a48',
        '#ee5f5b',
        '#ffffff',
        '#555555',
        '#049cdb',
        '#d9edf7',
        '#dff0d8',
        '#f3edd2',
        '#c09853',
        '#f2dede'
      ],
      showAlways: false,
      components: {
        preview: false,
        opacity: false,
        hue: false,

        interaction: {
          hex: false,
          rgba: false,
          hsva: false,
          input: true,
          clear: false,
          save: false
        }
      }
    });
    this.pickr.on('change', (instance) => {
      this.appMeta.value.fontColor = '#' + instance.toHEXA().join('');
      this.pickr.setColor(this.appMeta.value.fontColor);
      this.updateCurrentObject(true);
      // this.showPicker = false;
      this.appMeta.flag.isFontToolbarDirty = true;
    });
    this.pickr.on('cancel', (instance) => {
      this.showPicker = false;
    });
    this.pickr.on('hide', (instance) => {
      this.showPicker = false;
    });
  }
  onDestroy() {
    this.userEventSubscription.unsubscribe();
  }

  applyShortcut = (action, name, value = 0) => {
    const activeObject = this.canvas.getActiveObject();

    if (action === 'deselectOrCancel') {
      if (this.canvasMeta.flag.cropEnabled) {
        this.handleCrop(false);
      } else {
        this.canvas.discardActiveObject();
      }
    } else if (action === 'action' && activeObject) {
      this.action(name);
    } else if (action === 'activeObjectFetchAssign' && activeObject) {
      activeObject.set(name, activeObject[name] + value);
    } else if (action === 'direct') {
      this[name]();
    } else if (
      action === 'initializeCrop' &&
      activeObject &&
      activeObject.type === 'image'
    ) {
      this.handleCrop();
    } else if (
      action === 'confirmCrop' &&
      activeObject &&
      this.canvasMeta.flag.cropEnabled
    ) {
      this.handleCrop(true);
    } else if (action === 'toggleBackground' && activeObject) {
      if (
        (this.canvasMeta.flag.isCurrentObjectTransparentable &&
          !this.canvasMeta.flag.isCurrentObjectTransparentSelected) === true
      ) {
        this.action('transparent');
      } else if (
        (this.canvasMeta.flag.isCurrentObjectTransparentable &&
          this.canvasMeta.flag.isCurrentObjectTransparentSelected) === true
      ) {
        this.action('undoTransparent');
      }
    } else if (action === 'addText') {
      const textToInsert = new fb.Textbox('Text', {
        fontFamily: this.appMeta.value.fontFamily,
        fontSize: this.appMeta.value.fontSize,
        fill: '#000000'
      });
      textToInsert.setControlsVisibility(this.canvasMeta.value.textControl);
      this.applyDrop(false, textToInsert);
    }

    this.canvas.requestRenderAll();
    // tslint:disable-next-line: semicolon
  };

  selectColor() {
    this.showPicker = true;
    this.pickr.show();
  }
  getConfig = (callback) => {
    // this.canvasMeta.configuration = response.reduce(function (r, e) {
    //   r[e.name] = e.value;
    //   return r;
    // }, {});

    if (callback) {
      callback();
    }
    // tslint:disable-next-line: semicolon
  };

  getBoards = () => {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    this.boardService.getBoardByID(uuid).subscribe((response) => {
      let boardFound = false;
      this.appMeta.board.data = response;
      this.appMeta.board.data.forEach((boardObject, objectIndex) => {
        // convert state back to json
        this.appMeta.board.data[objectIndex].state = JSON.parse(
          boardObject.state
        );
        if (boardObject.uuid === uuid) {
          boardFound = true;
          if (boardObject.state) {
            this.appMeta.board.currentIndex = objectIndex;
            if (boardObject.title !== 'Untitled Board') {
              $(this.appMeta.identifier.boardTitle).val(boardObject.title);
            }
            this.canvasMeta.currentHistory.push(boardObject.state);
            this.canvasMeta.currentHistoryIndex++;

            if (boardObject.state) {
              boardObject.state.objects.forEach((object) => {
                if (object.type === 'textbox') {
                  this.addFontFamilyIfNotAdded(object.fontFamily);
                }
              });
            }
            this.updateStateFromHistory();
          }
        }
      });

      // if board does not exist redirect user to board list
      if (boardFound === false) {
        this.router.navigate(['../../' + boardRoutesNames.BOARD_LIST], {
          relativeTo: this.route
        });
      } else if (this.justCreated) {
        this.updateBoard();
        this.openBoardConfig();
      }
    });
    // tslint:disable-next-line: semicolon
  };

  getAssets = () => {
    this.boardService.getAssets(true).subscribe((response) => {
      if (response.length > 0) {
        this.appMeta.asset = response.reverse();
        this.appMeta.flag.isAssetDirty = true;
        this.appMeta.flag.isProductPanelDirty = true;
        this.renderAppMeta();
      }
    });
    // tslint:disable-next-line: semicolon
  };
  handleAssetUpdate(event) {
    this.appMeta.asset = event;
  }
  initializeCanvas = (callback) => {
    this.canvas = new fb.Canvas(this.canvasMeta.identifier.id, {
      containerClass: this.canvasMeta.identifier.containerArea,
      preserveObjectStacking: true,
      useCors: true,
      origin: 'anonymous',
      allowTaint: true,
      foreignObjectRendering: true,
      backgroundColor: 'rgb(255,255,255)',
      selection: true
    });

    if (this.appMeta.flag.isBoot) {
      this.updateToolbar();
      this.handleResize();
    }
    // add class for detection
    $('.lazysuzy-board').on('dragstart dragend', (e) => {
      $(e.target).toggleClass(
        this.appMeta.identifier.currentDragableObject.replace('.', '')
      );
    });

    // update canvas center point
    this.updateCanvasCenter();

    // bind drop area events
    // tslint:disable-next-line: deprecation
    $(this.canvasMeta.identifier.dropArea).bind('drop', (e) => {
      const draggedObject = $(this.appMeta.identifier.currentDragableObject);
      const dropType = draggedObject.attr('drop-type');
      const referenceID = draggedObject.parent().attr('data-product');
      const referenceType = draggedObject.parent().attr('type');
      this.handleDrop(
        e,
        draggedObject,
        dropType,
        referenceID,
        referenceType,
        this.selectedItem
      );
    });

    // handle canvas events
    this.canvas.on('selection:created', this.handleSelection);
    this.canvas.on('selection:updated', this.handleSelection);
    this.canvas.on('selection:cleared', this.handleSelection);

    // stop objects from going out of canvas area
    this.canvas.on('object:moving', (e) => {
      return;
      const obj = e.target;
      const boundingRect = obj.getBoundingRect();
      // if object is too big ignore
      if (
        obj.currentHeight > obj.this.canvas.height ||
        obj.currentWidth > obj.this.canvas.width ||
        obj.clipPath
      ) {
        return;
      }

      obj.setCoords();

      if (!this.canvasMeta.flag.cropEnabled) {
        if (boundingRect.top < 0 || boundingRect.left < 0) {
          obj.top = Math.max(obj.top, obj.top - boundingRect.top);
          obj.left = Math.max(obj.left, obj.left - boundingRect.left);
        }

        if (
          boundingRect.top + boundingRect.height > obj.this.canvas.height ||
          boundingRect.left + boundingRect.width > obj.this.canvas.width
        ) {
          obj.top = Math.min(
            obj.top,
            obj.this.canvas.height -
              boundingRect.height +
              obj.top -
              boundingRect.top
          );
          obj.left = Math.min(
            obj.left,
            obj.this.canvas.width -
              boundingRect.width +
              obj.left -
              boundingRect.left
          );
        }
      }
    });
    this.canvas.on('object:modified', this.saveHistory);
    this.canvas.on('object:scaling', (event) => {
      this.font.size =
        (event.target.fontSize * event.target.scaleX).toFixed(0).toString() +
        'px';
    });
    this.canvas.on('object:modified', (event) => {
      if (event.target && event.target.type === 'textbox') {
        event.target.fontSize *= event.target.scaleX;
        event.target.fontSize = event.target.fontSize.toFixed(0);
        event.target.scaleX = 1;
        event.target.scaleY = 1;
        event.target._clearCache();
        this.font.size = event.target.fontSize + 'px';
      }
    });

    this.canvas.on('mouse:down', (e) => {
      if (this.canvasMeta.flag.isZoomed && !this.canvas.getActiveObject()) {
        this.canvasMeta.flag.panningEnabled = true;
        this.canvas.defaultCursor = 'move';
        this.canvas.selection = false;
      } else if (this.canvasMeta.flag.cropEnabled) {
        if (
          this.canvasMeta.value.crop.box &&
          (e.target == null || e.target.cacheKey !== undefined)
        ) {
          // if cropbox exist and empty area was clicked
          this.canvas.setActiveObject(this.canvasMeta.value.crop.box);
          this.handleCrop(true);
        }
      }
    });
    this.canvas.on('mouse:up', (e) => {
      this.canvasMeta.flag.panningEnabled = false;
      this.canvas.defaultCursor = 'default';
      this.canvas.selection = true;
    });
    this.canvas.on('mouse:move', (e) => {
      if (this.canvasMeta.flag.panningEnabled && e && e.e) {
        const delta = new fb.Point(e.e.movementX, e.e.movementY);
        this.canvas.relativePan(delta);

        if (this.canvasMeta.value.zoomValue > 1) {
          this.keepPositionInBounds();
        }
      }
    });

    if (callback) {
      callback();
    }
    // tslint:disable-next-line: semicolon
  };

  initializeAppMeta = () => {
    // Initialize font values
    $(this.appMeta.identifier.fontColor).on('div', (e) => {
      this.appMeta.value.fontColor = $(e.currentTarget).val().toString();
      this.appMeta.flag.isFontToolbarDirty = true;
      this.updateCurrentObject(true);
    });

    // tslint:disable-next-line: deprecation
    $(this.appMeta.identifier.boardTitle).change((e) => {
      this.appMeta.board.data[this.appMeta.board.currentIndex].title = $(
        this.appMeta.identifier.boardTitle
      ).val();

      if (this.appMeta.board.update.exist === false) {
        this.appMeta.board.update.exist = true;
        this.appMeta.board.update.method = this.debounce(
          this.updateBoard,
          this.appMeta.board.update.delay
        );
      }

      this.appMeta.board.update.method();
    });

    // handle custom product click for bottom sheet render
    $(document).on('click', this.appMeta.identifier.customProduct, (e) => {
      this.appMeta.flag.isProductPanelDirty = true;
      // tslint:disable-next-line: radix
      this.appMeta.value.currentSelectedItem = Number.parseInt(
        $(e.currentTarget).attr('data-product')
      );
      this.renderAppMeta();
    });

    // handle manual add
    $(document).on('click', this.appMeta.identifier.manualDrop, (e) => {
      const dropType = $(e.currentTarget).attr('drop-type');
      if (dropType === 'image') {
        const referenceID = $(e.currentTarget).attr('data-product');
        const referenceType = $(e.currentTarget).attr('type');
        const draggedObject = $(
          '.product-image[type="' +
            referenceType +
            '"][data-product="' +
            referenceID +
            '"] img'
        );
        this.handleDrop(
          false,
          draggedObject,
          dropType,
          referenceID,
          referenceType,
          this.selectedItem
        );
      } else if (dropType === 'text') {
        this.handleDrop(
          false,
          $(e.target),
          dropType,
          false,
          false,
          this.selectedItem
        );
      }
    });

    // Render first updates
    this.updateToolbar();
    // tslint:disable-next-line: semicolon
  };

  initializeUploadMethods = () => {
    /*
    // #1 Using Dropzone
    let myDropzone = new Dropzone(this.appMeta.identifier.dropzoneElement, {
      url: this.appMeta.endpoint.api,
      autoProcessQueue: true,
      maxFilesize: 20,
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
    // tslint:disable-next-line: semicolon
  };

  updateCanvasCenter = () => {
    const center = this.canvas.getCenter();
    this.canvasMeta.value.center = {
      x: center.left,
      y: center.top
    };
    // tslint:disable-next-line: semicolon
  };

  updateCurrentObject = (forceUpdate = false) => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'textbox') {
        if (this.appMeta.flag.isFontToolbarDirty) {
          activeObject.set('fontFamily', this.font.family);
          activeObject.set('fontSize', this.appMeta.value.fontSize);
          activeObject.set('fontStyle', this.appMeta.value.fontStyle);
          activeObject.set('fontWeight', this.appMeta.value.fontWeight);
          activeObject.set('fill', this.appMeta.value.fontColor);
        }
      } else if (activeObject.type === 'image') {
      }
    }

    // request render at the end
    this.canvas.requestRenderAll();
    // mark all actions completed
    Object.keys(this.appMeta.flag).map(
      (flag) => (this.appMeta.flag[flag] = false)
    );

    if (forceUpdate) {
      this.saveHistory();
    }
    // tslint:disable-next-line: semicolon
  };

  updateStateFromHistory = () => {
    return this.canvas.loadFromJSON(
      this.canvasMeta.currentHistory[this.canvasMeta.currentHistoryIndex],
      () => {
        if (this.appMeta.flag.isBoot) {
          this.appMeta.flag.isBoot = false;
          this.handleResize(true);
          setTimeout(() => {
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < this.canvas._objects.length; index++) {
              if (this.canvas._objects[index].type === 'textbox') {
                this.canvas._objects[index].dirty = true;
              }
            }
            this.canvas.renderAll();
          }, 3000);
        }
      }
    );
    // tslint:disable-next-line: semicolon
  };

  handleSelection = () => {
    const activeObject = this.canvas.getActiveObject();
    // reset selection
    // tslint:disable-next-line: max-line-length
    this.canvasMeta.flag.isCurrentObjectText = this.canvasMeta.flag.isCurrentObjectImage = this.canvasMeta.flag.isCurrentObjectTransparentSelected = this.canvasMeta.flag.isCurrentObjectTransparentable = this.canvasMeta.flag.isCurrentSelectionEmpty = false;

    if (activeObject) {
      if (activeObject.type === 'textbox') {
        this.font = new Font({
          family: activeObject.fontFamily,
          size: activeObject.fontSize + 'px'
          // style: 'regular',
          // styles: ['regular']
        });
        this.appMeta.value.fontColor = activeObject.fill;
        this.pickr.setColor(this.appMeta.value.fontColor);
        this.appMeta.flag.isFontToolbarDirty = true;
        this.canvasMeta.flag.isCurrentObjectText = true;
        activeObject.setControlsVisibility(this.canvasMeta.value.textControl);
      } else if (activeObject.type === 'image') {
        this.canvasMeta.flag.isCurrentObjectImage = true;
        this.canvasMeta.flag.isCurrentObjectTransparentable =
          activeObject.referenceObject.type === 'custom';
        this.canvasMeta.flag.isCurrentObjectTransparentSelected = activeObject
          .getSrc()
          .includes(activeObject.referenceObject.transparentPath);
      }
    } else {
      this.canvasMeta.flag.isCurrentSelectionEmpty = true;
    }

    this.updateToolbar();
    // tslint:disable-next-line: semicolon
  };

  handleDrop = (
    e,
    draggedObject,
    dropType,
    referenceID,
    referenceType,
    selectedItem
  ) => {
    if (dropType === 'image') {
      const referenceObjectValue: any = {
        type: referenceType
      };

      if (referenceType === 'custom') {
        referenceObjectValue.id = this.appMeta.asset[referenceID].asset_id;
        referenceObjectValue.path = this.appMeta.asset[referenceID].path;
        referenceObjectValue.transparentPath = this.appMeta.asset[
          referenceID
        ].transparent_path;
        referenceObjectValue.name = this.appMeta.asset[referenceID].name;
        referenceObjectValue.price = this.appMeta.asset[referenceID].price;
        referenceObjectValue.brand = this.appMeta.asset[referenceID].brand;
        console.log(this.appMeta.asset[referenceID].listing_url);
        referenceObjectValue.productListingUrl = this.appMeta.asset[
          referenceID
        ].listing_url;
        referenceObjectValue.sku = '';
      } else if (referenceType === 'default') {
        let product = [];
        {
          selectedItem === 'browse'
            ? (product = this.remoteProducts)
            : (product = this.favoriteProducts);
        }
        referenceObjectValue.id = product[referenceID].id;
        referenceObjectValue.isTransparent = 1;
        referenceObjectValue.path = product[referenceID].board_cropped;
        referenceObjectValue.transparentPath = '';
        referenceObjectValue.name = product[referenceID].name;
        referenceObjectValue.price =
          product[referenceID].is_price || product[referenceID].price;
        referenceObjectValue.brand = product[referenceID].site;
        referenceObjectValue.sku =
          product[referenceID].sku || product[referenceID].product_sku;
        referenceObjectValue.was_price = product[referenceID].was_price;
      }

      // let imageToInsert = new fb.Image(draggedObject[0], {
      //   lockScalingFlip: true,
      //   referenceObject: referenceObjectValue,
      // });

      // this.applyDrop(e, imageToInsert);
      let effectiveURL = '';
      try {
        effectiveURL = new URL(referenceObjectValue.path).href;
      } catch (_) {
        effectiveURL = environment.BASE_HREF + referenceObjectValue.path;
      }

      fb.Image.fromURL(
        effectiveURL,
        (img) => {
          img.lockScalingFlip = true;
          img.referenceObject = referenceObjectValue;
          this.applyDrop(e, img);
        },
        { crossOrigin: 'anonymous' }
      );

      // fb.util.loadImage(referenceObjectValue.path, (img) => {
      //   var image = new fb.Image(img, {
      //     lockScalingFlip: true,
      //     referenceObject: referenceObjectValue,
      //   });
      //   this.applyDrop(e, image);
      // });
    } else if (dropType === 'text') {
      const textToInsert = new fb.Textbox(draggedObject.text(), {
        fontFamily: draggedObject.text(),
        fontSize: this.appMeta.value.fontSize,
        fill: '#000000'
      });
      textToInsert.setControlsVisibility(this.canvasMeta.value.textControl);
      this.applyDrop(e, textToInsert);
    }
    // tslint:disable-next-line: semicolon
  };

  applyDrop = (e, objectToInsert) => {
    if (objectToInsert) {
      let x = 0;
      let y = 0;

      // if object is more then 30% size on canvas then make it 30%
      if (objectToInsert.width / this.canvas.getWidth() >= 0.3) {
        objectToInsert.scale(
          (this.canvas.getWidth() * 0.3) / objectToInsert.width
        );
      } else if (objectToInsert.height / this.canvas.getHeight() >= 0.3) {
        objectToInsert.scale(
          (this.canvas.getHeight() * 0.3) / objectToInsert.height
        );
      }

      if (e) {
        const offset = $('#' + this.canvasMeta.identifier.id).offset();
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
        cornerColor: this.canvasMeta.value.cornerColor,
        cornerStyle: this.canvasMeta.value.cornerStyle
      });
      this.canvas.add(objectToInsert);
      this.canvas.setActiveObject(objectToInsert);
      this.canvas.requestRenderAll();
      this.saveHistory();
    }
    // tslint:disable-next-line: semicolon
  };

  updateCanvasState = () => {
    this.appMeta.board.data[
      this.appMeta.board.currentIndex
    ].state = this.canvas.toJSON(this.canvasMeta.value.propertiesToInclude);
    this.appMeta.board.data[this.appMeta.board.currentIndex].state.canvas = {
      width: this.canvas.width,
      height: this.canvas.height
    };
    return this.appMeta.board.data[this.appMeta.board.currentIndex].state;
    // tslint:disable-next-line: semicolon
  };

  handleResize = (forceUpdate = false) => {
    const previousWidth = forceUpdate
      ? this.appMeta.board.data[this.appMeta.board.currentIndex].state.canvas
          .width
      : this.canvas.width;

    const widthBuffer = this.isTablet ? 0 : 18;
    const heightBuffer = this.isTablet ? 110 : 0;

    const relativePositionToWindow = $(
      this.canvasMeta.identifier.dropArea
    )[0].getBoundingClientRect();
    const topLevelElement = $(this.appMeta.identifier.topLevelElement);

    const calculatedWidth =
      topLevelElement.width() - relativePositionToWindow.left - widthBuffer;
    const availableWidth =
      calculatedWidth + widthBuffer < relativePositionToWindow.width
        ? calculatedWidth
        : relativePositionToWindow.width;
    const availableHeight =
      topLevelElement.height() - relativePositionToWindow.top - heightBuffer;

    let newWidth = availableWidth;
    let newHeight =
      availableWidth / Number.parseFloat(this.canvasMeta.value.aspectRatio);

    // console.log("Resize", "initial scale", newWidth, newHeight, newWidth / newHeight);

    // check if the height will be more than available
    if (newHeight > availableHeight) {
      newHeight = availableHeight;
      newWidth =
        availableHeight * Number.parseFloat(this.canvasMeta.value.aspectRatio);
      // console.log(`changing scale because ${newHeight} > ${availableHeight}`, newWidth, newHeight, newWidth/newHeight);
    }

    // console.log("Resize", "final scale", newWidth, newHeight, newWidth / newHeight);

    this.canvas.setWidth(newWidth);
    this.canvas.setHeight(newHeight);

    this.appMeta.value.scaleFactor = newWidth / previousWidth;

    $(this.canvasMeta.identifier.dropArea + '> div ').css('margin', 'auto');

    // console.log(currentWidth, currentWidth / Number.parseFloat(this.canvasMeta.value.aspectRatio))

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
    // tslint:disable-next-line: semicolon
  };

  saveHistory = () => {
    if (this.canvasMeta.flag.cropEnabled) {
      return;
    }

    const currentState = this.canvas.toJSON(
      this.canvasMeta.value.propertiesToInclude
    );

    this.canvasMeta.flag.isDirty = true;

    if (this.appMeta.board.update.exist === false) {
      this.appMeta.board.update.exist = true;
      this.appMeta.board.update.method = this.debounce(
        this.updateBoard,
        this.appMeta.board.update.delay
      );
    }

    // If a modification took place while under undo/redo state
    if (
      this.canvasMeta.currentHistoryIndex !==
      this.canvasMeta.currentHistory.length - 1
    ) {
      this.canvasMeta.currentHistory.splice(
        this.canvasMeta.currentHistoryIndex + 1
      );
    }

    this.canvasMeta.currentHistory.push(currentState);
    this.canvasMeta.currentHistoryIndex++;

    this.appMeta.board.data[
      this.appMeta.board.currentIndex
    ].state = currentState;
    // call the method
    this.appMeta.board.update.method();
    // tslint:disable-next-line: semicolon
  };

  updateBoard = (callback?) => {
    if (
      this.canvasMeta.flag.cropEnabled ||
      this.appMeta.flag.isPreviewEnabled
    ) {
      return;
    }

    let previewObject = '';
    try {
      previewObject = this.canvas.toDataURL({
        format: 'image/jpeg',
        quality: 0.2
        // multiplier: 0.2
      });
    } catch (err) {
      console.log(err);
    }

    this.boardService
      .updateBoard(
        new Board({
          uuid: this.appMeta.board.data[this.appMeta.board.currentIndex].uuid,
          title: this.appMeta.board.data[this.appMeta.board.currentIndex].title,
          state: JSON.stringify(this.updateCanvasState()),
          preview: previewObject,
          type_privacy: this.appMeta.board.data[this.appMeta.board.currentIndex]
            .type_privacy,
          is_active: this.appMeta.board.data[this.appMeta.board.currentIndex]
            .is_active
        })
      )
      .subscribe((board) => {
        if (callback) {
          callback(board);
        }
        this.canvasMeta.flag.isDirty = false;
      });
    // tslint:disable-next-line: semicolon
  };

  updateToolbar = () => {
    if (this.appMeta.flag.isFontToolbarDirty) {
      $(this.appMeta.identifier.fontColor).val(this.appMeta.value.fontColor);
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
    $(this.appMeta.identifier.completeActionElement).toggle(
      !this.canvasMeta.flag.isCurrentSelectionEmpty
    );
    $(this.appMeta.identifier.completeTitleElement).toggle(
      !this.appMeta.flag.isPreviewEnabled
    );
    // $(this.appMeta.identifier.completeTitleElement).css(
    //   'visibility',
    //   this.appMeta.flag.isPreviewEnabled ? 'hidden' : 'visible'
    // );
    $(this.appMeta.identifier.cropToolbarElement).toggle(
      this.canvasMeta.flag.cropEnabled
    );
    // tslint:disable-next-line: semicolon
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

      const imageObjects = this.canvas.getObjects('image');

      imageObjects.forEach((object, index) => {
        const objectCenter = object.getCenterPoint();
        const textToInsert = new fb.Text(` ${index + 1} `, {
          left: objectCenter.x,
          top: objectCenter.y,
          fontSize: 20,
          fill: '#fff',
          backgroundColor: '#b76e79',
          controlVisible: false,
          selectable: false,
          fontFamily: 'Open Sans'
        });

        this.canvas.add(textToInsert);
      });

      if (imageObjects.length > 0) {
        this.boardPreviewProducts = imageObjects.map((x, y) => {
          return {
            index: y + 1,
            name: x.referenceObject.name,
            brand: x.referenceObject.brand,
            price: x.referenceObject.price ? '$' + x.referenceObject.price : '',
            was_price: x.referenceObject.was_price
              ? '$' + x.referenceObject.was_price
              : ''
          };
        });
      }
    }
    // tslint:disable-next-line: semicolon
  };

  debounce = (func, wait, immediate = false) => {
    let timeout;

    // tslint:disable-next-line: space-before-function-paren
    return function () {
      const context = this;
      const args = arguments;
      const callNow = immediate && !timeout;
      clearTimeout(timeout);

      // Set the new timeout
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
    // tslint:disable-next-line: semicolon
  };

  keepPositionInBounds = () => {
    const zoom = this.canvas.getZoom();
    const xMin = ((2 - zoom) * this.canvas.getWidth()) / 2;
    const xMax = (zoom * this.canvas.getWidth()) / 2;
    const yMin = ((2 - zoom) * this.canvas.getHeight()) / 2;
    const yMax = (zoom * this.canvas.getHeight()) / 2;

    const point = new fb.Point(
      this.canvas.getWidth() / 2,
      this.canvas.getHeight() / 2
    );
    const center = fb.util.transformPoint(point, this.canvas.viewportTransform);

    const clampedCenterX = this.clamp(center.x, xMin, xMax);
    const clampedCenterY = this.clamp(center.y, yMin, yMax);

    const diffX = clampedCenterX - center.x;
    const diffY = clampedCenterY - center.y;

    if (diffX !== 0 || diffY !== 0) {
      this.canvas.relativePan(new fb.Point(diffX, diffY));
    }
    // tslint:disable-next-line: semicolon
  };

  clamp = (value, min, max) => {
    return Math.max(min, Math.min(value, max));
    // tslint:disable-next-line: semicolon
  };

  zoomIn = () => {
    this.canvasMeta.flag.isZoomed = true;
    this.canvasMeta.value.zoomValue += this.canvasMeta.value.zoomFactor;
    this.canvas.zoomToPoint(
      this.canvasMeta.value.center,
      this.canvasMeta.value.zoomValue
    );
    this.handleResize();
    // tslint:disable-next-line: semicolon
  };

  zoomOut = () => {
    if (this.canvasMeta.value.zoomValue > 0.5) {
      // set default color
      this.canvas.setBackgroundColor('#f2f3f4');
      this.canvasMeta.value.zoomValue -= this.canvasMeta.value.zoomFactor;
      this.canvas.zoomToPoint(
        this.canvasMeta.value.center,
        this.canvasMeta.value.zoomValue
      );
      // handling a glitch in zooming out with background
      // this.keepPositionInBounds();
    } else {
      this.canvasMeta.flag.isZoomed = false;
    }

    this.handleResize();
    // tslint:disable-next-line: semicolon
  };

  undo = () => {
    // Undo is possible
    if (this.canvasMeta.currentHistoryIndex > 0) {
      this.canvasMeta.currentHistoryIndex--;
      this.updateStateFromHistory();
    }
    // tslint:disable-next-line: semicolon
  };
  redo = () => {
    // Redo is possible
    if (
      this.canvasMeta.currentHistoryIndex <
      this.canvasMeta.currentHistory.length - 1
    ) {
      this.canvasMeta.currentHistoryIndex++;
      this.updateStateFromHistory();
    }
    // tslint:disable-next-line: semicolon
  };
  selectAll = () => {
    this.canvas.discardActiveObject();
    const selection = new fb.ActiveSelection(this.canvas.getObjects(), {
      canvas: this.canvas
    });
    this.canvas.setActiveObject(selection);
    this.canvas.requestRenderAll();
    // tslint:disable-next-line: semicolon
  };

  handleCrop = (action = undefined, secondaryAction = false) => {
    const activeObject = this.canvas.getActiveObject();
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
          this.canvasMeta.value.crop.active.angle = 0;
          this.canvasMeta.value.crop.active.flipX = this.canvasMeta.value.crop.copy.flipX;
          this.canvasMeta.value.crop.active.flipY = this.canvasMeta.value.crop.copy.flipY;
          this.canvasMeta.value.crop.active.top = this.canvasMeta.value.crop.copy.top;
          this.canvasMeta.value.crop.active.left = this.canvasMeta.value.crop.copy.left;
          this.saveHistory();
          break;
        case false:
          if (secondaryAction) {
            this.canvasMeta.value.crop.active.clipPath = false;
          } else {
            this.canvasMeta.value.crop.active.clipPath = this.canvasMeta.value.crop.copy.clipPath;
          }

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
            const center = activeObject.getCenterPoint();
            this.canvasMeta.value.crop.box.width = this.canvasMeta.value.crop.active.clipPath.width;
            this.canvasMeta.value.crop.box.height = this.canvasMeta.value.crop.active.clipPath.height;
            this.canvasMeta.value.crop.box.left =
              center.x +
              this.canvasMeta.value.crop.active.clipPath.left *
                activeObject.scaleX;
            this.canvasMeta.value.crop.box.top =
              center.y +
              this.canvasMeta.value.crop.active.clipPath.top *
                activeObject.scaleY;
          }

          this.canvasMeta.value.crop.box.on('scaling', this.applyCrop);
          this.canvasMeta.value.crop.box.on('mouseup', this.applyCrop);
          this.canvasMeta.value.crop.box.on('moving', this.applyCrop);

          this.canvasMeta.value.crop.box.setControlsVisibility(
            this.canvasMeta.value.crop.control
          );

          this.canvas.add(this.canvasMeta.value.crop.box);
          this.canvas.setActiveObject(this.canvasMeta.value.crop.box);
          this.canvasMeta.flag.isCurrentSelectionEmpty = true;
          break;
      }

      this.canvas
        .getObjects()
        .forEach((object) => (object.selectable = this.canvas.selection));
      this.canvas.renderAll();
      this.updateToolbar();
    }
    // tslint:disable-next-line: semicolon
  };

  applyCrop = (e) => {
    const rect = this.canvasMeta.value.crop.box;
    const image = this.canvasMeta.value.crop.active;

    const maxScaleX = (image.width * image.scaleX) / rect.width;
    const maxScaleY = (image.height * image.scaleY) / rect.height;

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

    const mask = new fb.Rect({
      width: (rect.width * rect.scaleX) / image.scaleX,
      height: (rect.height * rect.scaleY) / image.scaleY,
      left: (image.width / 2) * -1 + offsetX,
      top: (image.height / 2) * -1 + offsetY
    });

    image.clipPath = mask;
    image.dirty = true;
    // tslint:disable-next-line: semicolon
  };

  postImageProcess = () => {
    $('.background-msg').addClass('visible');
    setTimeout(() => {
      $('.background-msg').removeClass('visible');
    }, 5000);
    this.hasCanvasLoader = false;
    // tslint:disable-next-line: semicolon
  };

  action = (type) => {
    const activeObject = this.canvas.getActiveObject();

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
        if (!activeObject.isEditing) {
          this.canvas.remove(activeObject);
        }
        break;
      case 'duplicate':
        activeObject.clone((clone) => {
          clone.set({
            left: clone.left + this.canvasMeta.value.cloneOffset,
            top: clone.top + this.canvasMeta.value.cloneOffset
          });

          this.canvas.add(clone);
          // clone.setControlsVisibility(this.canvasMeta.value.hideControls);
          this.canvas.setActiveObject(clone);
        }, this.canvasMeta.value.propertiesToInclude);

        break;
      case 'transparent':
      case 'undoTransparent':
        this.hasCanvasLoader = true;
        if (activeObject.referenceObject.type === 'custom') {
          const dimentionBefore = {
            width: activeObject.width,
            height: activeObject.height,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY
          };
          this.canvasMeta.flag.isCurrentObjectTransparentable = false;
          this.canvasMeta.flag.isCurrentObjectTransparentSelected = false;
          this.updateToolbar();
          if (type === 'transparent') {
            if (activeObject.referenceObject.transparentPath) {
              this.toggleTransparent(activeObject, dimentionBefore, true);
              this.postImageProcess();
            } else {
              this.boardService
                .updateAsset(
                  new Asset({
                    asset_id: activeObject.referenceObject.id,
                    transparent: 1
                  })
                )
                .subscribe((response) => {
                  activeObject.referenceObject.transparentPath =
                    response.transparent_path;
                  this.postImageProcess();
                  this.toggleTransparent(activeObject, dimentionBefore, true);
                });
            }
          } else {
            this.toggleTransparent(activeObject, dimentionBefore, false);
            $('.background-msg').removeClass('visible');
            this.hasCanvasLoader = false;
          }
        }
        break;
    }

    this.canvas.requestRenderAll();
    this.saveHistory();
    // tslint:disable-next-line: semicolon
  };

  handlePreviewMode = (targetLink) => {
    const toggle = targetLink === 'board';
    // if a different tab was clicked and preview was enabled or disabled
    if (
      targetLink === 'board' ||
      this.appMeta.value.lastVisitedTab === 'board'
    ) {
      this.appMeta.value.lastVisitedTab = targetLink;

      // check if state has changed
      if (this.appMeta.flag.isPreviewEnabled !== toggle) {
        this.appMeta.flag.isPreviewEnabled = toggle;
      }

      this.updateToolbar();
      this.canvas.selection = !toggle;
      this.canvas.discardActiveObject();

      this.canvas.getObjects().forEach((object) => {
        object.selectable = !toggle;
        if (object.type === 'text' && !toggle) {
          this.canvas.remove(object);
        }
      });

      if (toggle) {
        this.appMeta.flag.isBoardItemDirty = true;
        this.renderAppMeta();
      }

      this.canvas.renderAll();
    }
    // tslint:disable-next-line: semicolon
  };

  handleConfigChange = (object) => {
    if (object.attribute === 'color') {
      this.canvas.backgroundImage = '';
      this.canvas.setBackgroundColor(object.value, () => {
        this.canvas.renderAll();
        this.saveHistory();
      });
    } else if (object.attribute === 'background') {
      this.canvas.setBackgroundColor(null, () => {
        this.canvas.renderAll();
        this.saveHistory();
      });
      fb.Image.fromURL(
        object.value,
        (img) => {
          img.set({
            originX: 'left',
            originY: 'top',
            scaleX: this.canvas.width / img.width,
            scaleY: this.canvas.height / img.height
          });
          this.canvas.setBackgroundImage(
            img,
            this.canvas.renderAll.bind(this.canvas)
          );
        },
        { crossOrigin: 'anonymous' }
      );
    } else if (object.attribute === 'action') {
      if (object.value === 'cancel' && this.justCreated) {
        this.appMeta.board.data[
          this.appMeta.board.currentIndex
        ].is_active = false;
        this.updateBoard(() => {
          this.router.navigate(['../../' + boardRoutesNames.BOARD_LIST], {
            relativeTo: this.route
          });
        });
      }
    }
    // tslint:disable-next-line: semicolon
  };

  toggleTransparent = (
    activeObject,
    dimentionBefore,
    enableTransparent = false
  ) => {
    this.canvas.discardActiveObject();
    activeObject.setSrc(
      environment.BASE_HREF +
        (enableTransparent
          ? activeObject.referenceObject.transparentPath
          : activeObject.referenceObject.path),
      () => {
        activeObject.width = dimentionBefore.width;
        activeObject.height = dimentionBefore.height;
        activeObject.scaleX = dimentionBefore.scaleX;
        activeObject.scaleY = dimentionBefore.scaleY;
        // activeObject.scaleX =
        //   (dimentionBefore.width * dimentionBefore.scaleX) / activeObject.width;
        // activeObject.scaleY =
        //   (dimentionBefore.height * dimentionBefore.scaleY) /
        //   activeObject.height;

        this.canvasMeta.flag.isCurrentObjectTransparentSelected = enableTransparent;

        this.canvas.setActiveObject(activeObject);
        this.canvas.renderAll();
        this.updateToolbar();
        this.canvas.renderCanvas();
      }
    );
    // tslint:disable-next-line: semicolon
  };

  addFontFamilyIfNotAdded(fontFamily: string) {
    if (this.presetFonts.indexOf(fontFamily) !== -1) {
      this.fontPickerService.loadFont(
        new Font({
          family: fontFamily
        })
      );
      this.presetFonts.push(fontFamily);
    }
  }
}
