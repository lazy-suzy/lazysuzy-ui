import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { LIGHTBOX_CONFIG } from '@ngx-gallery/lightbox';
import { MarkdownModule } from 'ngx-markdown';
import { EventEmitterService } from './shared/services/events/event-emitter.service';
import { NgxStripeModule } from 'ngx-stripe';
import { environment as env } from 'src/environments/environment';

const MODULES = [
  BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  CoreModule,
  FeatureModule,
  SharedModule,
  AngularFontAwesomeModule,
  FormsModule,
  GalleryModule,
  LightboxModule,
  MarkdownModule.forRoot(),
  NgxStripeModule.forRoot(env.STRIPE_API_KEY)
];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  providers: [
    CookieService,
    EventEmitterService,
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
