import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogs = [];

  constructor() { }

  ngOnInit() { }

  setBlogItems(blogs) {
    this.blogs = [...blogs];
  }

}
