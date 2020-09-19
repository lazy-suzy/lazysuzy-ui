import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  blogs = [];
  blog_base = "http://wordpress.lazysuzy.com/index.php/wp-json/wp/v2";
  constructor(private httpClient: HttpClient) {}

  getBlogs(page=1):Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.blog_base}/posts?_embed&page=${page}`, {
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
