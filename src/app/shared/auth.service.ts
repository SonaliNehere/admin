import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private fireStorage: AngularFireStorage,
    private dialog: MatDialog
  ) {}

  uid?: string = '';
  email: any;
  password: any;

  // login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        console.log('res of : login', res);
        console.log(' uid : ', res?.user?.uid);
        this.uid = res?.user?.uid!.toString();
        this.email = email;
        this.password = password;

        localStorage.setItem('token', 'true');
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('uid', this.uid!.toString());

        if (res.user?.emailVerified == true) {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['/varify-email']);
        }
      },
      (err) => {
        // alert(err.message);
        // alert('Invalid id or password entered');
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: 'Invalid id or password entered'
          }
        });
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        console.log('res of : register', res);
        console.log(' uid : ', res?.user?.uid);
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  // sign out
  logout() {
    // if (confirm('Are you sure you want to sign out?')) {
    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog
    dialogConfig.position = {
      top: '250px',
      // right: '20px',
    };

    dialogConfig.data = {
      message: 'Are you sure you want to sign out?',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fireauth.signOut().then(
          () => {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            this.router.navigate(['/login']);
          },
          (err) => {
            // alert(err.message);
            this.dialog.open(ErrorDialogComponent, {
              data: {
                message: err.message
              }
            });
          }
        );
      }
    });
    // }
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/varify-email']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  // email varification
  sendEmailForVarification(user: any) {
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/varify-email']);
      },
      (err: any) => {
        alert('Something went wrong. Not able to send mail to your email.');
      }
    );
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        this.router.navigate(['/dashboard']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
