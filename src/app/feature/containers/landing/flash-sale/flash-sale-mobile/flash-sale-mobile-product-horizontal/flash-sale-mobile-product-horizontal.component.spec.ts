import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleMobileProductHorizontalComponent } from './flash-sale-mobile-product-horizontal.component';

describe('FlashSaleMobileProductHorizontalComponent', () => {
  let component: FlashSaleMobileProductHorizontalComponent;
  let fixture: ComponentFixture<FlashSaleMobileProductHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashSaleMobileProductHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashSaleMobileProductHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
