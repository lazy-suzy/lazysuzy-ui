import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Board } from './board';
import { Asset } from './asset';

import { BoardService as SharedBoardService } from 'src/app/shared/services/board/board.service';
import { ApiService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService extends SharedBoardService {

  private boardEndpoint = environment.API_BASE_HREF + 'board';
  private assetEndpoint = environment.API_BASE_HREF + 'board/asset';

  constructor(private http: HttpClient, private cookie: CookieService, public apiService: ApiService) {
    super(apiService);
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${this.cookie.get('token')}`
      })
    };
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.boardEndpoint, this.getHttpOptions())
      .pipe(
        tap(_ => this.log('fetched boards')),
        catchError(this.handleError<Board[]>('getBoards', []))
      );
  }

  getBoardByID(board_id: string, previewMode: boolean = false): Observable<Board[]> {
    return this.http.get<Board[]>(this.boardEndpoint + (previewMode ? '/preview' : '') + `/` + board_id, this.getHttpOptions())
      .pipe(
        tap(_ => this.log(`fetched board w/ id=${board_id}`)),
        catchError(this.handleError<Board[]>('getBoardsByID', []))
      );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.boardEndpoint, board, this.getHttpOptions()).pipe(
      tap((newBoard: Board) => this.log(`added board w/ id=${newBoard.board_id}`)),
      catchError(this.handleError<Board>('addBoard'))
    );
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.boardEndpoint + `/` + board.uuid, board, this.getHttpOptions()).pipe(
      tap((newBoard: Board) => this.log(`updated board w/ id=${newBoard.board_id}`)),
      catchError(this.handleError<Board>('updateBoard'))
    );
  }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.assetEndpoint, this.getHttpOptions())
      .pipe(
        tap(_ => this.log('fetched assets')),
        catchError(this.handleError<Asset[]>('getAssets', []))
      );
  }

  addAsset(asset: any): Observable<any> {
    return this.http.post<any>(this.assetEndpoint, asset, this.getHttpOptions()).pipe(
      tap((newAsset: any) => this.log(`add asset w/ id=${newAsset.asset_id}`)),
      catchError(this.handleError<any>('addAsset'))
    );
  }

  updateAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.assetEndpoint + `/`+ asset.asset_id, asset, this.getHttpOptions()).pipe(
      tap((newAsset: Asset) => this.log(`updated asset w/ id=${newAsset.asset_id}`)),
      catchError(this.handleError<Asset>('updateAsset'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    // log the message
  }
}
