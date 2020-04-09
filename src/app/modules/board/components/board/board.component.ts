import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {
  
  boardProducts = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCustomProducts().subscribe((s: any) => {
      this.boardProducts = s;
    });
  }

}
