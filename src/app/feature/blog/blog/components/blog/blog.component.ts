import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, CacheService } from 'src/app/shared/services';
import { BlogService } from 'src/app/shared/services/blog/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less']
})
export class BlogComponent implements OnInit {

  posts$: Observable<any[]>;
  selectedPost: any;
  showLoader = false;

  constructor(
    private apiService: ApiService,
    private blogService: BlogService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.showLoader = true;
    this.posts$ = this.apiService.getPosts();
    this.posts$.subscribe(s => {
      console.log(s);
      this.blogService.setBlogItems(s);
      this.showLoader = false;
    });
  }

  goToPost(id) {
    this.router.navigate([`/blog/${id}`]);
  }

}
