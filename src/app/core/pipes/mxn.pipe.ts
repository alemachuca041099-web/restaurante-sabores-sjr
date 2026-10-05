import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats a number as Mexican pesos without decimals: 186 -> "$186". */
@Pipe({ name: 'mxn' })
export class MxnPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return formatter.format(value);
  }
}
