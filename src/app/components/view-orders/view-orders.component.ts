import { Component } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';
import { MediaQueryService } from '../../shared/media-query.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css',
})
export class ViewOrdersComponent {
  orders: any[] = [];
  sortedOrders: any[] = [];

  searchQuery: string = '';
  filteredOrders: any[] = [];

  isMobile!: boolean;

  constructor(
    private dataService: DataService,
    private router: Router,
    private mediaQueryService: MediaQueryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchOrders();

    this.mediaQueryService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  fetchOrders() {
    this.dataService.getAllOrders().subscribe(
      (orders) => {
        this.orders = orders;
        // this.filteredOrders = [...orders];
        console.log('Orders:', this.orders);

        this.sortedOrders = this.sortOrdersByDate(orders);
        console.log('sortedOrders : ', this.sortedOrders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // Function to sort the array
  sortOrdersByDate(
    orders: { id: number; dateOfOrdered: string }[]
  ): { id: number; dateOfOrdered: string }[] {
    return orders.sort((a, b) => {
      const dateA = new Date(a.dateOfOrdered);
      const dateB = new Date(b.dateOfOrdered);
      return dateB.getTime() - dateA.getTime(); // For descending order
    });
  }

  deliverOrder(orderId: any, uid: any) {
    // if (confirm('Are you sure you want to deliver this order?')) {
    const dialogConfig = new MatDialogConfig();

    // Set the position of the dialog
    dialogConfig.position = {
      top: '250px',
      // right: '20px',
    };

    dialogConfig.data = {
      message: 'Are you sure you want to deliver this order?',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dataService
          .deliveredOrder(orderId, uid)
          ?.then((res: any) => {
            console.log('Order delivered:');
          })
          .catch((error) => {
            console.error('Error delivering orders:', error);
          });
      }
    });
    // }
  }

  viewOrder(order: any) {
    this.dataService.setOrderData(order);
    this.router.navigate(['order-details']);
  }

  routeToHome() {
    this.router.navigate(['dashboard']);
  }

  // Function to filter products based on search query
  searchOrders() {
    this.filteredOrders = this.orders.filter((order) =>
      this.matchesSearchCriteria(order)
    );
    console.log('filteredOrders : ', this.filteredOrders);
  }

  // Function to check if a product matches the search criteria
  matchesSearchCriteria(product: any): boolean {
    const searchQueryLower = this.searchQuery.toLowerCase();
    // Check if any property of the product matches the search query
    return Object.values(product).some((value: any) =>
      value.toString().toLowerCase().includes(searchQueryLower)
    );
  }
}
