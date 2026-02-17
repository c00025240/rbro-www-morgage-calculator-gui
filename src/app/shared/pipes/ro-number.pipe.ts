import { Pipe, PipeTransform } from '@angular/core';
import { formatRoNumber } from '../utils/format-number.util';

@Pipe({ name: 'roNumber', standalone: true })
export class RoNumberPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 2, suffix?: string): string {
    return formatRoNumber(value, decimals, suffix);
  }
}
