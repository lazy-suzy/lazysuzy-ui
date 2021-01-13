import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsMobileComponent } from './product-details-mobile.component';

describe('ProductDetailsMobileComponent', () => {
  let component: ProductDetailsMobileComponent;
  let fixture: ComponentFixture<ProductDetailsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
