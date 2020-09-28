import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {BlogService} from 'src/app/shared/services/blog/blog.service';
import {DomSanitizer} from '@angular/platform-browser';
import { UtilsService } from 'src/app/shared/services';
import { BreakpointState } from '@angular/cdk/layout';

@Component({
    selector: 'app-page-posts',
    templateUrl: './page-posts.component.html',
    styleUrls: ['./page-posts.component.scss'],
})
export class PagePostsComponent implements OnInit, OnDestroy {

    posts$: Observable<any[]>;
    selectedPost: any;
    showLoader = true;
    postId = '';
    currentBlog: any;
    isHandset= false;
    /**
     * Currently if we only load content without styles it looks bland, so load these additional css files
     * from word-press web-page and append to header. When this component is destroyed this files are automatically
     * removed from the header.
     */
    blogStylesUrl = [
        'http://wordpress.lazysuzy.com/wp-includes/css/dist/block-library/style.min.css?ver=5.4.2',
        'http://wordpress.lazysuzy.com/wp-content/themes/twentytwenty/style.css?ver=1.2',
        'http://wordpress.lazysuzy.com/wp-content/themes/twentytwenty/print.css?ver=1.2'
    ];

    constructor(
        private blogService: BlogService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private utils: UtilsService
    ) {
        this.route.params.subscribe(params => {
            this.postId = params.id;
        });
        this.loadBlogStylesToHeader();
    }

    private loadBlogStylesToHeader() {
        this.blogStylesUrl.forEach((url, index) => {
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.id = `blogUrl${index}`;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            head.appendChild(link);
        });
    }

    ngOnInit() {
        this.showLoader = true;
        this.posts$ = this.blogService.getPost(this.postId);
        this.posts$.subscribe(s => {
            this.currentBlog = s;
            let x_tags = this.currentBlog.x_tags || '';
            x_tags = x_tags.split(',');
            this.currentBlog.x_tags = [...x_tags];
            this.showLoader = false;
        });
        this.utils.isHandset().subscribe(
            (handset: BreakpointState) => {
                this.isHandset = handset.matches;
              }
        )
    }

    ngOnDestroy(): void {
        console.log('destroyed');
        this.removeBlogStylesFromHeader();
    }


    private removeBlogStylesFromHeader() {
        const numberOfElements = this.blogStylesUrl.length - 1;
        for (let index = 0; index < numberOfElements; index++) {
            const id = `blogUrl${index}`;
            const element = document.getElementById(id);
            element.remove();
        }
    }
}
