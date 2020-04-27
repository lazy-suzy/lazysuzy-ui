import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { Board } from '../board';
import { BoardService } from '../board.service';
import { boardRoutesNames } from '../board.routes.names';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.less']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];

  constructor(
    private boardService: BoardService,
    private cookieService: CookieService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    this.boardService.getBoards()
      .subscribe(response => this.boards = response);
  }

  add(title: string = ""): void {
    title = title.trim();
    if (!title) { title = 'Untitled Board ' + this.getToday() }
    this.boardService.addBoard({ title } as Board)
      .subscribe(board => {
        this.boards.push(board);
      });
  }

  edit(board: Board): void{
    this.cookieService.set('board_id', board.board_id.toString());
    this.router.navigateByUrl("board/" + boardRoutesNames.BOARD_VIEW);
  }

  delete(board: Board): void {
    this.boards = this.boards.filter(h => h !== board);
    this.boardService.deleteBoard(board).subscribe();
  }

  getToday() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

}
