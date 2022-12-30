import { Pipe, PipeTransform } from '@angular/core';
import { Objective } from '../models/Objective';

@Pipe({
  name: 'average'
})
export class AveragePipe implements PipeTransform {

  transform(value: number | string, objective: Objective): string {
    const numValue = String(value);

    if (numValue == '0') {
      return 'echec ' + objective.failure;
    }
    if (numValue == '0.5') {
      return 'demi point';
    }
    if (numValue == '1') {
      return 'succès ' + objective.success;
    }

    return numValue;
  }

}
