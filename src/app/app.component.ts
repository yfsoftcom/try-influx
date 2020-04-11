import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service'
@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'try-influx';

  CONFIG_KEY = 'ti#config';

  command = '';

  host = 'localhost';

  port = '8086';

  db = 'db';

  showSetting = false;

  // all of the history command record
  history = [];

  // all of the command & output
  outputs = [];

  // the command index, for flip the history
  index = -1;

  @ViewChild("commandInput") commandInputRef: ElementRef;

  @ViewChild("commandOutput") commandOutputRef: ElementRef;

  constructor(
    private http: HttpClient,
    private notifyService : NotificationService
  ) {}

  ngOnInit(){
    let config = localStorage.getItem(this.CONFIG_KEY);
    if(!!config){
      config = JSON.parse(config);
      this.host = config['host'];
      this.port = config['port'];
      this.db = config['db'];
    }
  }
  run(command) {
    if(!command || command == ''){
      return;
    }
    const current = {
      command,
      output: undefined,
    }

    this.command = '';
    this.history.push(command);
    this.index = this.history.length;

    if(command == 'clear'){
      this.outputs.splice(0, this.outputs.length);
      return;
    }
    let formData: any = new FormData();
    formData.append("q", command)
    this.http.post(`http://${this.host}:${this.port}/query?db=${this.db}`,
      formData,
      { observe: 'response' })
      .subscribe(resp => {
        let firstData = resp.body['results'][0];
        if(!!firstData.series){
          const { columns, values } = firstData.series[0];
          // display its body
          current.output = {
            success: true,
            data: JSON.stringify({columns, values }, null, 2)
          }

        }else{
          // no data;

        }
        setTimeout(()=>{
          this.commandOutputRef.nativeElement.scrollTop = this.commandOutputRef.nativeElement.scrollHeight;
        }, 200)
        console.log(current);
      },
      (error) => {
        current.output = {
          success: false,
          error: error.error.error
        }
        setTimeout(()=>{
          this.commandOutputRef.nativeElement.scrollTop = this.commandOutputRef.nativeElement.scrollHeight;
        }, 200)
      });

    this.outputs.push(current);

  }

  saveSetting() {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify({
      host: this.host,
      port: this.port,
      db: this.db,
    }))
    this.notifyService.showSuccess("Config saved successfully !!", "Success")
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
      this.command = this.history[this.index];
    }else{
      if(this.index >= this.history.length - 1){
        return; // the first one;
      }
      this.index++;
      this.command = this.history[this.index];
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
