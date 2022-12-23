import { Pipe, PipeTransform } from '@angular/core';

type LabelFormat = 'short' | 'long';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  transform(value: number | string, format: LabelFormat = 'long'): string {
    if (value == 31) {
      return format == 'long' ? 'tous les jours' : '💯';
    }

    return String(value);
  }

}
