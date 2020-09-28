import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from 'src/app/shared/services';
import {BlogService} from 'src/app/shared/services/blog/blog.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-page-posts',
    templateUrl: './page-posts.component.html',
    styleUrls: ['./page-posts.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class PagePostsComponent implements OnInit {

    posts$: Observable<any[]>;
    selectedPost: any;
    showLoader = true;
    postId = '';
    currentBlog: any;
    baseUrl = 'http://wordpress.lazysuzy.com/';
    postUrl

    constructor(
        private blogService: BlogService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) {
        this.route.params.subscribe(params => {
            this.postId = params.id;
        });
    }

    ngOnInit() {
        this.showLoader = true;
        this.postUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://wordpress.lazysuzy.com/index.php/2020/09/25/our-founders-home/`);
        this.posts$ = this.blogService.getPost(this.postId);

        this.posts$.subscribe(s => {
            this.currentBlog = s;
            let x_tags = this.currentBlog.x_tags || '';
            x_tags = x_tags.split(',');
            this.currentBlog.x_tags = [...x_tags];
            this.showLoader = false;
        });
    }

}
