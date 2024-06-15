import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private fireStorage: AngularFireStorage,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  data: any;
  orderData: any;
  editableData: any;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setOrderData(data: any) {
    this.orderData = data;
  }

  getOrderData() {
    return this.orderData;
  }

  setEditableData(data: any) {
    this.editableData = data;
  }

  getEditableData() {
    return this.editableData;
  }

  // getAllOrders() {
  //   const uid = localStorage.getItem('uid');

  //   if (!uid) {
  //     console.error('User is not authenticated');
  //     return Promise.reject('User is not authenticated');
  //   }

  //   const cartDocRef = this.firestore.collection('orders').doc(uid);

  //   return cartDocRef
  //     .get()
  //     .toPromise()
  //     .then((doc: any) => {
  //       if (doc.exists) {
  //         console.log('doc exists');
  //         return doc.data().orders || [];
  //       } else {
  //         console.log('No orders found for this user');
  //         return [];
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching orders:', error);
  //       return Promise.reject(error);
  //     });
  // }

  getAllOrders(): Observable<any[]> {
    return this.firestore
      .collection('orders')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
        map((docs) => {
          // Combine all orders into a single array
          let allOrders: any[] = [];
          docs.forEach((doc) => {
            if (doc.orders && Array.isArray(doc.orders)) {
              const ordersWithDocId = doc.orders.map((order: any) => ({
                ...order,
                docId: doc.id,
              }));
              allOrders = allOrders.concat(ordersWithDocId);
            }
          });
          return allOrders;
        })
      );
  }

  cancelOrder(orderId: any) {
    console.log('orderId : ', orderId);
    const uid = localStorage.getItem('uid');

    const dateOfCancelled: string = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('orders').doc(uid);
    console.log('cartDocRef : ', cartDocRef);
    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        console.log('doc : ', doc);
        if (doc.exists) {
          console.log('doc exist');
          const cartData = doc.data();
          const orders = cartData.orders || [];

          // Find the order index in the orders array
          const orderIndex = orders.findIndex(
            (order: any) => order.orderId === orderId
          );

          if (orderIndex !== -1) {
            // Update the cancellation status of the order
            orders[orderIndex].product.product.isOrderCancled = true;
            // orders[orderIndex].isOrderCancled = true;
            orders[orderIndex].product.product.dateOfOrderCancled =
              dateOfCancelled;
            console.log('orders[orderIndex] : ', orders[orderIndex]);
            console.log('Order cancelled:', orderId);
          } else {
            console.log('Order not found:', orderId);
          }

          return cartDocRef.set({ orders }, { merge: true });
        } else {
          console.log('doc does not exist');
          return null;
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  }

  deliveredOrder(orderId: any, uid: any) {
    console.log('orderId : ', orderId);
    // const uid = localStorage.getItem('uid');

    const dateOfDelivered: string = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // if (!uid) {
    //   console.error('User is not authenticated');
    //   return;
    // }

    const cartDocRef = this.firestore.collection('orders').doc(uid);
    console.log('cartDocRef : ', cartDocRef);
    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        console.log('doc : ', doc);
        if (doc.exists) {
          console.log('doc exist');
          const cartData = doc.data();
          const orders = cartData.orders || [];

          // Find the order index in the orders array
          const orderIndex = orders.findIndex(
            (order: any) => order.orderId === orderId
          );

          if (orderIndex !== -1) {
            // Update the cancellation status of the order
            // orders[orderIndex].product.product.isOrderCancled = true;
            // orders[orderIndex].isOrderCancled = true;
            orders[orderIndex].product.product.dateOfOrderDelivered =
            dateOfDelivered;
            console.log('orders[orderIndex] : ', orders[orderIndex]);
            console.log('Order delivered:', orderId);
          } else {
            console.log('Order not found:', orderId);
          }

          return cartDocRef.set({ orders }, { merge: true });
        } else {
          console.log('doc does not exist');
          return null;
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  }


















}
