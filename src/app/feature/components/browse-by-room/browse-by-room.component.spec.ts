import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByRoomComponent } from './browse-by-room.component';

describe('BrowseByRoomComponent', () => {
  let component: BrowseByRoomComponent;
  let fixture: ComponentFixture<BrowseByRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseByRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
