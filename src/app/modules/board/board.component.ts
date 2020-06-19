import { Component, OnInit } from '@angular/core';
import { boardRoutesNames } from './board.routes.names';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {
  boardListLink = './' + boardRoutesNames.BOARD_LIST;

  constructor() {}

  ngOnInit(): void {}
}
