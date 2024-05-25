import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// import { UserFormComponent } from '../user-form/user-form.component';
import { DataService } from '../../../shared/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  data: any;

  constructor(
    private dataService: DataService,
    // private dialog: MatDialog,
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.data = this.dataService.getData();
  }

  openForm(data: any) {
    console.log('data : ', data);
    data.isOrderCancled = false;
    console.log("data : ", data);
    // const dialogRef = this.dialog.open(UserFormComponent, {
    //   width: '350px',
    //   height: '350px',
    //   data: data,
    // });
    this.dataService.setCartData(data);
    this.router.navigate(['user-form']);
  }

  addToCart(quantity: any): void {
    const productId = this.data.id; // Replace with actual product ID
    this.data.isOrderCancled = false;
    console.log("data : ", this.data);

    this.dataService.addToCart(productId, quantity, this.data)
      ?.then(() => {
        console.log('Product added to cart');
        this.openSnackBar('Product added to cart ', 'Close');
      })
      .catch((error: any) => {
        console.error('Error adding product to cart:', error);
        this.openSnackBar('Error adding product to cart: ' + error, 'Close');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Specify the duration in milliseconds
    });
  }
}
