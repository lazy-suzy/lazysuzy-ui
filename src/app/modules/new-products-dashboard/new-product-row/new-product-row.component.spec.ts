import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductRowComponent } from './new-product-row.component';

describe('NewProductRowComponent', () => {
  let component: NewProductRowComponent;
  let fixture: ComponentFixture<NewProductRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
