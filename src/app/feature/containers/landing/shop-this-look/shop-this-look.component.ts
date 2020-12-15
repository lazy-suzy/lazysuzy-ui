import {Component, Input, OnInit} from '@angular/core';
import {BoardService} from '../../../../modules/board/board.service';
import {Board} from '../../../../modules/board/board';
import {environment} from '../../../../../environments/environment';
import {boardRoutesNames} from '../../../../modules/board/board.routes.names';

@Component({
    selector: 'app-shop-this-look',
    templateUrl: './shop-this-look.component.html',
    styleUrls: ['./shop-this-look.component.less']
})
export class ShopThisLookComponent implements OnInit {
    @Input() isHandset;

    boardPreviewLink = boardRoutesNames.BOARD_PREVIEW;
    sharedBoards = [];
    responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    timestamp = new Date().getTime();

    constructor(
        private boardService: BoardService
    ) {
    }

    ngOnInit() {
        this.getBoards();
    }

    getBoards() {
        this.boardService.getPublicBoards().subscribe((response) => {
            const boards = response.reverse();
            this.sharedBoards = boards.filter(
                (b) => b.type_privacy === 2 && b.is_published === 1
            );
        });
    }

    getPreviewImagePath(board: Board) {
        if (board.preview) {
            return `${environment.BASE_HREF}${board.preview}?v=${this.timestamp}`;
        } else {
            return 'https://via.placeholder.com/500x400';
        }
    }
}
