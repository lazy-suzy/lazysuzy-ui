import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  ApiService,
  EventEmitterService,
  UtilsService,
   MatDialogUtilsService
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
	image: string =  '';
	file: any;
	imageSrc: any;
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
  ) {}

  ngOnInit() {
	  this.product = this.data.modal;console.log(this.product );
	// this.route.params.subscribe(routeParams => {
      this.sku = this.product.sku;
	 console.log(this.sku );
	   this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
	 
       /* if (user.user_type === 0) {
          this.router.navigate([`/`]);
        }*/
		
		if (user.user_type >0) {
        this.apiService.getProfile().subscribe((payload: any) => {
          const userData = payload.auth.user;
          this.username = userData.username; 
          this.useremail = userData.email;
          this.location = userData.location;
         
        /*  this.hasImage =
            userData.picture && userData.picture !== 'null' ? true : false;
          if (this.hasImage) {
            this.imageSrc = this.utils.updateProfileImageLink(userData.picture);
          }*/
          this.presentUserName = userData.username;
          this.presentUserEmail = userData.email;
          this.presentLocation = userData.location;
        });
		}
      });
 
  //  });  
	  
   
  }
  


  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  reviewUpdate() {
    
    const formData = new FormData();
	console.log(this.file);
     if (this.file) {
      formData.append('review_images', this.file);
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
	else{
		if(this.validateEmail(this.useremail)){
			this.emailerror= false;
			formData.append('user_email', this.useremail);
		}
		else{
			   this.emailerror= true;
		}		
	}
	if (this.presentLocation !== '') {
      formData.append('user_location', this.presentLocation);
    }  
	else{
		formData.append('user_location', this.location);
	}
	
	formData.append('status', '0');
	formData.append('count_helpful', '0');
	formData.append('count_reported', '0');
	formData.append('source', 'user');
	
      if (this.ratingvalue>0) {
          this.ratingerror = false;
          formData.append('rating', this.ratingvalue.toString());
      }
      else {
          this.ratingerror = true;
      }
	
	 
	if(this.reviewHeader!=''){
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
	}
	
	
      if (!this.emailerror && !this.headererror && !this.rtexterror && !this.ratingerror){
	 this.isLoading = true;	
     this.apiService.submitReview(formData).subscribe((payload: any) => {
      this.isLoading = false;
      this.snackBar.open('Review Submitted', 'Dismiss', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
         location.reload();
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
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.hasImage = true;
      };
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
}
