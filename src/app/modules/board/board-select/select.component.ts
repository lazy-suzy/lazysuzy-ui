import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BoardService } from 'src/app/shared/services/board/board.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less', '../board.component.less']
})
export class SelectComponent implements OnInit {
  @Input() showMenu: boolean;
  allDepartments = [];
  filteredDepartments = [];
  showLoader: boolean = false;
  filter: FormControl;
  filter$: Observable<string>;
  @Output() goToCategory: EventEmitter<any> = new EventEmitter();

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    if (!this.showMenu) {
      this.showLoader = false;
    } else {
      this.showLoader = true;
    }
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges;
    this.boardService.getAllDepartments().subscribe((s: any) => {
      this.allDepartments = s || [];
      this.filteredDepartments = [...this.allDepartments];
      this.showLoader = false;
    });
    this.filter$.pipe(debounceTime(200)).subscribe((searchString) => {
      this.filteredDepartments = this.allDepartments.filter((dept) =>
        dept.category.toLowerCase().includes(searchString)
      );
    });
  }

  handleSelectCategory(event) {
    this.goToCategory.emit(event);
  }
}
