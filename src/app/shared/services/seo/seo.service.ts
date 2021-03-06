import {Inject, Injectable} from '@angular/core';
import {environment as env} from 'src/environments/environment';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import MetaData from './meta-data-model';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    metaTags = {
        DESCRIPTION: 'description',
        IMAGE: 'image',
        OG_TITLE: 'og:title',
        OG_DESCRIPTION: 'og:description',
        OG_IMAGE: 'og:image',
        OG_URL: 'og:url',
        OG_TYPE: 'og:type',
        SECURE_IMAGE: 'og:image:secure_url',
        TWITTER_TITLE: 'twitter:text:title',
        TWITTER_IMAGE: 'twitter:image'
    };
    defaultMetaData: MetaData = {
        title: 'LazySuzy - Shop your home. From your home.',
        description: 'Search and discover the latest designs and deals from America\'s top home brands in one place. Find and share inspiration with shoppable design boards.',
        image: `${env.BASE_HREF}/images/default.png`,
        type: 'article'
    };

    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private dom,
        private router: Router
    ) {
    }

    setMetaTags(data: MetaData) {
        data.url = env.BASE_HREF + this.router.url.split('?')[0];
        const metaData = {...this.defaultMetaData, ...data};
        this.titleService.setTitle(metaData.title);
        this.metaService.updateTag({
            name: this.metaTags.DESCRIPTION,
            content: metaData.description
        });
        this.metaService.updateTag({
            name: this.metaTags.IMAGE,
            content: metaData.image
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_TITLE,
            content: metaData.title
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_IMAGE,
            content: metaData.image
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_DESCRIPTION,
            content: metaData.description
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_URL,
            content: metaData.url
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_TYPE,
            content: metaData.type
        });
        this.metaService.updateTag({
            name: this.metaTags.OG_DESCRIPTION,
            content: metaData.description
        });
        this.metaService.updateTag({
            property: this.metaTags.SECURE_IMAGE,
            content: metaData.image
        });
        this.metaService.updateTag({
            name: this.metaTags.OG_IMAGE,
            content: metaData.url
        });
        this.metaService.updateTag({
            name: this.metaTags.TWITTER_TITLE,
            content: metaData.title
        });
        this.metaService.updateTag({
            name: this.metaTags.TWITTER_IMAGE,
            content: metaData.image
        });
    }

    setCanonicalURL() {
        const url = env.BASE_HREF + this.router.url.split('?')[0];
        const head = this.dom.getElementsByTagName('head')[0];
        let element: HTMLLinkElement =
            this.dom.querySelector(`link[rel='canonical']`) || null;
        if (element == null) {
            element = this.dom.createElement('link') as HTMLLinkElement;
            head.appendChild(element);
        }
        element.setAttribute('rel', 'canonical');
        element.setAttribute('href', url);
    }

    setSchema(data) {
        const isPriceRange = data.is_price.includes('-');
        const minPrice = data.is_price.split('-')[0];
        const schema = {
            '@context': 'http://schema.org',
            '@type': 'Product',
            name: data.name,
            image: data.main_image,
            aggregateRating:
                data.rating > 0
                    ? {
                        '@type': 'AggregateRating',
                        ratingCount: data.reviews,
                        ratingValue: data.rating
                    }
                    : null,
            offers: {
                price: isPriceRange ? minPrice : data.is_price,
                priceCurrency: '$',
                availability: data.in_inventory ? 'InStock' : null
            },
            description: data.description[0]
        };
        return schema;
    }

    setMetadataForBlog(blog) {
        const url = window.location.href;
        const logoPath = 'assets/image/color_logo_transparent.png';
        const metaData = {
            TITLE: this.parseHtmlToString(blog.title.rendered) || 'LazySuzy',
            IMAGE: blog.x_featured_media_original || logoPath,
            DESCRIPTION:
                this.parseHtmlToString(blog.excerpt.rendered) || `Search America's top Home brands in one go`,
            URL: url,
            TYPE: 'website'
        };
        this.titleService.setTitle(metaData.TITLE);
        this.metaService.updateTag({
            name: this.metaTags.DESCRIPTION,
            content: metaData.DESCRIPTION
        });
        this.metaService.updateTag({
            name: this.metaTags.IMAGE,
            content: metaData.IMAGE
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_TITLE,
            content: metaData.TITLE
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_IMAGE,
            content: metaData.IMAGE
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_DESCRIPTION,
            content: metaData.DESCRIPTION
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_URL,
            content: metaData.URL
        });
        this.metaService.updateTag({
            property: this.metaTags.OG_TYPE,
            content: metaData.TYPE
        });
        this.metaService.updateTag({
            name: this.metaTags.OG_DESCRIPTION,
            content: metaData.DESCRIPTION
        });
        this.metaService.updateTag({
            property: this.metaTags.SECURE_IMAGE,
            content: metaData.IMAGE
        });
        this.metaService.updateTag({
            name: this.metaTags.TWITTER_TITLE,
            content: metaData.TITLE
        });
        this.metaService.updateTag({
            name: this.metaTags.TWITTER_IMAGE,
            content: metaData.IMAGE
        });
    }

    removeBlogMetadata() {
        this.metaService.removeTag(`name='${this.metaTags.DESCRIPTION}'`);
        this.metaService.removeTag(`name='${this.metaTags.IMAGE}'`);
        this.metaService.removeTag(`name='${this.metaTags.OG_DESCRIPTION}'`);
        this.metaService.removeTag(`name='${this.metaTags.TWITTER_TITLE}'`);
        this.metaService.removeTag(`name='${this.metaTags.TWITTER_IMAGE}'`);
        this.metaService.removeTag(`name='${this.metaTags.SECURE_IMAGE}'`);
        this.metaService.removeTag(`name='${this.metaTags.SECURE_IMAGE}'`);
        this.metaService.removeTag(`property='${this.metaTags.OG_TITLE}'`);
        this.metaService.removeTag(`property='${this.metaTags.OG_IMAGE}'`);
        this.metaService.removeTag(`property='${this.metaTags.OG_URL}'`);
        this.metaService.removeTag(`property='${this.metaTags.OG_TYPE}'`);
        this.metaService.removeTag(`property='${this.metaTags.SECURE_IMAGE}'`);
        this.metaService.removeTag(`property='${this.metaTags.OG_DESCRIPTION}'`);
    }

    parseHtmlToString(text): string {
        const htmlComponent = document.createElement('textarea');
        htmlComponent.innerHTML = text;
        return this.removeHtmlTags(htmlComponent.value);
    }

    private removeHtmlTags(value: string): string {
        return value.replace(/(<([^>]+)>)/ig, '');

    }
}
