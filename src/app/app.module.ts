import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { ImageCropperModule } from 'ngx-image-cropper';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { HelloComponent } from './login/hello/hello.component';
import { UsersListComponent } from './community/users-list/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObjectivesComponent } from './objectives/objectives.component';
import { CommunityObjectivesComponent } from './objectives/community-objectives/community-objectives.component';
import { UserObjectivesComponent } from './objectives/user-objectives/user-objectives.component';
import { ObjectiveComponent } from './objectives/objective/objective.component';
import { UserObjectiveComponent } from './objectives/user-objective/user-objective.component';
import { LabelPipe } from './objectives/label.pipe';
import { CommunityComponent } from './community/community.component';
import { ObjectiveFormComponent } from './objectives/objective-form/objective-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivityComponent } from './activity/activity.component';
import { ActivityMonthComponent } from './activity/activity-month/activity-month.component';
import { CommunityProfileComponent } from './community/community-profile/community-profile.component';
import { FollowBadgeComponent } from './community/follow-badge/follow-badge.component';
import { UserBadgeComponent } from './community/user-badge/user-badge.component';
import { ImageResizerComponent } from './settings/image-resizer/image-resizer.component';
import { UserObjectiveDetailsComponent } from './objectives/user-objective-details/user-objective-details.component';
import { AveragePipe } from './objectives/average.pipe';
import { GroupDetailsComponent } from './group/group-details/group-details.component';
import { GroupBadgeComponent } from './group/group-badge/group-badge.component';
import { GroupsListComponent } from './group/groups-list/groups-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    HelloComponent,
    UsersListComponent,
    ObjectivesComponent,
    CommunityObjectivesComponent,
    UserObjectivesComponent,
    ObjectiveComponent,
    UserObjectiveComponent,
    LabelPipe,
    AveragePipe,
    CommunityComponent,
    ObjectiveFormComponent,
    ActivityComponent,
    ActivityMonthComponent,
    CommunityProfileComponent,
    FollowBadgeComponent,
    UserBadgeComponent,
    ImageResizerComponent,
    UserObjectiveDetailsComponent,
    GroupDetailsComponent,
    GroupBadgeComponent,
    GroupsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();
      // while this works, it provokes binding glitches
      // enableIndexedDbPersistence(firestore);

      return firestore;
    }),
    provideStorage(() => getStorage()),
    ImageCropperModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatBottomSheetModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
