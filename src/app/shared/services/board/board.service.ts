import { Injectable } from '@angular/core';
import { IBoardSettings } from 'src/app/modules/board/models/board.interface';
import { DefaultBoardSettings } from 'src/app/modules/board/constants/board-default-settings';
import { ApiService } from '../api/api.service';
import { of, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { allBoardsMock, allUploadsMock, myUploadsMock, addViaUrlResponse } from './mockboards';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    settings: IBoardSettings;

    allBoards = [];
    currentBoard = {};
    currentBoardProducts = [];
    myUploads = [];
    allUploads = [];

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
        this.allUploads = [...allUploadsMock];
        this.allBoards = [...allBoardsMock];
        this.myUploads = [...myUploadsMock];
        this.currentBoard = this.allBoards[0];
        this.currentBoardProducts = this.extractBoardItems(this.currentBoard);
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
        let state = JSON.parse(board.state);
        let objects = state.objects.map(ele => {
            return ele.referenceObject || {};
        });
        return objects;
    }

    getSomeDataSample(payload) {
        return this.apiService.getAllBoards(payload);
    }

    getAllBoards(payload) {
        this.allBoards = [...allBoardsMock];
        this.currentBoard = allBoardsMock[0];
        return of(allBoardsMock).pipe(delay(5000));
        // return this.apiService.getAllBoards(payload);
    }

    getBrowseTabData(category): Observable<any> {
        return this.apiService.getBrowseTabData(category.LS_ID);
    }

    getAllDepartments() {
        return this.apiService.getAllDepartments();
    }

    setFilterData(category, filterData) {
        this.state.filterData = { ...filterData };
    }

    getProductsDropdown() {
        let cars = [
            { label: 'Audi', value: 'Audi' },
            { label: 'BMW', value: 'BMW' },
            { label: 'Volvo', value: 'Volvo' },
        ];
        return of(cars).pipe(delay(5000));
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

    ngOnDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

}
