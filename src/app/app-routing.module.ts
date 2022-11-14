import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CommunityObjectivesComponent } from './objectives/community-objectives/community-objectives.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', component: HomeComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'login', component: LoginComponent, ...canActivate(() => redirectLoggedInTo([''])) },
  { path: 'profile', component: ProfileComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'community', component: UsersListComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'objectives', component: CommunityObjectivesComponent, ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
