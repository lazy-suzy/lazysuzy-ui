import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionsFilterComponent } from './dimensions-filter.component';

describe('DimensionsFilterComponent', () => {
  let component: DimensionsFilterComponent;
  let fixture: ComponentFixture<DimensionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimensionsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
