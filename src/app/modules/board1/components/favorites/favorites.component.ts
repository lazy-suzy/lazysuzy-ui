import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.less']
})
export class FavoritesComponent implements OnInit {
  
  all_departments = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAllDepartments().subscribe((s: any) => {
      this.all_departments = s;
    });
  }

}
