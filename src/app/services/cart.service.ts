import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

export interface Order {
  id?: number;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pendiente 🕒' | 'En preparación 🍳' | 'Listo para entregar 🛵';
  deliveryTime?: string; 
  isPaid: boolean;
  paymentMethod?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private dbName = 'FastOrderDB';
  private cartStore = 'cart_store';
  private historyStore = 'orders_history';
  private dbVersion = 2;
  private cartItems: CartItem[] = [];
  private dbReady: Promise<IDBDatabase>;
  
  private channel = new BroadcastChannel('fastorder_kitchen_channel');

  constructor() {
    this.dbReady = this.initDB();
    this.loadCartFromDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;
        if (!db.objectStoreNames.contains(this.cartStore)) {
          db.createObjectStore(this.cartStore, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(this.historyStore)) {
          db.createObjectStore(this.historyStore, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  private async loadCartFromDB(): Promise<void> {
    try {
      const db = await this.dbReady;
      const transaction = db.transaction(this.cartStore, 'readonly');
      const store = transaction.objectStore(this.cartStore);
      const request = store.getAll();

      request.onsuccess = () => {
        this.cartItems = request.result || [];
      };
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  }

  private async saveToDB(): Promise<void> {
    const db = await this.dbReady;
    const transaction = db.transaction(this.cartStore, 'readwrite');
    const store = transaction.objectStore(this.cartStore);
    store.clear();
    this.cartItems.forEach(item => store.add(item));
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  async addToCart(item: CartItem): Promise<void> {
    this.cartItems.push(item);
    await this.saveToDB();
  }

  async removeFromCart(index: number): Promise<void> {
    this.cartItems.splice(index, 1);
    await this.saveToDB();
  }

  async clearCart(): Promise<void> {
    this.cartItems = [];
    try {
      const db = await this.dbReady;
      const transaction = db.transaction(this.cartStore, 'readwrite');
      const store = transaction.objectStore(this.cartStore);
      store.clear();
    } catch (error) {
      console.error('Error al limpiar IndexedDB:', error);
    }
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  }

  // Enviar pedido nuevo
  async sendOrderToKitchen(): Promise<Order | null> {
    if (this.cartItems.length === 0) return null;

    const newOrder: Order = {
      items: [...this.cartItems],
      total: this.getTotalAmount(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pendiente 🕒',
      deliveryTime: 'Por definir',
      isPaid: false,
      paymentMethod: 'Por definir'
    };

    const db = await this.dbReady;
    
    return new Promise((resolve) => {
      const transaction = db.transaction(this.historyStore, 'readwrite');
      const store = transaction.objectStore(this.historyStore);
      const request = store.add(newOrder);

      request.onsuccess = async () => {
        // Asignamos el ID autogenerado por IndexedDB
        newOrder.id = request.result as number;
        await this.clearCart();

        // Notificar en tiempo real
        this.channel.postMessage({ type: 'NEW_ORDER', order: newOrder });
        resolve(newOrder);
      };
    });
  }

  // Obtener historial de pedidos
  async getOrderHistory(): Promise<Order[]> {
    const db = await this.dbReady;
    return new Promise((resolve) => {
      const transaction = db.transaction(this.historyStore, 'readonly');
      const store = transaction.objectStore(this.historyStore);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  // Actualizar estado o tiempo de entrega desde la cocina
  async updateOrderStatus(orderId: number, status: Order['status'], deliveryTime: string): Promise<void> {
    const db = await this.dbReady;
    const transaction = db.transaction(this.historyStore, 'readwrite');
    const store = transaction.objectStore(this.historyStore);

    const request = store.get(orderId);
    request.onsuccess = async () => {
      const order: Order = request.result;
      if (order) {
        order.status = status;
        order.deliveryTime = deliveryTime;
        store.put(order);

        // Notificar cambio de estado en tiempo real a las pestañas del cliente
        this.channel.postMessage({ type: 'UPDATE_ORDER', order });
      }
    };
  }

  // Actualizar el estado de pago de un pedido
  async updateOrderPayment(orderId: number, isPaid: boolean, paymentMethod: string): Promise<void> {
    const db = await this.dbReady;
    const transaction = db.transaction(this.historyStore, 'readwrite');
    const store = transaction.objectStore(this.historyStore);

    const request = store.get(orderId);
    request.onsuccess = async () => {
      const order: Order = request.result;
      if (order) {
        order.isPaid = isPaid;
        order.paymentMethod = paymentMethod;
        store.put(order);

        // Notificar el cambio de pago en tiempo real
        this.channel.postMessage({ type: 'UPDATE_ORDER', order });
      }
    };
  }

  // Escuchar eventos en tiempo real
  listenToChannel(callback: (data: { type: string; order: Order }) => void): void {
    this.channel.onmessage = (event) => {
      if (event.data) {
        callback(event.data);
      }
    };
  }
}