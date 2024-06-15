import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    if (
      this.email === 'sonalinehere802@gmail.com' &&
      this.password === 'Sonali@123'
    ) {
      this.auth.login(this.email, this.password);

      this.email = '';
      this.password = '';
    } else {
      alert('Unauthorized user ');
    }
  }

  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
