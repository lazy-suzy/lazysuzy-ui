import { Injectable, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeFetchUser = new EventEmitter();
  invokeSocialLogin = new EventEmitter();
  userTransitionEvent = new EventEmitter();
  updateCart = new EventEmitter();
  userChangeEvent = new ReplaySubject<any>(1);
  private assetsData = new BehaviorSubject('');
  assets = this.assetsData.asObservable();
  public isBrandSubject = new BehaviorSubject('');
  constructor() {}

  // Triggered from: anywhere
  // Listened by: auth component
  // Purpose: if any part of the applicatiop wants to change user data they call this event
  fetchUser(token, user) {
    this.invokeFetchUser.emit({ token, user });
  }

  // Triggered from: anywhere
  // Listened by: auth component
  // Purpose: if any part of the application wants to trigger social login
  socialSignIn(platform: string) {
    this.invokeSocialLogin.emit(platform);
  }

  // Triggered from: auth component
  // Listened by: varous parts of the application
  // Purpose: notify entire application about user data change, listen to replay to get last change as well
  invokeUserChange(user) {
    this.userChangeEvent.next(user);
  }

  // Triggered from: auth component
  // Listened by: varous parts of the application
  // Purpose: notify entire application about user data change currently under process, use to display loader
  invokeUserTransition() {
    this.userTransitionEvent.emit();
  }

  updateAssets(item: any) {
    this.assetsData.next(item);
  }

  updateCartIcon() {
    this.updateCart.emit();
  }
}
