import { Injectable } from '@angular/core';
import { IBoardSettings } from 'src/app/modules/board/models/board.interface';
import { DefaultBoardSettings } from 'src/app/modules/board/constants/board-default-settings';
import { ApiService } from '../api/api.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    settings: IBoardSettings;

    constructor(public apiService: ApiService) { }

    initDefaultSettings() {
        this.settings = { ...DefaultBoardSettings };
    }

    getSomeDataSample() {
        return this.apiService.getBrands();
    }

    getProductsDropdown() {
        let cars = [
            { label: 'Audi', value: 'Audi' },
            { label: 'BMW', value: 'BMW' },
            { label: 'Fiat', value: 'Fiat' },
            { label: 'Ford', value: 'Ford' },
            { label: 'Honda', value: 'Honda' },
            { label: 'Jaguar', value: 'Jaguar' },
            { label: 'Mercedes', value: 'Mercedes' },
            { label: 'Renault', value: 'Renault' },
            { label: 'VW', value: 'VW' },
            { label: 'Volvo', value: 'Volvo' },
        ];
        return of(cars).pipe(delay(5000));
    }

}
