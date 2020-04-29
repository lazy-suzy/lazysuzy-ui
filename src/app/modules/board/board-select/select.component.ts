import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less', '../board.component.less']
})
export class SelectComponent implements OnInit {

  allDepartments = [];
  showLoader: boolean = false;

  @Output() goToCategory: EventEmitter<any> = new EventEmitter();

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.boardService.getAllDepartments().subscribe((s: any) => {
      this.allDepartments = s || [];
      this.showLoader = false;
    });
  }

  handleSelectCategory(event) {
    this.goToCategory.emit(event);
  }

}
