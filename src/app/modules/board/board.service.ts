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

  private boardEndpoint = environment.API_BASE_HREF + 'board/';
  private assetEndpoint = environment.API_BASE_HREF + 'board/asset/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${this.cookie.get('token')}`
    })
  };

  constructor(private http: HttpClient, private cookie: CookieService, public apiService: ApiService) {
    super(apiService);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.boardEndpoint, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched boards')),
        catchError(this.handleError<Board[]>('getBoards', []))
      );
  }

  getBoardByID(board_id: string): Observable<Board[]> {
    return this.http.get<Board[]>(this.boardEndpoint + board_id, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched board w/ id=${board_id}`)),
        catchError(this.handleError<Board[]>('getBoardsByID', []))
      );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.boardEndpoint, board, this.httpOptions).pipe(
      tap((newBoard: Board) => this.log(`added board w/ id=${newBoard.board_id}`)),
      catchError(this.handleError<Board>('addBoard'))
    );
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.boardEndpoint + board.uuid, board, this.httpOptions).pipe(
      tap((newBoard: Board) => this.log(`updated board w/ id=${newBoard.board_id}`)),
      catchError(this.handleError<Board>('updateBoard'))
    );
  }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.assetEndpoint, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched assets')),
        catchError(this.handleError<Asset[]>('getAssets', []))
      );
  }
  updateAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.assetEndpoint + asset.asset_id, asset, this.httpOptions).pipe(
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
