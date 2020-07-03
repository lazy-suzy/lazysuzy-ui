import { Injectable, Inject } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom,
    private router: Router
  ) {}

  setMetaTags(data) {
    const logoPath = 'assets/image/color_logo_transparent.png';
    this.titleService.setTitle(data.page_title || 'LazySuzy');
    this.metaService.updateTag({
      name: 'description',
      content: data.description || `Search America's top Home brands in one go`
    });
    this.metaService.updateTag({
      name: 'image',
      content: data.image_url || logoPath
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
      ratingValue: data.rating,
      reviewCount: data.reviews,
      offers: {
        price: data.is_price,
        priceCurrency: '$',
        availability: data.in_inventory
      },
      description: data.description[0]
    };
    return schema;
  }
}
