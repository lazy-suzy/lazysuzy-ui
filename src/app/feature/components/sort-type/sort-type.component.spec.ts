import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortTypeComponent } from './sort-type.component';

describe('SortTypeComponent', () => {
  let component: SortTypeComponent;
  let fixture: ComponentFixture<SortTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
