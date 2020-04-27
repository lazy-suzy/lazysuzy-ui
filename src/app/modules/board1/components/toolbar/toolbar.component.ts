import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit {

  @Output() toolbarActions: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { }

  action(state) {
    const evt = {
      name: state,
      value: state,
      payload: {}
    };
    this.emitActions(evt);
  }

  zoomOut() {
    const evt = {
      name: 'zoomOut',
      value: 'zoomOut',
      payload: {}
    };
    this.emitActions(evt);
  }



  zoomIn() {
    const evt = {
      name: 'zoomIn',
      value: 'zoomIn',
      payload: {}
    };
    this.emitActions(evt);
  }

  undo() {
    const evt = {
      name: 'undo',
      value: 'undo',
      payload: {}
    };
    this.emitActions(evt);
  }

  redo() {
    const evt = {
      name: 'redo',
      value: 'redo',
      payload: {}
    };
    this.emitActions(evt);
  }

  handleCrop(param) {
    param = param || 'handleCrop';
    const evt = {
      name: param,
      value: param,
      payload: param
    };
    this.emitActions(evt);
  }

  handleCrop1() {

  }

  emitActions(evt) {
    this.toolbarActions.emit(evt);
  }

}
