import { Component } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css',
})
export class ViewOrdersComponent {
  orders: any[] = [];

  searchQuery: string = '';
  filteredOrders: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.dataService.getAllOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        console.log('Orders:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  deliverOrder(orderId: any, uid: any) {
    if (confirm('Are you sure you want to deliver this order?')) {
      this.dataService
        .deliveredOrder(orderId, uid)
        ?.then((res: any) => {
          console.log('Order delivered:');
        })
        .catch((error) => {
          console.error('Error delivering orders:', error);
        });
    }
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
    console.log("filteredOrders : ", this.filteredOrders);

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
