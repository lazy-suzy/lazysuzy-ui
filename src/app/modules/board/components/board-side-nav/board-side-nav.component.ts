import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SideNavItems } from './sidenavitems';
import { BoardService } from 'src/app/shared/services/board/board.service';

@Component({
  selector: 'app-board-side-nav',
  templateUrl: './board-side-nav.component.html',
  styleUrls: ['./board-side-nav.component.less']
})
export class BoardSideNavComponent implements OnInit {

  sideBarItems = SideNavItems;
  loading = false;
  selected: any;
  isLoaded = false;

  @Output() updates: EventEmitter<any> = new EventEmitter();

  constructor(public boardService: BoardService) { }

  ngOnInit(): void {
    this.selectSideBarItem({
      name: 'Select',
      label: 'Select',
      value: 'Select'
    });
  }

  selectSideBarItem(sideItem: any) {
    this.selected = sideItem;
    this.updates.emit(this.selected);
  }

}
