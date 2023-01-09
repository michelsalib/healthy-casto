import { Component, Input } from '@angular/core';
import { Group } from 'src/app/models/Group';

@Component({
  selector: 'app-group-badge[group]',
  templateUrl: './group-badge.component.html',
  styleUrls: ['./group-badge.component.scss']
})
export class GroupBadgeComponent {

  @Input() group!: Group;
  @Input() size: 'medium' | 'small' = 'medium';
  @Input() tooltip?: string;

}
