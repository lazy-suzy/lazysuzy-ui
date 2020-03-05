import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllTopDealsComponent } from './see-all-top-deals.component';

describe('SeeAllTopDealsComponent', () => {
  let component: SeeAllTopDealsComponent;
  let fixture: ComponentFixture<SeeAllTopDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllTopDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllTopDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
