import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, pointer?: any): any {
    if(!pointer){
      return parseInt(value, 10)
    }
    return value.toString().match('^-?\\d+(?:\\.\\d{0,' + pointer + '})?')[0];
  }

}
