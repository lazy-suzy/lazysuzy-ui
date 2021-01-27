import { Component, OnInit, Renderer } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IActiveProduct, IProduct, IProductDetail} from 'src/app/shared/models';
import {
    ApiService,
    CacheService,
    EventEmitterService,
    MatDialogUtilsService,
    UtilsService
} from 'src/app/shared/services';
import {Observable, Subscription} from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'; 
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-reviewForm-mobile',
    templateUrl: './reviewForm-mobile.component.html',
    styleUrls: ['./reviewForm-mobile.component.less']
})
export class ReviewFormMobileComponent implements OnInit { 

    productSku: any;
    routeSubscription: any;
    product: IProduct; 
    spinner = 'assets/image/spinner.gif';
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );   
    isHandset: boolean;
    bpSubscription: Subscription; 
      
   
    errorMessage = ''; 
    eventSubscription: Subscription; 
    hasSelection: boolean; 
    invalidLinkImageSrc = 'assets/image/invalid_link.png';
    invalidLink: boolean;
    productSubscription: Subscription;
    username: string = '';
    location: string = '';
    useremail: string = '';
    presentUserName: string = '';
    presentUserEmail: string = '';
    presentLocation: string = '';
    images = []; 
    imageSrc = [];
    hasImage: boolean;
    emailerror: boolean = false;
    rtexterror: boolean = false;
    headererror: boolean = false;
    ratingerror: boolean = false;
    sku: string;
    ratingvalue: number = 0;
    reviewHeader: string = '';
    emailmsg: string = '';
    reviewText: string = '';
    isLoading = false;
    img: string = '';
    productname: string = '';
    productsite: string = '';


    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private apiService: ApiService,
        public utils: UtilsService,
        private breakpointObserver: BreakpointObserver, 
        public cacheService: CacheService,
        private eventEmitterService: EventEmitterService,
        private snackBar: MatSnackBar,
        private renderer: Renderer,
        private matDialogUtils: MatDialogUtilsService 
    ) {
    }

    ngOnInit() { 
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {

                if (user.user_type > 0) {
                    this.apiService.getProfile().subscribe((payload: any) => {
                        const userData = payload.auth.user;
                        this.username = userData.username;
                        this.useremail = userData.email;
                        this.location = userData.location;

                        this.presentUserName = userData.username;
                        this.presentUserEmail = userData.email;
                        this.presentLocation = userData.location;
                    });
                }

                this.bpSubscription = this.bpObserver.subscribe(
                    (handset: BreakpointState) => {
                        console.log(handset.matches)
                        this.isHandset = handset.matches;
                    }
                );
                 this.loadProduct();
            });
    }

    loadProduct() {
        this.routeSubscription = this.activeRoute.params.subscribe(
            (routeParams) => { 
                this.productSku = routeParams.product; 
                this.productSubscription = this.apiService
                    .getProduct(this.productSku)
                    .subscribe(
                        (payload: IProductDetail) => {
                            this.product = payload.product;console.log(this.product)
                            this.img = this.product.main_image;
                            this.productname = this.product.name;
                            this.productsite = this.product.site;
                            
                            if (this.product) { 
                              
                                if (!this.isHandset) {
                                     this.matDialogUtils.setProduct(payload);
                                    this.openMyReviewModal();
                                     this.router.navigate(
                                        [`${this.product.department_info[0].category_url}`],
                                        {queryParams: {modal_sku: this.product.sku}}
                                    ); 
                                }
                               
                                this.invalidLink = false;
                            } else {
                                this.invalidLink = true;
                            } 
                        },
                        (error) => {
                            this.invalidLink = true; 
                        }
                    );
            }
        );

    }

  
    onDestroy(): void {
        this.productSubscription.unsubscribe();
        this.bpSubscription.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    reviewUpdate() {

        const formData = new FormData();
        console.log(this.images.length);
        /* if (this.file) {
          formData.append('review_images', this.file);
          }
          */
        if (this.images.length > 5) {
            this.snackBar.open('Maximum 5 images can be uploaded', 'Dismiss', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        }
        else {
            for (var i = 0; i < this.images.length; i++) {
                formData.append("rimage[]", this.images[i]);
            }
        }



        if (this.productSku) {
            formData.append('product_sku', this.productSku);
        }
        if (this.presentUserName !== '') {
            formData.append('user_name', this.presentUserName);
        }
        else {
            if (this.username == '') {
                formData.append('user_name', 'anonymous');
            }
            else {
                formData.append('user_name', this.username);
            }

        }

        if (this.presentUserEmail !== '') {
            this.emailerror = false;
            formData.append('user_email', this.presentUserEmail);
        }
        else {
            console.log(this.useremail);
            if (this.useremail == '' || this.useremail == '0') {
                this.emailmsg = 'Please enter your email for verification.';
                this.emailerror = true;
            }
            else {
                if (this.validateEmail(this.useremail)) {
                    this.emailerror = false;
                    formData.append('user_email', this.useremail);
                }
                else {
                    this.emailmsg = 'Please enter a valid email address.';
                    this.emailerror = true;
                }
            }


        }
        if (this.presentLocation !== '') {
            formData.append('user_location', this.presentLocation);
        }
        else {
            formData.append('user_location', this.location);
        }

        formData.append('status', '1');
        formData.append('count_helpful', '0');
        formData.append('count_reported', '0');
        formData.append('source', 'user');
        formData.append('headline', this.hasNull(this.reviewHeader));
        formData.append('review', this.hasNull(this.reviewText));


        if (this.ratingvalue > 0) {
            this.ratingerror = false;
            formData.append('rating', this.ratingvalue.toString());
        }
        else {
            this.ratingerror = true;
        }


        /*if(this.reviewHeader!=''){
            this.headererror= false;
            formData.append('headline', this.hasNull(this.reviewHeader));
        }
        else{
                this.headererror= true;
        }
    	
        if(this.reviewText!=''){
            this.rtexterror= false;
            formData.append('review', this.hasNull(this.reviewText));
        }
        else{
                this.rtexterror= true;
        }*/


        if (!this.emailerror && !this.ratingerror && this.images.length <= 5) {
            this.isLoading = true;
            this.apiService.submitReview(formData).subscribe((payload: any) => {
                this.isLoading = false;
                this.snackBar.open('Review Submitted', 'Dismiss', {
                    duration: 4000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                });
                //location.reload();
                this.router.navigateByUrl(`/product/${this.productSku}`)
                if (payload.errors.length) {
                    const errorsArray = payload.errors;
                    /*for (const error of errorsArray) { 
                      if (error.original.error.username) {
                        this.hasUsernameError = true;
                      }
                    }*/
                }
                const self = this;
                setTimeout(() => {
                    //self.hasUsernameError = false;
                }, 5000);
            });
        }
    }
    hasNull(data) {
        if (data && data !== 'null') {
            return data;
        }
        return '';
    }

    readFile(event) {
        console.log(event.target.files)
        let flag = 0;
        let files = event.target.files;
        for (let file of files) {
            if ((file['size'] / 1048576) > 2) {
                flag++;
            }
        }

        if (flag > 0) {
            this.snackBar.open('Image size should not be more than 2mb.', 'Dismiss', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        }
        else {
            if (files && files.length <= 5) {
                if (event.target.files && event.target.files.length > 0) {

                    for (let i = 0; i < event.target.files.length; i++) {
                        const reader = new FileReader();
                        this.images.push(event.target.files[i]);

                        reader.onload = (event: any) => {
                            // this.imageSrc = reader.result;
                            //  this.imageSrc.push(reader.result); 
                            this.imageSrc.push(event.target.result);

                            this.hasImage = true;
                        };
                        reader.readAsDataURL(event.target.files[i]);
                    }
                }
            }
            else {
                this.snackBar.open('Maximum 5 images can be uploaded', 'Dismiss', {
                    duration: 4000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                });
            }

        }

    }

    starCount(event) {
        //console.log(event);
        this.ratingvalue = event;
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    deleteUploadedImage(index) {
        this.imageSrc.splice(index, 1);
        this.images.splice(index, 1);
        this.renderer.selectRootElement('#file').value = '';
    }

    gotoProduct() {
        // this.router.navigateByUrl(`/product/${this.sku}`)
        window.location.href = './product/' + this.sku;
    }

  
    openMyReviewModal() {
        console.log(this.product)
            this.hasSelection = true;
            const data = {
                sku: this.product.sku,
                brand: this.product.site,
                image: this.product.main_image,
                name: this.product.name 
            };
            

            this.matDialogUtils.openMyReviewDialog(data);

    }
     
}
