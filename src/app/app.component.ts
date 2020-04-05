import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'try-influx';

  command = '';

  history = [];

  index = -1;

  @ViewChild("commandInput") commandInputRef: ElementRef;

  constructor(
    private http: HttpClient
  ) {}

  run(command) {
    if(!command || command == ''){
      return;
    }
    const current = {
      command,
      output: undefined,
    }
    let formData: any = new FormData();
    formData.append("q", command)
    this.http.post('http://www.ruichen.top:18086/query?db=fpmiot',
      formData,
      { observe: 'response' })
      .subscribe(resp => {
        // display its body
        current.output = {
          success: true,
          data: JSON.stringify(resp.body, null, 2)
        }
        console.log(current);
      },
      (error) => {
        current.output = {
          success: false,
          error: error.error.error
        }
      });
    this.command = '';
    this.history.push(current);
    this.index = this.history.length;
  }

  submitCommand() {
    const command = this.command;
    this.run(command);
  }

  getHistory(director) {
    if(director == -1){
      if(this.index == 0){
        return; // the first one;
      }
      // get prev command
      this.index--;
      this.command = this.history[this.index].command;
    }else{
      if(this.index >= this.history.length - 1){
        return; // the first one;
      }
      this.index++;
      this.command = this.history[this.index].command;
    }
    this.cursorToEnd(this.commandInputRef.nativeElement, this.command);

    // TODO: scroll to the top;
  }

  cursorToEnd = (input, text) =>{
    input.value = text;
    this.setCaretToPos(input, text.length);
  };

  setCaretToPos = (input, pos) =>{
    this.setSelectionRange(input, pos, pos);
  };

  setSelectionRange = (input, selectionStart, selectionEnd) => {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  };
}
