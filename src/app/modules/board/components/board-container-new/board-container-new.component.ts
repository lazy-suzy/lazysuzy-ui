import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-container-new',
  templateUrl: './board-container-new.component.html',
  styleUrls: ['./board-container-new.component.less']
})
export class BoardContainerNewComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { }

  handleBoardSideNavUpdates(event) {
    this.router.navigate([`/board/${event.route}`]);
  }

}
