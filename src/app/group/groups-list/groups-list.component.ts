import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { GroupsService } from 'src/app/services/db/groups.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {
  groups$: Observable<Group[] | null> = new Subject();

  constructor(private groups: GroupsService) {

  }
  
  ngOnInit(): void {
    this.groups$ = this.groups.list();
  }
}
