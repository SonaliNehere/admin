import { Component } from '@angular/core';
import { loadavg } from 'os';
import { AuthService } from '../../shared/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  email: any;
  orderLength = 0;

  constructor(
    private auth: AuthService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private router: Router
  ) {
    this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  }

  logout() {
    this.dialogRef.close();
    this.auth.logout();
  }

  myOrders() {
    this.router.navigate(['orders']);
    this.dialogRef.close();
  }
}
