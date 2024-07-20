import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { DataService } from '../../../shared/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  data: any;

  constructor(
    private dataService: DataService,
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {
    this.data = this.dataService.getData();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Specify the duration in milliseconds
    });
  }

  isYouTubeLink(link: string): boolean {
    return link.includes('youtube.com') || link.includes('youtu.be');
  }

  getYouTubeLink(link: string): string {
    // Convert to YouTube app link if necessary
    if (this.isYouTubeLink(link)) {
      if (link.includes('youtube.com')) {
        return link.replace('https://www.youtube.com', 'vnd.youtube');
      } else if (link.includes('youtu.be')) {
        return link.replace('https://youtu.be', 'vnd.youtube');
      }
    }
    return link;
  }

  getLinkTarget(link: string): string {
    // Return '_self' for YouTube links to open in app, '_blank' otherwise
    return this.isYouTubeLink(link) ? '_self' : '_blank';
  }

  routeToHome() {
    this.router.navigate(['dashboard']);
  }

  routeBack() {
    this.location.back(); // Navigate back to the previous page
  }
}
