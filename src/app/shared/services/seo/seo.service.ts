import { Injectable, Inject, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  metaTags = {
    DESCRIPTION: 'description',
    IMAGE: 'image,',
    OG_TITLE: 'og:title',
    OG_DESCRIPTION: 'og:description',
    OG_IMAGE: 'og:image',
    OG_URL: 'og:url',
    OG_TYPE: 'og:type',
    SECURE_IMAGE: 'og:image:secure_url',
    TWITTER_TITLE: 'twitter:text:title',
    TWITTER_IMAGE: 'twitter:image'
  };
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom,
    private router: Router
  ) {}

  setMetaTags(data) {
    const url = env.BASE_HREF + this.router.url.split('?')[0];
    const logoPath = 'assets/image/color_logo_transparent.png';
    const metaData = {
      TITLE: data.full_title || 'LazySuzy',
      IMAGE: data.image_url || logoPath,
      DESCRIPTION:
        data.description || `Search America's top Home brands in one go`,
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
      name: this.metaTags.OG_IMAGE,
      content: metaData.URL
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
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'Product',
      name: data.name,
      image: data.main_image,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingCount: data.reviews,
        ratingValue: data.rating
      },
      offers: {
        price: data.is_price,
        priceCurrency: '$',
        availability: data.in_inventory ? 'InStock' : 'OutOfStock'
      },
      description: data.description[0]
    };
    return schema;
  }
}
