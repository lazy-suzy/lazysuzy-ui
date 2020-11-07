import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureCareComponent } from './furniture-care.component';

describe('FurnitureCareComponent', () => {
  let component: FurnitureCareComponent;
  let fixture: ComponentFixture<FurnitureCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FurnitureCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
