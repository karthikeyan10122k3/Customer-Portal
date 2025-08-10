import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salesItemNumber'
})
export class SalesItemNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value || value === '000000') return '—';
    return String(+value);
  }

}
