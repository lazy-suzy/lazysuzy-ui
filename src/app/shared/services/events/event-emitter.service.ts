import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeFetchUser = new EventEmitter();
  invokeSocialLogin = new EventEmitter();
  subsVar: Subscription;
  socialSubs: Subscription;

  constructor() {}

  fetchUser(token, user) {
    this.invokeFetchUser.emit({ token, user });
  }

  socialSignIn(platform: string) {
    this.invokeSocialLogin.emit(platform);
  }
}
