import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllBestSellersComponent } from './see-all-best-sellers.component';

describe('SeeAllBestSellersComponent', () => {
  let component: SeeAllBestSellersComponent;
  let fixture: ComponentFixture<SeeAllBestSellersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllBestSellersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllBestSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
