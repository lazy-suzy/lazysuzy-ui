import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SideNavItems } from './sidenavitems';

@Component({
  selector: 'app-board-side-nav',
  templateUrl: './board-side-nav.component.html',
  styleUrls: ['./board-side-nav.component.less']
})
export class BoardSideNavComponent implements OnInit {

  constructor() {}
  
  ngOnInit(): void {
    this.selectSideBarItem({
      name: 'Select',
      label: 'Select',
      value: 'Select'
    });
  }

  sideBarItems = SideNavItems;
  loading = false;
  selected: any;
  isLoaded = false;

  @Output() updates: EventEmitter<any> = new EventEmitter();

  selectSideBarItem(sideItem: any) {
    const url = `search`;
    let payload = {};
    // this.loading = true;
    this.selected = sideItem;
    this.updates.emit(this.selected);
    // this.http.post<any[]>(url, payload).subscribe(res => {
    //   this.loading = false;
    //   this.selected = sideItem;
    //   this.isLoaded = true;
    // });
  }


}
