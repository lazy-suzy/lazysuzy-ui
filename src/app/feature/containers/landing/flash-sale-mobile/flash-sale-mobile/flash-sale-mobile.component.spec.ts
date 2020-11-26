import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleMobileComponent } from './flash-sale-mobile.component';

describe('FlashSaleMobileComponent', () => {
  let component: FlashSaleMobileComponent;
  let fixture: ComponentFixture<FlashSaleMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashSaleMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashSaleMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
