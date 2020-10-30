import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {Board} from '../board';
import {BoardService} from '../board.service';
import {
    EventEmitterService,
    ApiService,
    UtilsService
} from 'src/app/shared/services';
import {Font, FontPickerService} from 'ngx-font-picker';
import {MatDialogUtilsService} from '../../../shared/services';
import {environment} from 'src/environments/environment';
import {boardRoutesNames} from '../board.routes.names';

declare const fb: any;

@Component({
    selector: 'app-board-preview',
    templateUrl: './board-preview.component.html',
    styleUrls: ['./board-preview.component.less', '../board.component.less']
})
export class BoardPreviewComponent implements OnInit {
    loadedAsEmbed = false;
    eventSubscription: Subscription;
    userName: string;
    filteredProducts = [];
    productSkus = [];
    boardViewLink = boardRoutesNames.BOARD_VIEW;

    constructor(
        private boardService: BoardService,
        private route: ActivatedRoute,
        private router: Router,
        private fontPickerService: FontPickerService,
        private matDialogUtils: MatDialogUtilsService,
        private eventEmitterService: EventEmitterService,
        private apiService: ApiService,
        private utils: UtilsService
    ) {
        // tslint:disable-next-line: no-string-literal
        if (route.snapshot['_routerState'].url.match(/embed/)) {
            this.loadedAsEmbed = true;
        }
    }

    presetFonts = [];
    boardProducts = [];
    boardState;
    boardFound = false;
    canvas: any;
    canvasMeta = {
        identifier: {
            id: 'canvas-area',
            containerArea: 'canvas-inner-container',
            dropArea: '#canvas-droparea'
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
    profileAvatar: string;

    @HostListener('window:resize')
    onResize() {
        this.handleResize();
    }

    ngOnInit(): void {
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                if (user.user_type === 0) {
                    this.userName = 'Guest';
                } else {
                    this.userName = `${user.first_name} ${user.last_name}`;
                }
                // main entry point
                $(() => {
                    this.canvas = new fb.Canvas(this.canvasMeta.identifier.id, {
                        containerClass: this.canvasMeta.identifier.containerArea,
                        preserveObjectStacking: true,
                        width: $(this.canvasMeta.identifier.dropArea).parent().width(),
                        height:
                            $(this.canvasMeta.identifier.dropArea).parent().width() /
                            Number.parseFloat(this.canvasMeta.value.aspectRatio),
                        selection: true
                    });
                    // update canvas center point
                    this.updateCanvasCenter();

                    const uuid = this.route.snapshot.paramMap.get('uuid');
                    this.boardService.getBoardByID(uuid, true).subscribe((response) => {
                        if (response[0]) {

                            this.appMeta.board = response[0];
                            if (
                                this.appMeta.board.type_privacy === 0 &&
                                this.appMeta.board.user_id !== user.id
                            ) {
                                this.router.navigate([`/`]);
                            }
                            if (
                                this.appMeta.board.picture &&
                                this.appMeta.board.picture !== 'null'
                            ) {
                                this.profileAvatar = this.utils.updateProfileImageLink(
                                    this.appMeta.board.picture
                                );
                            }
                            this.boardState = JSON.parse(this.appMeta.board.state.toString());
                            if (this.boardState) {
                                this.boardState.objects.forEach((object) => {
                                    if (object.type === 'textbox') {
                                        this.addFontFamilyIfNotAdded(object.fontFamily);
                                    }
                                });
                            }
                            if (this.appMeta.board) {
                                this.canvas.loadFromJSON(this.appMeta.board.state, () => {
                                    this.boardFound = true;
                                    if (this.appMeta.flag.isBoot) {
                                        this.appMeta.flag.isBoot = false;
                                        this.enterPreviewMode();
                                        this.handleResize(true);
                                        //this.updateCanvasCenter()
                                        setTimeout(() => {
                                            // tslint:disable-next-line: prefer-for-of
                                            for (
                                                let index = 0;
                                                index < this.canvas._objects.length;
                                                index++
                                            ) {
                                                if (this.canvas._objects[index].type === 'textbox') {
                                                    this.canvas._objects[index].dirty = true;
                                                }
                                            }
                                            this.canvas.renderAll();
                                        }, 3000);
                                    }
                                });
                            } else if (!response.length) {
                                this.router.navigate(['/']);
                            }


                        }

                    });
                });
            });
    }

    updateCanvasCenter = () => {
        const center = this.canvas.getCenter();
        this.canvasMeta.value.center = {
            x: center.left,
            y: center.top
        };
        // tslint:disable-next-line: semicolon
    };

    handleResize = (forceUpdate = false) => {
        const previousWidth = forceUpdate
            ? this.boardState.canvas.width
            : this.canvas.width;
        const previousHeight = forceUpdate
            ? this.boardState.canvas.height
            : this.canvas.height;
        const currentWidth = $(this.canvasMeta.identifier.dropArea)
            .parent()
            .width();

        this.appMeta.value.scaleFactor = currentWidth / previousWidth;
        const currentHeight = currentWidth / Number.parseFloat(this.canvasMeta.value.aspectRatio);
        const scaleRatio = Math.min(currentWidth / previousWidth, currentHeight / previousHeight);
        this.canvas.setDimensions({
            width: currentWidth,
            height: currentHeight,
        });
        this.canvas.setZoom(scaleRatio);
        this.canvas.backgroundColor = '#f8f9fa';
        this.canvas.renderAll();
        //
        // const scaleFactorX = currentWidth / previousWidth;
        // const scaleFactorY = currentHeight / previousHeight;

        // if (this.canvas.backgroundImage) {
        //     this.canvas.backgroundImage.scaleX *= scaleFactorX;
        //     this.canvas.backgroundImage.scaleY *= scaleFactorY;
        // }
        //
        // // scale objects
        // this.canvas.getObjects().map((o) => {
        //     o.scaleX *= scaleFactorX;
        //     o.scaleY *= scaleFactorY;
        //     o.top *= scaleFactorY;
        //     o.left *= scaleFactorX;
        //     o.setCoords();
        // });
        // this.canvas.renderAll();

        // update canvas center point
        this.updateCanvasCenter();
        // tslint:disable-next-line: semicolon
    };
    enterPreviewMode = () => {
        this.canvas.hoverCursor = 'pointer';
        this.canvas.selection = false;
        this.canvas.discardActiveObject();

        this.canvas.getObjects().forEach((object) => {
            object.selectable = false;
            object.editable = false;
        });

        const imageObjects = this.canvas.getObjects('image');
        const productSkus = [];
        imageObjects.forEach((object, index) => {
            this.boardProducts.push({
                main_image: object.referenceObject.path || '',
                site: object.referenceObject.brand || '',
                brand: object.referenceObject.brand || '',
                name: object.referenceObject.name || '',
                is_price: object.referenceObject.price || '',
                price: object.referenceObject.price || '',
                sku: object.referenceObject.sku || '',
                productListingUrl: object.referenceObject.productListingUrl || ''
            });
            if (object.referenceObject.sku) {
                productSkus.push(object.referenceObject.sku);
            }
            const objectCenter = object.getCenterPoint();
            const textToInsert = new fb.Text(` ${index + 1} `, {
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
        const skuData = productSkus.join();
        this.boardService
            .getBoardProductImages(productSkus[0], skuData)
            .subscribe((response) => {
                const responseData: any = response;
                for (const prod of responseData) {
                    const boardProduct = this.boardProducts.find(item => item.sku === prod.sku);
                    boardProduct.main_image = prod.main_image;
                    boardProduct.was_price = prod.was_price;
                    boardProduct.is_price = prod.is_price;
                    boardProduct.productListingUrl = prod.product_detail_url;
                    // this.boardProducts.find((item) => item.sku === prod.sku).main_image =
                    //     prod.main_image;
                    // this.boardProducts.find((item) => item.sku === prod.sku).was_price =
                    //     prod.was_price;
                }
                for (const prod of this.boardProducts) {
                    if (prod.main_image.substring(0, 8) === '/storage') {
                        prod.main_image = environment.BASE_HREF + prod.main_image;
                    }
                }
                const self = this;
                this.boardProducts.forEach((product, index) => {
                    if (product.is_price) {
                        if (self.productSkus.includes(product.sku)) {
                            return false;
                        } else {
                            product.sku && self.productSkus.push(product.sku);
                            self.filteredProducts.push({...product, index});
                            return true;
                        }
                    } else {
                        return false;
                    }
                });
            });
        // tslint:disable-next-line: semicolon
    };

    addFontFamilyIfNotAdded(fontFamily: string) {
        if (this.presetFonts.indexOf(fontFamily) === -1) {
            this.fontPickerService.loadFont(
                new Font({
                    family: fontFamily
                })
            );
            this.presetFonts.push(fontFamily);
        }
    }

    openDialog(product): void {
        if (product) {
            this.matDialogUtils.openMatDialog(product);
        }
    }

    likeBoard(like) {
        this.apiService
            .likeBoard(this.appMeta.board.uuid, like)
            .subscribe((payload) => {
                this.utils.updateBoardLike(this.appMeta.board, like);
            });
    }

    newBoard() {
        const board: Board = new Board();
        const newBoard = Object.assign({}, board);
        newBoard.title = 'Untitled Board';

        newBoard.type_privacy = newBoard.is_published = 0;

        // tslint:disable-next-line: no-shadowed-variable
        this.boardService.addBoard(newBoard).subscribe((board) => {
            console.log(board);
            this.router.navigate(
                [['/board', this.boardViewLink, board.uuid].join('/')],
                {
                    relativeTo: this.route,
                    state: {
                        justCreated: true
                    }
                }
            );
        });
    }
}
