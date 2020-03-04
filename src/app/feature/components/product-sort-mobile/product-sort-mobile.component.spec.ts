import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSortMobileComponent } from './product-sort-mobile.component';

describe('ProductSortMobileComponent', () => {
  let component: ProductSortMobileComponent;
  let fixture: ComponentFixture<ProductSortMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSortMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSortMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
