import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'emptyPipe'})
export class EmptyPipe implements PipeTransform {
  transform(value: any) {
    return (!!value) ? value: '(empty)';
  }
}
