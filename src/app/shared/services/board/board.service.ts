import { Injectable } from '@angular/core';
import { IBoardSettings } from 'src/app/modules/board/models/board.interface';
import { DefaultBoardSettings } from 'src/app/modules/board/constants/board-default-settings';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    settings: IBoardSettings;

    constructor(public apiService: ApiService) { }

    initDefaultSettings() {
        this.settings = { ...DefaultBoardSettings };
    }

    getSomeDataSample(){
        return this.apiService.getBrands();
    }

}
