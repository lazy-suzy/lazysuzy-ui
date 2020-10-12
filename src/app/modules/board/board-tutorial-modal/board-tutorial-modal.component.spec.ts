import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTutorialModalComponent } from './board-tutorial-modal.component';

describe('BoardTutorialModalComponent', () => {
  let component: BoardTutorialModalComponent;
  let fixture: ComponentFixture<BoardTutorialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTutorialModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTutorialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
