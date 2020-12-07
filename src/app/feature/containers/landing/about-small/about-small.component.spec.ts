import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSmallComponent } from './about-small.component';

describe('AboutSmallComponent', () => {
  let component: AboutSmallComponent;
  let fixture: ComponentFixture<AboutSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
