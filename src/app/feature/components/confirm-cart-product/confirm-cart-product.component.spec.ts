import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCartProductComponent } from './confirm-cart-product.component';

describe('ConfirmCartProductComponent', () => {
  let component: ConfirmCartProductComponent;
  let fixture: ComponentFixture<ConfirmCartProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCartProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCartProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
