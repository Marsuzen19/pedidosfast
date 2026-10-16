import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  constructor() {
    // Cargar carrito guardado previamente si existe
    const savedCart = localStorage.getItem('fastorder_cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
      } catch (e) {
        this.cartItems = [];
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('fastorder_cart', JSON.stringify(this.cartItems));
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  addToCart(item: CartItem): void {
    this.cartItems.push(item);
    this.saveToLocalStorage();
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('fastorder_cart');
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
  }
}