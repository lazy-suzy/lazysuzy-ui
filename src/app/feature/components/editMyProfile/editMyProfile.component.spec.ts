import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyProfileComponent } from './editMyProfile.component';

describe('EditMyProfileComponent', () => {
  let component: EditMyProfileComponent;
  let fixture: ComponentFixture<EditMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditMyProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
