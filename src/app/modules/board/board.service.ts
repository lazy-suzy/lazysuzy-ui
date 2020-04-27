import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Board } from './board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiURL = 'http://four-nodes.com/projects/lazysuzy/server.php';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getBoards(): Observable<Board[]> {
    return this.http.post<Board[]>(this.apiURL, { operation: 'select', entity: 'board', column: "board_id, title, preview", where: { is_active: 1 } }, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched boards')),
        catchError(this.handleError<Board[]>('getBoards', []))
      );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.apiURL, { operation: 'insert', entity: 'board', data: board }, this.httpOptions).pipe(
      tap((newBoard: Board) => this.log(`added board w/ id=${newBoard.board_id}`)),
      catchError(this.handleError<Board>('addBoard'))
    );
  }

  deleteBoard(board: Board | number): Observable<Board> {
    const id = typeof board === 'number' ? board : board.board_id;

    return this.http.post<Board>(this.apiURL, { operation: 'update', entity: 'board', data: { is_active: 0 }, where: { board_id: id } }, this.httpOptions).pipe(
      tap(_ => this.log(`deleted board id=${id}`)),
      catchError(this.handleError<Board>('deleteBoard'))
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
