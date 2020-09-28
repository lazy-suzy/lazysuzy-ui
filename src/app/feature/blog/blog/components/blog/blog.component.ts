import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { ApiService, CacheService } from "src/app/shared/services";
import { BlogService } from "src/app/shared/services/blog/blog.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  posts = [];
  selectedPost: any;
  showLoader = false;
  page = 1;
  loaded = false;
  max_pages;
  //For Infinite Scroll
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private apiService: ApiService,
    public blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.showLoader = true;
    this.getBlogs();
  }

  goToPost(id) {
    this.router.navigate([`/blog/${id}`]);
  }

  onScrollDown(): void {
    if (this.page < this.max_pages) {
      this.page = this.page + 1;
      this.getBlogs(this.page);
    }
  }

  getBlogs(page = 1) {
    this.showLoader = true;
    this.blogService
      .getBlogs(page)
      .pipe(first())
      .subscribe(
        ({ headers, body }) => {
          this.max_pages = headers.get("X-WP-TotalPages");
          if (!this.posts) {
            this.posts = [...body];
          } else {
            this.posts = [...this.posts, ...body];
          }
        },
        (error) => {
          (this.showLoader = false), (this.loaded = true);
        },
        () => {
          (this.showLoader = false), (this.loaded = true);
        }
      );
  }
  decodeHtml(text: string): string {
    const htmlComponent = document.createElement("textarea");
    htmlComponent.innerHTML = text;
    return htmlComponent.value;
  }
}
