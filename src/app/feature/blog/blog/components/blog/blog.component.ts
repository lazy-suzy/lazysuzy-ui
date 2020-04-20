import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

export const SideNavItems = [
  {
    name: 'Select',
    label: 'Select',
    value: 'Select'
  },
  {
    name: 'Browse',
    label: 'Browse',
    value: 'Browse'
  },
  {
    name: 'Add',
    label: 'Add',
    value: 'Add'
  },
  {
    name: 'Favorites',
    label: 'Favourites',
    value: 'Favorites'
  },
  {
    name: 'Text',
    label: 'Text',
    value: 'Text'
  },
  {
    name: 'Board',
    label: 'Board',
    value: 'Board'
  }
];


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less']
})
export class BlogComponent implements OnInit {

  posts$: Observable<any[]>;
  selectedPost: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.posts$ = this.apiService.getPosts();
    this.posts$.subscribe(s => {
      console.log(s);
    });
  }

  selectSideBarItem(post) {
    console.log(post);
    this.selectedPost = {...post};
    let id = post.id;
    // this.router.navigate([`/blog/${id}`]);
  }

}
