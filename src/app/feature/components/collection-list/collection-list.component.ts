import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.less']
})
export class CollectionListComponent implements OnInit {
  @Input() collectionsList = [];
  @Output() emitCollection = new EventEmitter<any>();
  constructor(
      private router:Router
  ) { }

  ngOnInit() {
  }
  setCollection(collection:string){
    let filterValue = '';
    if (collection !== '') {
      filterValue = 'collection:' + collection + ';';
    }
    this.router.navigateByUrl(`/products/collections?undefined=true&filters=${filterValue}&sort_type=&pageno=1`)
    this.emitCollection.emit(collection);
  }

}
