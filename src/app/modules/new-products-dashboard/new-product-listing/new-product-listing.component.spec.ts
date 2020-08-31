import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductListingComponent } from './new-product-listing.component';

describe('NewProductListingComponent', () => {
  let component: NewProductListingComponent;
  let fixture: ComponentFixture<NewProductListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
