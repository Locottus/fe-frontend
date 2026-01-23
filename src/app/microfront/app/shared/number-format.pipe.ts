import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null || value === '' || isNaN(Number(value.toString().trim()))) {
      return '-';
    }
    const num = parseFloat(value.toString());
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
