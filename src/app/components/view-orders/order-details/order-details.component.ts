import { Component } from '@angular/core';
import { DataService } from '../../../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  data: any;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  priceData: any = [];

  constructor(private dataService: DataService, private router: Router) {
    this.data = this.dataService.getOrderData();
    console.log('data : ', this.data);
    this.priceData.push(this.data.product.product);
    console.log('priceData : ', this.priceData);
  }

  cancelOrder(orderId: any) {
    this.dataService
      .cancelOrder(orderId)
      ?.then((res: any) => {
        console.log('order cancelled');
      })
      .catch((error) => {
        console.error('Error canceling orders:', error);
      });
  }

  openProduct(item: any): void {
    this.dataService.setData(item);
    this.router.navigate(['product']);
  }

  routeToHome() {
    this.router.navigate(['dashboard']);
  }
}
