import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable, Subject } from 'rxjs';
import { ObjectiveConfig, User } from 'src/app/models/User';
import { ObjectiveConfigService } from 'src/app/services/db/objectiveConfig.service';

@Component({
  selector: 'app-user-objectives[user]',
  templateUrl: './user-objectives.component.html',
  styleUrls: ['./user-objectives.component.scss']
})
export class UserObjectivesComponent implements OnInit {

  @Input() user!: User;

  objectives$: Observable<ObjectiveConfig[] | null> = new Subject();

  constructor(public auth: Auth, private objectiveConfigService: ObjectiveConfigService) {
  }

  ngOnInit(): void {
    this.objectives$ = this.objectiveConfigService.list(this.user.id);
  }

}
