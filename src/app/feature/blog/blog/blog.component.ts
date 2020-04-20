import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less']
})
export class BlogComponent implements OnInit {

  posts$: Observable<any[]>;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.posts$ = this.apiService.getPosts();
  }

}
