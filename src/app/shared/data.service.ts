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
  cartData: any;
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

  setCartData(data: any) {
    this.cartData = data;
  }

  getCartData() {
    return this.cartData;
  }

  setEditableData(data: any) {
    this.editableData = data;
  }

  getEditableData() {
    return this.editableData;
  }

  addToCart(productId: string, quantity: number, product: any) {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('carts').doc(uid);

    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // If the cart document exists, check if the product already exists in the cart
          const cartData = doc.data();
          const products = cartData.products || []; // Initialize products array if it doesn't exist

          const existingProductIndex = products.findIndex(
            (p: any) => p.productId === productId
          );
          if (existingProductIndex !== -1) {
            // Product already exists in the cart, update the quantity
            products[existingProductIndex].quantity += quantity;
          } else {
            // Product doesn't exist in the cart, add it to the products array
            products.push({ productId, quantity, product });
          }

          // Update the cart document with the updated products array
          return cartDocRef.set({ products }, { merge: true });
        } else {
          // If the cart document doesn't exist, create it with the new product data
          return cartDocRef.set({
            products: [{ productId, quantity, product }],
          });
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  }

  getCartProducts() {
    const userId = localStorage.getItem('uid');

    if (!userId) {
      // User is not authenticated, return an empty observable or handle the error
      return new Observable<any[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    // Query the cart collection based on the user ID
    return this.firestore.collection('carts').doc(userId).valueChanges();
  }

  removeFromCart(productId: string) {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('carts').doc(uid);

    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // If the cart document exists, check if the product exists in the cart
          const cartData = doc.data();
          const products = cartData.products || []; // Initialize products array if it doesn't exist

          const updatedProducts = products.filter(
            (p: any) => p.productId !== productId
          );

          // Update the cart document with the updated products array
          return cartDocRef.set({ products: updatedProducts });
        } else {
          console.error('Cart document does not exist');
          return;
        }
      })
      .catch((error) => {
        console.error('Error removing product from cart:', error);
      });
  }

  removeProductsFromCart(productIds: string[]) {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('carts').doc(uid);

    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // If the cart document exists, check if the products exist in the cart
          const cartData = doc.data();
          const products = cartData.products || []; // Initialize products array if it doesn't exist

          // Filter out products whose IDs are in the productIds array
          const updatedProducts = products.filter(
            (p: any) => !productIds.includes(p.productId)
          );

          // Update the cart document with the updated products array
          return cartDocRef.set({ products: updatedProducts });
        } else {
          console.error('Cart document does not exist');
          return;
        }
      })
      .catch((error) => {
        console.error('Error removing products from cart:', error);
      });
  }

  emptyCart() {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('carts').doc(uid);

    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // If the cart document exists, remove all products from the cart
          return cartDocRef.set({ products: [] }); // Set products array to empty
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  }

  increaseDecreaseQuantity(productId: string, quantity: number, product: any) {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      console.error('User is not authenticated');
      return;
    }

    const cartDocRef = this.firestore.collection('carts').doc(uid);

    return cartDocRef
      .get()
      .toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // If the cart document exists, check if the product already exists in the cart
          const cartData = doc.data();
          const products = cartData.products || []; // Initialize products array if it doesn't exist

          const existingProductIndex = products.findIndex(
            (p: any) => p.productId === productId
          );
          if (existingProductIndex !== -1) {
            // Product already exists in the cart, update the quantity
            products[existingProductIndex].quantity = quantity;
          } else {
            // Product doesn't exist in the cart, add it to the products array
            console.log("Product doesn't exist in the cart");
            // products.push({ productId, quantity, product });
          }

          // Update the cart document with the updated products array
          return cartDocRef.set({ products }, { merge: true });
        } else {
          // If the cart document doesn't exist, create it with the new product data
          console.log("cart document doesn't exist");
          // return cartDocRef.set({
          //   products: [{ productId, quantity, product }],
          // });
          return null;
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  }

  // decreaseQuantity(productId: string, quantity: number, product: any) {
  //   const uid = localStorage.getItem('uid');

  //   if (!uid) {
  //     console.error('User is not authenticated');
  //     return;
  //   }

  //   const cartDocRef = this.firestore.collection('carts').doc(uid);

  //   return cartDocRef
  //     .get()
  //     .toPromise()
  //     .then((doc: any) => {
  //       if (doc.exists) {
  //         // If the cart document exists, check if the product already exists in the cart
  //         const cartData = doc.data();
  //         const products = cartData.products || []; // Initialize products array if it doesn't exist

  //         const existingProductIndex = products.findIndex(
  //           (p: any) => p.productId === productId
  //         );
  //         if (existingProductIndex !== -1) {
  //           // Product already exists in the cart, update the quantity
  //           products[existingProductIndex].quantity = quantity;
  //         } else {
  //           // Product doesn't exist in the cart, add it to the products array
  //           products.push({ productId, quantity, product });
  //         }

  //         // Update the cart document with the updated products array
  //         return cartDocRef.set({ products }, { merge: true });
  //       } else {
  //         // If the cart document doesn't exist, create it with the new product data
  //         return cartDocRef.set({
  //           products: [{ productId, quantity, product }],
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding product to cart:', error);
  //     });
  // }

  // addToOrders(
  //   orderId: any,
  //   products: any[], // array of products
  //   orderTotal: any,
  //   shippingAddress: any
  // ) {
  //   console.log('orderId : ', orderId);
  //   console.log('addToOrders');
  //   const uid = localStorage.getItem('uid');
  //   console.log('products : ', products);

  //   const dateOfOrdered: string = new Date().toLocaleString('en-US', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: true,
  //   });

  //   if (!uid) {
  //     console.error('User is not authenticated');
  //     return;
  //   }

  //   const cartDocRef = this.firestore.collection('orders').doc(uid);
  //   console.log('cartDocRef : ', cartDocRef);
  //   return cartDocRef
  //     .get()
  //     .toPromise()
  //     .then((doc: any) => {
  //       console.log('doc : ', doc);
  //       if (doc.exists) {
  //         console.log('doc exist');
  //         const cartData = doc.data();
  //         const orders = cartData.orders || [];

  //         orders.push({
  //           orderId,
  //           orderTotal,
  //           shippingAddress,
  //           dateOfOrdered,
  //           products,
  //         });

  //         return cartDocRef.set({ orders }, { merge: true });
  //       } else {
  //         console.log('doc does not exist');
  //         return cartDocRef.set({
  //           orders: [
  //             {
  //               orderId,
  //               orderTotal,
  //               shippingAddress,
  //               dateOfOrdered,
  //               products,
  //             },
  //           ],
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding product to cart:', error);
  //     });
  // }

  addToOrders(
    products: any[], // array of products
    orderTotal: any,
    shippingAddress: any
  ) {
    console.log('addToOrders');
    const uid = localStorage.getItem('uid');
    console.log('products : ', products);

    const dateOfOrdered: string = new Date().toLocaleString('en-US', {
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

          for (const product of products) {
            const orderId = product.orderId;
            delete product.orderId;
            console.log('product after remove orderId : ', product);
            orders.push({
              orderId,
              shippingAddress,
              dateOfOrdered,
              product,
            });
          }

          return cartDocRef.set({ orders }, { merge: true });
        } else {
          console.log('doc does not exist');
          let orders: any[] = [];
          for (const product of products) {
            const orderId = product.orderId;
            delete product.orderId;
            console.log('product after remove orderId : ', product);
            orders.push({
              orderId,
              shippingAddress,
              dateOfOrdered,
              product,
            });
          }
          return cartDocRef.set({ orders: orders }, { merge: true });
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
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
