import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  data: any

  id: any;
  productName: string = '';
  productDesc: string = '';
  price: number | undefined;
  urlString: string = '';
  imageUrl: File | null = null;
  imageUpdated: boolean = false;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<EditComponent>,
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private router: Router,
  ) {
    this.data = this.dataService.getEditableData();
    console.log('data : ', this.data);
    this.productName = this.data.name;
    this.productDesc = this.data.desc;
    this.price = this.data.price;
    this.urlString = this.data.imageUrl;
    this.id = this.data.id;
  }

  async submitForm() {
    try {
      if (!this.imageUpdated) {
        await this.firestore.collection('products').doc(this.id).update({
          name: this.productName,
          desc: this.productDesc,
          price: this.price,
          imageUrl: this.urlString, // Use existing imageUrl or an empty string if no new image selected
          id: this.id,
        });
        this.openSnackBar('Product Updated Successfully ', 'Close');

        // Clear form fields after successful submission
        this.productName = '';
        this.productDesc = '';
        this.price = undefined;
        this.imageUrl = null; // Reset imageUrl
      } else {
        // Upload image to Firebase Storage
        const file = this.imageUrl;
        const path = `productImages/${file?.name}`;

        const uploadTask = await this.fireStorage.upload(path, file);

        // Get image URL as Observable
        const downloadUrl$ = this.fireStorage.ref(path).getDownloadURL();

        // Subscribe to the Observable to get the actual URL
        downloadUrl$.subscribe(async (downloadUrl) => {
          const imageUrl = downloadUrl.toString(); // Convert the URL to string

          await this.firestore.collection('products').doc(this.id).update({
            name: this.productName,
            desc: this.productDesc,
            price: this.price,
            imageUrl: imageUrl, // Use existing imageUrl or an empty string if no new image selected
            id: this.id,
          });
          this.openSnackBar('Product Updated Successfully ', 'Close');

          // Clear form fields after successful submission
          this.productName = '';
          this.productDesc = '';
          this.price = undefined;
          this.imageUrl = null; // Reset imageUrl

          this.imageUpdated = false;
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.openSnackBar('Error submitting form: ' + error, 'Close');
      // Handle error, display a message to the user, etc.
    }
    this.routeToHome();
  }

  onFileSelected(event: any) {
    this.imageUrl = event.target.files[0];
    this.imageUpdated = true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Specify the duration in milliseconds
    });
  }

  routeToHome() {
    this.router.navigate(['dashboard']);
  }

  isValid(){
    if( this.productName && this.productDesc && this.price &&  this.urlString){
      return true;
    }
    else{
      return false
    }
  }
}
