import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
  productName: string = '';
  productDesc: string = '';
  price: number | undefined;
  imageUrl: File | null = null;
  selectedFile: File | null = null;

  constructor(
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
  }

  async submitForm() {
      try {
        // Upload image to Firebase Storage
        const file = this.imageUrl;
        const path = `productImages/${file?.name}`;
        const uploadTask = await this.fireStorage.upload(path, file);

        // Get image URL as Observable
        const downloadUrl$ = this.fireStorage.ref(path).getDownloadURL();

        // Subscribe to the Observable to get the actual URL
        downloadUrl$.subscribe(async (downloadUrl) => {
          const imageUrl = downloadUrl.toString(); // Convert the URL to string

          const docRef = await this.firestore.collection('products').add({
            name: this.productName,
            price: this.price,
            imageUrl: imageUrl,
            desc: this.productDesc,
          });
          const productId = docRef.id; // Capture the ID of the newly added document
          await docRef.update({ id: productId });
          this.openSnackBar('Product Added Successfully ', 'Close');
          // Clear form fields after successful submission
          this.productName = '';
          this.productDesc = '';
          this.price = undefined;
          this.imageUrl = null; // Reset imageUrl
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error, display a message to the user, etc.
        this.openSnackBar('Error submitting form: ' + error, 'Close');
      }
      this.routeToHome();
  }

  onFileSelected(event: any) {
    this.imageUrl = event.target.files[0];
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
    if( this.productName && this.productDesc && this.price &&  this.imageUrl){
      return true;
    }
    else{
      return false
    }
  }
}

// import { Component } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-add',
//   templateUrl: './add.component.html',
//   styleUrls: ['./add.component.css'],
// })
// export class AddComponent {
//   productName: string = '';
//   productDesc: string = '';
//   price: number | undefined;
//   imageUrl: File | null = null;
//   videoFile: File | null = null;

//   constructor(
//     private fireStorage: AngularFireStorage,
//     private firestore: AngularFirestore,
//     private _snackBar: MatSnackBar,
//     private router: Router
//   ) {}

//   async submitForm() {
//     try {
//       // Upload image to Firebase Storage
//       const imagePath : string = await this.uploadFile(this.imageUrl, 'productImages');

//       // Upload video to Firebase Storage
//       const videoPath  : string = await this.uploadFile(this.videoFile, 'productVideos');

//       console.log(imagePath.toString(), '\n', videoPath.toString());

//       // Save product data to Firestore
//       await this.saveProductData(imagePath.toString(), videoPath.toString());

//       // Display success message
//       this.openSnackBar('Product Added Successfully', 'Close');

//       // Clear form fields
//       this.clearFormFields();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       this.openSnackBar('Error submitting form: ' + error, 'Close');
//     }
//     this.routeToHome();
//   }

//   async uploadFile(file: File | null, folderName: string): Promise<string> {
//     if (!file) return ''; // If no file is provided, return an empty string

//     const path = `${folderName}/${file.name}`;
//     await this.fireStorage.upload(path, file);
//     const downloadUrl = await this.fireStorage.ref(path).getDownloadURL();
//     return downloadUrl.toString();
//   }

//   async saveProductData(imageUrl: string, videoUrl: string): Promise<void> {
//     // Save product data to Firestore
//     const docRef = await this.firestore.collection('products').add({
//       name: this.productName,
//       price: this.price,
//       imageUrl: imageUrl,
//       videoUrl: videoUrl,
//       desc: this.productDesc,
//     });
//     const productId = docRef.id;
//     await docRef.update({ id: productId });
//   }

//   clearFormFields() {
//     // Clear form fields after successful submission
//     this.productName = '';
//     this.productDesc = '';
//     this.price = undefined;
//     this.imageUrl = null;
//     this.videoFile = null;
//   }

//   openSnackBar(message: string, action: string) {
//     this._snackBar.open(message, action, {
//       duration: 2000,
//     });
//   }

//   routeToHome() {
//     this.router.navigate(['dashboard']);
//   }

//   isValid() {
//     return (
//       this.productName &&
//       this.productDesc &&
//       this.price &&
//       this.imageUrl &&
//       this.videoFile
//     );
//   }

//   onImageSelected(event: any) {
//     this.imageUrl = event.target.files[0];
//   }

//   onVideoSelected(event: any) {
//     this.videoFile = event.target.files[0];
//   }
// }