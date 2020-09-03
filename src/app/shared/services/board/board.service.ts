import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { of, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { addViaUrlResponse } from './mockboards';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  settings: any;

  state: any = {
    allBoards: [],
    currentBoard: {},
    currentBoardProducts: [],
    myUploads: [],
    allUploads: [],
    selectedCategory: null,
    filterData: {}
  };

  private boardState: BehaviorSubject<any> = new BehaviorSubject(this.state);
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(public apiService: ApiService) {}

  resetBoard() {
    this.state.allUploads = [];
    this.state.allBoards = [];
    this.state.selectedCategory = null;
    this.state.myUploads = [];
    this.state.currentBoard = [];
    this.state.currentBoardProducts = [];
    this.state = {
      ...this.state
    };
  }

  getBoardStateObs(): Observable<any> {
    return this.boardState.asObservable();
  }

  setBoardStateObs(profile: any) {
    this.boardState.next(profile);
  }

  extractBoardItems(board) {
    const state = JSON.parse(board.state);
    const objects = state.objects.map((ele) => {
      return ele.referenceObject || {};
    });
    return objects;
  }

  getBrowseTabData(category, appliedFilters, pageNo): Observable<any> {
    return this.apiService.getBrowseTabData(
      category.LS_ID,
      appliedFilters,
      pageNo
    );
  }

  getAllDepartments() {
    return this.apiService.getAllDepartmentsBoard();
  }

  setBoardData(products, category, filterData) {
    this.state.filterData = { ...filterData };
    this.state.selectedCategory = { ...category };
    this.state.myUploads = [...products];
    this.state.allUploads = [...products];
    this.state.currentBoardProducts = [...products];
  }

  saveAddViaUrl(payload) {
    // TO ASK MIKE
    return of(addViaUrlResponse).pipe(delay(5000));
  }

  uploadFileManual(payload) {
    // return this.apiService.getAllBoards(payload);
    // TO ASK MIKE
    return of(addViaUrlResponse).pipe(delay(5000));
  }

  setCategory(category) {
    this.state.selectedCategory = { ...category };
  }

  getCategory() {
    return this.state.selectedCategory;
  }

  onDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
