import { Component } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: Auth, public router: Router) { }

  async logout() {
    await signOut(this.auth);

    this.router.navigateByUrl('/login');
  }
}
