import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
    this.loadCart(); // Recargar totales
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  sendOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // envio notificacion a cocina
    alert('¡Pedido enviado a la cocina con éxito! 🍔👨‍🍳');
    this.cartService.clearCart();
    this.router.navigate(['/']); // Regresar al menu principal
  }
}