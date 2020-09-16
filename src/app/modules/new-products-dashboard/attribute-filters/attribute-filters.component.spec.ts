import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeFiltersComponent } from './attribute-filters.component';

describe('AttributeFiltersComponent', () => {
  let component: AttributeFiltersComponent;
  let fixture: ComponentFixture<AttributeFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
