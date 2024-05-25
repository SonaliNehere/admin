import { Component } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Router } from '@angular/router';
// import { SendEmailService } from '../../shared/send-email.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css',
})
export class ViewOrdersComponent {
  orders: any[] = [];

  constructor(private dataService: DataService,
    private router: Router,
    // private sendEmailService: SendEmailService
  ) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    // this.dataService.getAllOrders()
    //   .then(orders => {
    //     this.orders = orders;
    //     console.log('Orders fetched:', orders);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching orders:', error);
    //   });


      this.dataService.getAllOrders().subscribe(
        (orders) => {
          this.orders = orders;
          console.log('Orders:', this.orders);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
  }


  deliverOrder(orderId: any, uid: any) {
    if (confirm('Are you sure you want to deliver this order?')) {
    this.dataService.deliveredOrder(orderId, uid)
    ?.then((res : any) => {
      console.error('Order delivered:');
    })
    .catch(error => {
      console.error('Error delivering orders:', error);
    });
  }
  }

  viewOrder(order: any) {
    this.dataService.setOrderData(order);
    this.router.navigate(['order-details']);
  }

  routeToHome(){
    this.router.navigate(['dashboard']);
  }
}
