import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApiService,
  UtilsService,
  CacheService,
  EventEmitterService
} from 'src/app/shared/services';
import { IDisplayProfile } from '../../../shared/models';
import { environment as env } from 'src/environments/environment';
import { Board } from '../../../modules/board/board';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-profile',
  templateUrl: './publicProfile.component.html',
  styleUrls: ['./publicProfile.component.less']
})
export class PublicProfileComponent implements OnInit {
  PRIVACY_PRIVATE = 0;
  PRIVACY_LINK_SHARE = 1;
  PRIVACY_PUBLIC = 2;
  BOARD_PUBLISHED = 1;
  routeSubscription: any;
  username: string;
  profile: IDisplayProfile;
  isLoading = false;
  spinner = 'assets/image/spinner.gif';
  boards: Board[] = [];
  hasPicture: boolean;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.username = routeParams.profile;
      }
    );
    this.apiService
      .fetchDisplayProfile(this.username)
      .subscribe((payload: any) => {
        if (payload[0] !== null) {
          this.profile = payload;
          this.hasPicture =
            payload.picture && payload.picture !== 'null' ? true : false;
          if (this.hasPicture) {
            this.profile.picture = this.utils.updateProfileImageLink(
              payload.picture
            );
          }
        }
        this.isLoading = false;
      });

    this.apiService.getUserBoards(this.username).subscribe((payload: any) => {
      this.boards = payload.filter((board) => {
        return (
          board.is_published === this.BOARD_PUBLISHED &&
          board.type_privacy === this.PRIVACY_PUBLIC
        );
      });
    });
  }
  onDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
  getPreviewImagePath(board: Board) {
    if (board.preview) {
      const timestamp = new Date().getTime();
      return `${environment.BASE_HREF}${board.preview}?v=${timestamp}`;
    } else {
      return 'https://via.placeholder.com/500x400';
    }
  }

  likeBoard(boardId, like) {
    this.isLoading = true;
    this.apiService.likeBoard(boardId, like).subscribe((payload) => {
      const board = this.boards.find((id) => boardId === id.uuid);
      this.utils.updateBoardLike(board, like);
      this.isLoading = false;
    });
  }
}
