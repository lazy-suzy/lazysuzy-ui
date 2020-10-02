import { tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  blogs = [];
  blog_base = "http://wordpress.lazysuzy.com/index.php/wp-json/wp/v2";
  constructor(private httpClient: HttpClient) {}

  getBlogs(page=1):Observable<HttpResponse<any>> {
    return this.httpClient.get<HttpResponse<any>>(`${this.blog_base}/posts?_embed&page=${page}`, {
      observe:'response',
      params: {
        per_page: "6",
      },
    });
  }
  getPost(id)
  {
    return this.httpClient.get<any[]>(`${this.blog_base}/posts/${id}`)
  }

  setBlogItems(blogs) {
    if(!this.blogs){
      this.blogs = [...blogs];
    }
    else{
      this.blogs = [...this.blogs,...blogs]
    }
  }
}
