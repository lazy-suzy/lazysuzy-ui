import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild, Renderer} from '@angular/core';
import {
  ApiService,
  EventEmitterService,
  UtilsService
} from 'src/app/shared/services';
import { IProfile, IProduct, IProductDetail } from '../../../shared/models';
import { environment as env } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';  


@Component({
  selector: 'app-reviewform',
  templateUrl: './reviewForm.component.html',
  styleUrls: ['./reviewForm.component.less']
})
export class ReviewFormComponent implements OnInit {
     
	username: string =  ''; 
	location: string =  '';
	//image: string =  '';
    images = []; 
    imageSrc = [];
	hasEditIcon = false;
	isLoading = false;
	presentUserName: string = '';
	presentUserEmail: string = '';
	presentLocation: string = '';
	spinner = 'assets/image/spinner.gif';  
	hasImage: boolean;
	emailerror: boolean = false;
	rtexterror: boolean = false;
	headererror: boolean = false;
    ratingerror: boolean = false;
	useremail:string='';
	hasHeaderError = false;
	sku: string;  
	ratingvalue: number=0;
	reviewHeader:  string = '';
	reviewText:  string = '';
    product: any = {};
    topHeight = { 'max-height': '0' };
    brand: string = '';
    image: string = '';
    emailmsg: string = '';
  
  eventSubscription: Subscription;
  websiteRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9].[a-zA-Z]{2,}$/;
  
  constructor( 
   @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private cookie: CookieService,
    private snackBar: MatSnackBar,
    private utils: UtilsService, 
    private route: ActivatedRoute,
    private renderer: Renderer
  ) {}

    ngOnInit() {
        if (this.data.payload == undefined) {
            this.product = this.data.modal;
            this.brand = this.product.brand;
            this.image = this.product.image;
        }
            
        else {
            this.product = this.data.payload.product;
            this.brand = this.product.site;
            this.image = this.product.main_image;
        }
      this.sku = this.product.sku; 
	   this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
	 
		if (user.user_type >0) {
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
      });
 
	  
   
  }
  


  onDestroy(): void {
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
      


	if (this.sku) {
      formData.append('product_sku', this.sku);
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
	  this.emailerror= false;
      formData.append('user_email', this.presentUserEmail);
    }  
    else {
        console.log(this.useremail);
        if (this.useremail == '' || this.useremail=='0') {
            this.emailmsg = 'Please enter your email for verification.';
            this.emailerror = true;
        }
        else {
                if(this.validateEmail(this.useremail)){
                        this.emailerror= false;
                        formData.append('user_email', this.useremail);
                }
                else {
                        this.emailmsg = 'Please enter a valid email address.';
                        this.emailerror= true;
                }	
        }
        
			
	}
	if (this.presentLocation !== '') {
      formData.append('user_location', this.presentLocation);
    }  
	else{
		formData.append('user_location', this.location);
	}
	
	formData.append('status', '1');
	formData.append('count_helpful', '0');
	formData.append('count_reported', '0');
	formData.append('source', 'user');
    formData.append('headline', this.hasNull(this.reviewHeader));
    formData.append('review', this.hasNull(this.reviewText));


      if (this.ratingvalue>0) {
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
	
	
      if (!this.emailerror && !this.ratingerror && this.images.length<=5){
	 this.isLoading = true;	
     this.apiService.submitReview(formData).subscribe((payload: any) => {
      this.isLoading = false;
      this.snackBar.open('Review Submitted', 'Dismiss', {
        duration: 7000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
         // location.reload();
         window.location.href = './product/' + this.sku;
     // const token = this.cookie.get('token');
     // this.eventEmitterService.fetchUser(token, payload.user);
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
  over() {
    this.hasEditIcon = true;
  }

  out() {
    this.hasEditIcon = false;
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
  
  starCount(event){
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

  }
