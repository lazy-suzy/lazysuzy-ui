import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllArrivalsComponent } from './see-all-arrivals.component';

describe('SeeAllArrivalsComponent', () => {
  let component: SeeAllArrivalsComponent;
  let fixture: ComponentFixture<SeeAllArrivalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllArrivalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
