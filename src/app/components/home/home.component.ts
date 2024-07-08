import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { EditComponent } from '../edit/edit.component';
import { AddComponent } from '../add/add.component';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileComponent } from '../profile/profile.component';
import { LoaderService } from '../../shared/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MediaQueryService } from '../../shared/media-query.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  // products$: Observable<any[]>;

  // Define variables for search functionality
  searchQuery: string = '';
  filteredProducts: any[] = [];

  productId: string = '';
  productName: string = '';
  productDesc: string = '';
  price: number | undefined;
  imageUrl: File | null = null;
  products: any[] = [];

  email: any;
  password: any;

  selectedFile: File | null = null;

  cartLength = 0;
  orderLength = 0;

  isLoading: boolean = false;
  isMobile!: boolean;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private auth: AuthService,

    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private router: Router,
    private _snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private messaging: AngularFireMessaging,
    private mediaQueryService: MediaQueryService
  ) {
    this.fetchOrders();
    // this.router.navigate(['dashboard']);
    // this.playAudio();
    this.email = localStorage.getItem('email');
    console.log('user : ', this.email);

    // Retrieve products from Firestore
    // this.products$ = this.firestore.collection('products').valueChanges();
  }

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.password = localStorage.getItem('password');
    console.log('email : ', this.email);
    console.log('password : ', this.password);

    // Retrieve product details from Firebase Firestore
    this.isLoading = this.loaderService.show();
    this.firestore
      .collection('products')
      .valueChanges()
      .subscribe((products) => {
        this.products = products;
        this.filteredProducts = [...products]; // Initialize filtered products with all products
        this.isLoading = this.loaderService.hide();
      });

    this.mediaQueryService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  playAudio() {
    const audio = new Audio('/assets/notification.mp3');
    audio.play();
    console.log('audio played');
  }

  openProduct(item: any): void {
    this.dataService.setData(item);
    this.router.navigate(['product']);
  }

  logout() {
    this.auth.logout();
  }

  addProduct() {
    this.router.navigate(['add-product']);
  }

  editProduct(product: any) {
    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog
    dialogConfig.position = {
      top: '250px',
      // right: '20px',
    };

    dialogConfig.data = {
      message: 'Are you sure you want to update this product?',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.setEditableData(product);
        this.router.navigate(['edit-product']);
      }
    });
  }

  deleteProduct(productId: string, imageUrl: string) {
    console.log('productId : ', productId);
    // if (confirm('Are you sure you want to delete this product?')) {
    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog
    dialogConfig.position = {
      top: '250px',
      // right: '20px',
    };

    dialogConfig.data = {
      message: 'Are you sure you want to delete this product?',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Delete the product from Firestore
        console.log(this.firestore.collection('products').doc(productId));
        this.firestore
          .collection('products')
          .doc(productId)
          .delete()
          .then(() => {
            console.log('Product deleted successfully');
            this.openSnackBar('Product Deleted Successfully ', 'Close');
          })
          .catch((error) => {
            console.error('Error deleting product:', error);
            this.openSnackBar('Error deleting product: ' + error, 'Close');
          });

        // Delete the image from Firebase Storage
        this.fireStorage
          .refFromURL(imageUrl)
          .delete()
          .pipe(finalize(() => console.log('Image deleted successfully')))
          .subscribe({
            next: () => console.log('Image deletion completed'),
            error: (err) => console.error('Error deleting image:', err),
          });
      }
    });
    // }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Specify the duration in milliseconds
    });
  }

  // Function to filter products based on search query
  searchProducts() {
    this.filteredProducts = this.products.filter((product) =>
      this.matchesSearchCriteria(product)
    );
  }

  // Function to check if a product matches the search criteria
  matchesSearchCriteria(product: any): boolean {
    const searchQueryLower = this.searchQuery.toLowerCase();
    // Check if any property of the product matches the search query
    return Object.values(product).some((value: any) =>
      value.toString().toLowerCase().includes(searchQueryLower)
    );
  }

  openProfile() {
    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog
    dialogConfig.position = {
      top: '50px', // Adjust top position as needed
      right: '50px', // Adjust left position as needed
    };

    //  // Pass data to the dialog
    //  dialogConfig.data = {
    //   // Your data object here
    //   data: 'product',
    // };

    // // Open the dialog with the specified configuration
    const dialogRef = this.dialog.open(ProfileComponent, dialogConfig);
  }

  fetchOrders() {
    this.dataService.getAllOrders().subscribe(
      (orders) => {
        let pendingOrdersLength = orders.length;
        // this.orders = orders;
        console.log('Orders:', orders);
        console.log('all orders length : ', orders.length);
        for (const order of orders) {
          if (order.product.product.isOrderCancled) {
            pendingOrdersLength--;
          }
          // console.log("isOrderCancled : ", order.product.product.isOrderCancled);
          if (order.product.product.dateOfOrderDelivered) {
            pendingOrdersLength--;
          }
        }
        this.orderLength = pendingOrdersLength;
        console.log('pending orders length : ', pendingOrdersLength);
        this.playAudio();
        // const audio = new Audio('/assets/mixkit-urgent-simple-tone-loop-2976.wav');
        // audio.play();
        // console.log('audio played');
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  myOrders() {
    this.router.navigate(['orders']);
    // this.dialogRef.close();
  }
}
