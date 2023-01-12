import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { CommunityComponent } from './community/community.component';
import { ObjectivesComponent } from './objectives/objectives.component';
import { CommunityProfileComponent } from './community/community-profile/community-profile.component';
import { GroupDetailsComponent } from './group/group-details/group-details.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', component: HomeComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo([''])) },
  { path: 'settings', component: SettingsComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'community', component: CommunityComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'community/:userId', component: CommunityProfileComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'groups/:groupId', component: GroupDetailsComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'objectives', component: ObjectivesComponent, ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
