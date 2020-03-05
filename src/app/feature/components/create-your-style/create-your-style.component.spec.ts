import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateYourStyleComponent } from './create-your-style.component';

describe('CreateYourStyleComponent', () => {
  let component: CreateYourStyleComponent;
  let fixture: ComponentFixture<CreateYourStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateYourStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateYourStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
