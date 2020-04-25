import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-page-posts',
  templateUrl: './page-posts.component.html',
  styleUrls: ['./page-posts.component.scss']
})
export class PagePostsComponent implements OnInit {

  posts$: Observable<any[]>;
  selectedPost: any;
  showLoader = false;
  postId = '';
  currentBlog: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.postId = params.id;
    });
  }

  ngOnInit() {
    this.showLoader = true;
    this.posts$ = this.apiService.getPostById(this.postId);
    this.posts$.subscribe(s => {
      this.currentBlog = s[0];
      // let str = this.currentBlog.content.rendered;
      // let toRemove = [
      //   '[vc_row]',
      //   '[vc_column]',
      //   '[vc_column_text]',
      //   '[vc_empty_space]',
      //   '[/vc_row]',
      //   '[/vc_column]',
      //   '[/vc_column_text]',
      //   '[/vc_empty_space]'
      // ];
      // toRemove.forEach(txt=>{
      //   str = str.replace(txt, '');
      // });
      // this.currentBlog.content.rendered = str;
      let x_tags = this.currentBlog.x_tags;
      x_tags = x_tags.split(',');
      this.currentBlog.x_tags = [...x_tags];
      this.showLoader = false;
    });
  }

}
