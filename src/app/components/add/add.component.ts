import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/loader.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  productName: string = '';
  productDesc: string = '';
  price: number | undefined;
  imageUrl: File | null = null;
  imagePreview: string | ArrayBuffer | null = '';
  selectedFile: File | null = null;
  productVideoLink: string = '';
  category: string = '';

  categories: string[] = ['Frame', 'Rasin', 'Other'];

  isLoading: boolean = false;

  constructor(
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private router: Router,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  async submitForm() {
    try {
      const file = this.imageUrl;
      const path = `productImages/${file?.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);

      const downloadUrl$ = this.fireStorage.ref(path).getDownloadURL();

      downloadUrl$.subscribe(async (downloadUrl) => {
        const imageUrl = downloadUrl.toString();

        const docRef = await this.firestore.collection('products').add({
          name: this.productName,
          price: this.price,
          imageUrl: imageUrl,
          desc: this.productDesc,
          productVideoLink: this.productVideoLink,
          category: this.category,
        });
        const productId = docRef.id;
        await docRef.update({ id: productId });
        this.openSnackBar('Product Added Successfully ', 'Close');
        this.resetForm();
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      this.openSnackBar('Error submitting form: ' + error, 'Close');
    }
    this.routeToHome();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUrl = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage() {
    // const dialogConfig = new MatDialogConfig();

    // // Set the position of the dialog
    // dialogConfig.position = {
    //   top: '250px',
    //   // right: '20px',
    // };

    // dialogConfig.data = {
    //   message: 'Are you sure you want to delete this image?',
    // };

    // const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result) {
    this.imageUrl = null;
    this.imagePreview = null;
    //   }
    // });
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
    return !!(
      this.productName &&
      this.productDesc &&
      this.price &&
      this.imageUrl &&
      this.category
    );
  }

  resetForm() {
    this.productName = '';
    this.productDesc = '';
    this.price = undefined;
    this.imageUrl = null;
    this.imagePreview = null;
    this.productVideoLink = '';
    this.category = '';
  }
}
