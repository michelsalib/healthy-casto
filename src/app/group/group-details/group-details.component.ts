import { Component, OnInit } from '@angular/core';
import { documentId, where } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, of, Subject, switchMap } from 'rxjs';
import { Group } from 'src/app/models/Group';
import { User } from 'src/app/models/User';
import { GroupsService } from 'src/app/services/db/groups.service';
import { UsersService } from 'src/app/services/db/users.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  dataset$: Observable<{
    group: Group;
    users: User[] | null;
  }> = new Subject();

  constructor(private route: ActivatedRoute, private userDb: UsersService, private groupService: GroupsService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const groupId = params.get('groupId');

      if (!groupId) {
        throw 'Required group id missing';
      }

      this.dataset$ = this.groupService.get(groupId)
        .pipe(
          switchMap(group => 
            combineLatest([
              of(group),
              this.userDb.list(where(documentId(), 'in', group.members.slice(0, 10)))
            ])
          ),
          map(([group, users])=> {
            return {
              group, users,
            };
          })
        );
    });
  }

}
