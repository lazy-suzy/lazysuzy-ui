import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { mockProductsAdd } from '../add/mock-products-add';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SelectComponent implements OnInit {

  allDepartments = [];
  showLoader: boolean = false;

  @Output() goToCategory: EventEmitter<any> = new EventEmitter();

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.boardService.getAllDepartments().subscribe((s: any) => {
      debugger;
      let depsObj = s['all_departments'] || [];
      depsObj = depsObj.map(ele=>{
        return ele;
      });
      this.allDepartments = s['all_departments'] || [];
      this.showLoader = false;
    });
  }

  handleSelectCategory(event) {
    this.goToCategory.emit(event);
  }

}
