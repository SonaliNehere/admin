import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { AuthService } from '../../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { EditComponent } from '../edit/edit.component';
import { AddComponent } from '../add/add.component';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileComponent } from '../profile/profile.component';
import { LoaderService } from '../../shared/loader.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  products$: Observable<any[]>;

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

  isLoading: boolean = false;
  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private auth: AuthService,

    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private router: Router,
    private _snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {
    this.email = localStorage.getItem('email');
    console.log('user : ', this.email);

    // Retrieve products from Firestore
    this.products$ = this.firestore.collection('products').valueChanges();
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
      });

    //cart lenght
    this.dataService.getCartProducts().subscribe((res: any) => {
      console.log('Products : ', res.products);
      this.cartLength = res.products.length;
      console.log('cartLength : ', this.cartLength);
      
    });
    this.isLoading = this.loaderService.hide();

  }

  openProduct(item: any): void {
    // const dialogRef = this.dialog.open(ProductComponent, {
    //   width: '600px',
    //   height: '400px',
    //   data: item,
    // });
    this.dataService.setData(item);
    this.router.navigate(['product']);
  }

  logout() {
    this.auth.logout();
  }

  addProduct() {
    // const dialogRef = this.dialog.open(AddComponent);
    this.router.navigate(['add-product']);
  }

  editProduct(product: any) {
    // const dialogRef = this.dialog.open(EditComponent, {
    //   data: product,
    // });
    this.dataService.setEditableData(product);
    this.router.navigate(['edit-product']);
  }

  deleteProduct(productId: string, imageUrl: string) {
    console.log('productId : ', productId);
    if (confirm('Are you sure you want to delete this product?')) {
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
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Specify the duration in milliseconds
    });
  }

  // Function to filter products based on search query
  // searchProducts() {
  //   this.filteredProducts = this.products.filter(product =>
  //     product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

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

  openCart() {
    this.router.navigate(['cart']);
  }
}
