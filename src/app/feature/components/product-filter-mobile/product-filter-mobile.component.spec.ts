import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterMobileComponent } from './product-filter-mobile.component';

describe('ProductFilterMobileComponent', () => {
  let component: ProductFilterMobileComponent;
  let fixture: ComponentFixture<ProductFilterMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFilterMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
