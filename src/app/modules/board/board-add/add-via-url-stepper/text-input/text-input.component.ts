import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent{

  @Output() outputText: EventEmitter<string> = new EventEmitter()
  text

  doChanges(){
    this.outputText.emit(this.text)
  }

}