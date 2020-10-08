import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {BlogService} from 'src/app/shared/services/blog/blog.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UtilsService} from 'src/app/shared/services';
import {BreakpointState} from '@angular/cdk/layout';
import {SeoService} from '../../../../../shared/services/seo/seo.service';

@Component({
    selector: 'app-page-posts',
    templateUrl: './page-posts.component.html',
    styleUrls: ['./page-posts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PagePostsComponent implements OnInit, OnDestroy {
    posts$: Observable<any[]>;
    selectedPost: any;
    showLoader = true;
    postSlug = '';
    currentBlog: any;
    isHandset = false;
    /**
     * Currently if we only load content without styles it looks bland, so load these additional css files
     * from word-press web-page and append to header. When this component is destroyed this files are automatically
     * removed from the header.
     */
    blogStylesUrl = [
        'https://wordpress.lazysuzy.com/wp-includes/css/dist/block-library/style.min.css?ver=5.4.2',
        'https://wordpress.lazysuzy.com/wp-content/themes/twentytwenty/style.css?ver=1.2',
        'https://wordpress.lazysuzy.com/wp-content/themes/twentytwenty/print.css?ver=1.2',
    ];

    constructor(private blogService: BlogService,
                private route: ActivatedRoute,
                private utils: UtilsService,
                private seoService: SeoService) {
        this.route.params.subscribe((params) => {
            this.postSlug = params.id;
        });
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('custom-background');
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
        this.posts$ = this.blogService.getPost(this.postSlug);
        this.posts$.subscribe((s) => {
            this.currentBlog = s[0];
            let x_tags = this.currentBlog.x_tags || '';
            x_tags = x_tags.split(',');
            this.currentBlog.x_tags = [...x_tags];
            this.showLoader = false;
            const link = this.currentBlog.link;
            //this.seoService.setCanonicalURL(link);
            this.seoService.setMetadataForBlog(this.currentBlog);
            this.setBlogOEmbedLink(link);

        });
        this.utils.isHandset().subscribe((handset: BreakpointState) => {
            this.isHandset = handset.matches;
        });
    }

    ngOnDestroy(): void {
        this.removeBlogStylesFromHeader();
        this.removeOEmbedLink();
        this.seoService.removeBlogMetadata();
    }

    private removeOEmbedLink() {
        const element = document.querySelector(`link[type='application/json+oembed']`)
        element.remove();
    }

    private removeBlogStylesFromHeader() {
        const numberOfElements = this.blogStylesUrl.length;
        for (let index = 0; index < numberOfElements; index++) {
            const id = `blogUrl${index}`;
            const element = document.getElementById(id);
            element.remove();
        }
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('custom-background');
    }

    setBlogOEmbedLink(url: string) {
        const wordpressEmbedUrl = `https://wordpress.lazysuzy.com/index.php/wp-json/oembed/1.0/embed`;
        let element = document.querySelector(`link[rel='canonical']`) || null;
        if (!element) {
            const head = document.getElementsByTagName('head')[0];
            element = document.createElement('link');
            head.appendChild(element);
        }
        element.setAttribute('rel', 'alternate');
        element.setAttribute('type', 'application/json+oembed');
        element.setAttribute('href', `${wordpressEmbedUrl}?url=${encodeURIComponent(url)}`)
    }
}
