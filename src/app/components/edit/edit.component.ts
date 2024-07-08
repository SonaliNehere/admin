// import { Component, Inject } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import {
//   MAT_DIALOG_DATA,
//   MatDialog,
//   MatDialogRef,
// } from '@angular/material/dialog';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { DataService } from '../../shared/data.service';
// import { Router } from '@angular/router';
// import { LoaderService } from '../../shared/loader.service';

// @Component({
//   selector: 'app-edit',
//   templateUrl: './edit.component.html',
//   styleUrl: './edit.component.css',
// })
// export class EditComponent {
//   data: any;

//   id: any;
//   productName: string = '';
//   productDesc: string = '';
//   price: number | undefined;
//   urlString: string = '';
//   imageUrl: File | null = null;
//   productVideoLink: string = '';
//   imageUpdated: boolean = false;
  
//   isLoading: boolean = false;

//   constructor(
//     private fireStorage: AngularFireStorage,
//     private firestore: AngularFirestore,
//     private _snackBar: MatSnackBar,
//     private dataService: DataService,
//     private router: Router,
//     private loaderService: LoaderService,
//   ) {
//     this.data = this.dataService.getEditableData();
//     console.log('data : ', this.data);
//     this.productName = this.data.name;
//     this.productDesc = this.data.desc;
//     this.price = this.data.price;
//     this.urlString = this.data.imageUrl;
//     this.id = this.data.id;
//     this.productVideoLink = this.data.productVideoLink;
//   }

//   async submitForm() {
//     // this.isLoading = this.loaderService.show();
//     try {
//       if (!this.imageUpdated) {
//         await this.firestore.collection('products').doc(this.id).update({
//           name: this.productName,
//           desc: this.productDesc,
//           price: this.price,
//           imageUrl: this.urlString, // Use existing imageUrl or an empty string if no new image selected
//           id: this.id,
//           productVideoLink: this.productVideoLink
//         });
//         // this.isLoading = this.loaderService.hide();
//         this.openSnackBar('Product Updated Successfully ', 'Close');

//         // Clear form fields after successful submission
//         this.productName = '';
//         this.productDesc = '';
//         this.price = undefined;
//         this.imageUrl = null; // Reset imageUrl
//         this.productVideoLink = '';
//       } else {
//         // Upload image to Firebase Storage
//         const file = this.imageUrl;
//         const path = `productImages/${file?.name}`;

//         const uploadTask = await this.fireStorage.upload(path, file);

//         // Get image URL as Observable
//         const downloadUrl$ = this.fireStorage.ref(path).getDownloadURL();

//         // Subscribe to the Observable to get the actual URL
//         downloadUrl$.subscribe(async (downloadUrl) => {
//           const imageUrl = downloadUrl.toString(); // Convert the URL to string

//           await this.firestore.collection('products').doc(this.id).update({
//             name: this.productName,
//             desc: this.productDesc,
//             price: this.price,
//             imageUrl: imageUrl, // Use existing imageUrl or an empty string if no new image selected
//             id: this.id,
//             productVideoLink: this.productVideoLink
//           });
//           // this.isLoading = this.loaderService.hide();
//           this.openSnackBar('Product Updated Successfully ', 'Close');

//           // Clear form fields after successful submission
//           this.productName = '';
//           this.productDesc = '';
//           this.price = undefined;
//           this.imageUrl = null; // Reset imageUrl
//           this.productVideoLink = ';'

//           this.imageUpdated = false;
//         });
//       }
//     } catch (error) {
//       // this.isLoading = this.loaderService.hide();
//       console.error('Error submitting form:', error);
//       this.openSnackBar('Error submitting form: ' + error, 'Close');
//       // Handle error, display a message to the user, etc.
//     }
//     this.routeToHome();
//   }

//   onFileSelected(event: any) {
//     this.imageUrl = event.target.files[0];
//     this.imageUpdated = true;
//   }

//   openSnackBar(message: string, action: string) {
//     this._snackBar.open(message, action, {
//       duration: 2000, // Specify the duration in milliseconds
//     });
//   }

//   routeToHome() {
//     this.router.navigate(['dashboard']);
//   }

//   isValid() {
//     if (this.productName && this.productDesc && this.price && this.urlString) {
//       return true;
//     } else {
//       return false;
//     }
//   }
// }

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/loader.service';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  data: any;
  id: any;
  productName: string = '';
  productDesc: string = '';
  price: number | undefined;
  urlString: string = '';
  imageUrl: File | null = null;
  productVideoLink: string = '';
  imageUpdated: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private router: Router,
    private loaderService: LoaderService,
  ) {
    this.data = this.dataService.getEditableData();
    console.log('data : ', this.data);
    this.productName = this.data.name;
    this.productDesc = this.data.desc;
    this.price = this.data.price;
    this.urlString = this.data.imageUrl;
    this.id = this.data.id;
    this.productVideoLink = this.data.productVideoLink;
  }

  async submitForm() {
    try {
      if (!this.imageUpdated) {
        await this.firestore.collection('products').doc(this.id).update({
          name: this.productName,
          desc: this.productDesc,
          price: this.price,
          imageUrl: this.urlString,
          id: this.id,
          productVideoLink: this.productVideoLink,
        });
        this.openSnackBar('Product Updated Successfully', 'Close');
        this.resetForm();
      } else {
        if (this.imageUrl) {
          const file = this.imageUrl as File;
          const path = `productImages/${file.name}`;
          const uploadTask = await this.fireStorage.upload(path, file);
          const downloadUrl$ = this.fireStorage.ref(path).getDownloadURL();

          downloadUrl$.subscribe(async (downloadUrl) => {
            const imageUrl = downloadUrl.toString();

            await this.firestore.collection('products').doc(this.id).update({
              name: this.productName,
              desc: this.productDesc,
              price: this.price,
              imageUrl: imageUrl,
              id: this.id,
              productVideoLink: this.productVideoLink,
            });
            this.openSnackBar('Product Updated Successfully', 'Close');
            this.resetForm();
            this.imageUpdated = false;
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.openSnackBar('Error submitting form: ' + error, 'Close');
    }
    this.routeToHome();
  }

  onFileSelected(event: any) {
    this.imageUrl = event.target.files[0] as File;
    this.imageUpdated = true;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.urlString = e.target.result;
    };
    reader.readAsDataURL(this.imageUrl);
  }

  deleteImage() {
    this.imageUrl = null;
    this.urlString = '';
    this.imageUpdated = true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  routeToHome() {
    this.router.navigate(['dashboard']);
  }

  isValid() {
    return !!(this.productName && this.productDesc && this.price && this.urlString);
  }

  resetForm() {
    this.productName = '';
    this.productDesc = '';
    this.price = undefined;
    this.imageUrl = null;
    this.urlString = '';
    this.productVideoLink = '';
  }
}
