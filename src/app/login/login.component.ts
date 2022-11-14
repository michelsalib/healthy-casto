import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: Auth, public router: Router) { }

  ngOnInit(): void {
  }
  
  async login() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());

    this.router.navigateByUrl('/');
  }

}
