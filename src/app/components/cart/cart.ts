import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import Swal from 'sweetalert2';

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
  successMessage: string = ''; 
  errorMessage: string = '';

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

  async removeItem(index: number): Promise<void> {
    await this.cartService.removeFromCart(index);
    this.loadCart();
  }

  async clearCart(): Promise<void> {
    await this.cartService.clearCart();
    this.loadCart();
  }

  async sendOrder(): Promise<void> {
    if (this.cartItems.length === 0) {
      Swal.fire('Atención', 'Tu carrito está vacío.', 'warning');
      return;
    }

    // Envía el pedido a IndexedDB (historial) y avisa en tiempo real a la cocina
    const order = await this.cartService.sendOrderToKitchen();
    
   if (order) {
      Swal.fire({
        title: '¡Enviado a Cocina! 🍔',
        text: 'Tu pedido está siendo procesado.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/estado-pedido']);
      });
    }
  }
}