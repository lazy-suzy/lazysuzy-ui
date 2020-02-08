import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';
import { SharedModule } from './shared/shared.module';

const MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  CoreModule,
  FeatureModule,
  SharedModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
