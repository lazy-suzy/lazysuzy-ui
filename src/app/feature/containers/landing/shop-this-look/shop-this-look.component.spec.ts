import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopThisLookComponent } from './shop-this-look.component';

describe('ShopThisLookComponent', () => {
  let component: ShopThisLookComponent;
  let fixture: ComponentFixture<ShopThisLookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopThisLookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopThisLookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
