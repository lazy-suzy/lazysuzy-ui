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

const MODULES = [
  BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  CoreModule,
  FeatureModule,
  SharedModule,
  AngularFontAwesomeModule,
  FormsModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
