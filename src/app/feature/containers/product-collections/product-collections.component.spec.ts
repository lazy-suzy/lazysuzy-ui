import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCollectionsComponent } from './product-collections.component';

describe('ProductCollectionsComponent', () => {
  let component: ProductCollectionsComponent;
  let fixture: ComponentFixture<ProductCollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
