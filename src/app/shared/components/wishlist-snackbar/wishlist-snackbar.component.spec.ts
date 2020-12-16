import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistSnackbarComponent } from './wishlist-snackbar.component';

describe('WishlistSnackbarComponent', () => {
  let component: WishlistSnackbarComponent;
  let fixture: ComponentFixture<WishlistSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishlistSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
