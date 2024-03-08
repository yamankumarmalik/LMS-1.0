import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any[]): any {
    if (!value) return [];
    if (!args) return value;

    let val = args.toString().toLowerCase();
    return value.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(val);
    });
  }
}
