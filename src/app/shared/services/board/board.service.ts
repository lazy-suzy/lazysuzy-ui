import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { of, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { allBoardsMock, allUploadsMock, myUploadsMock, addViaUrlResponse } from './mockboards';
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

    constructor(public apiService: ApiService) { }

    initBoard(boardId) {

        //To Ask Mike
        this.getAllBoards({}).subscribe(s => {
            this.state.allUploads = [...allUploadsMock];
            this.state.allBoards = [...allBoardsMock];
            this.state.myUploads = [...myUploadsMock];
            this.state.currentBoard = this.state.allBoards[0];
            this.state.currentBoardProducts = this.extractBoardItems(this.state.currentBoard);
            this.state = {
                ...this.state
            };
        });
    }

    resetBoardSelectCache() {
        this.state.selectedCategory = null;
        this.state.filterData = null;
    }

    getBoardStateObs(): Observable<any> {
        return this.boardState.asObservable();
    }

    setBoardStateObs(profile: any) {
        this.boardState.next(profile);
    }

    extractBoardItems(board) {
        let state = JSON.parse(board.state);
        let objects = state.objects.map(ele => {
            return ele.referenceObject || {};
        });
        return objects;
    }

    getSomeDataSample1(payload) {
        return this.apiService.getAllBoards(payload);
    }

    getAllBoards(payload) {
        //TO ASK MIKE
        this.state.allBoards = [...allBoardsMock];
        this.state.currentBoard = allBoardsMock[0];
        return of(allBoardsMock).pipe(delay(5000));
        // return this.apiService.getAllBoards(payload);
    }

    getBrowseTabData(category): Observable<any> {
        return this.apiService.getBrowseTabData(category.LS_ID);
    }

    getAllDepartments() {
        return this.apiService.getAllDepartmentsBoard();
    }

    getAllDepartmentsBoard() {
        return this.apiService.getAllDepartmentsBoard();
    }

    setFilterData(category, filterData) {
        this.state.filterData = { ...filterData };
    }

    saveAddViaUrl(payload) {
        //TO ASK MIKE
        return of(addViaUrlResponse).pipe(delay(5000));
    }

    uploadFileManual(payload) {
        // return this.apiService.getAllBoards(payload);
        //TO ASK MIKE
        return of(addViaUrlResponse).pipe(delay(5000));
    }

    setCategory(category) {
        this.state.selectedCategory = { ...category };
    }

    getCategory() {
        return this.state.selectedCategory;
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

}
