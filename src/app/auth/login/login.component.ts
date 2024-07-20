import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordFieldType: string = 'password';

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login(form: NgForm) {
    if (!form.valid) {
      // If the form is invalid, do nothing
      return;
    }

    if (!this.email || !this.password) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'All fields are required' },
      });
      return;
    }

    if (
      !(
        this.email === 'sonalinehere802@gmail.com' &&
        this.password === 'Sonali@123'
      )
    ) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Unauthorized user ' },
        position: { top: '250px' },
      });
      return;
    }

    try {
      this.auth.login(this.email, this.password);
      // Redirect after successful login
      this.router.navigate(['/home']);
    } catch (error) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Login failed. Please try again.' },
      });
    }
  }

  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
