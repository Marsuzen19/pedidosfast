import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, Order } from '../../services/cart.service';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-status.html',
  styleUrls: ['./order-status.css']
})
export class OrderStatusComponent implements OnInit {
  latestOrder: Order | null = null;

  constructor(private cartService: CartService) {}

  async ngOnInit(): Promise<void> {
    await this.loadLatestOrder();

    // Escuchar actualizaciones en tiempo real enviadas por la cocina
    this.cartService.listenToChannel((data) => {
      if (data.type === 'UPDATE_ORDER' && this.latestOrder && data.order.id === this.latestOrder.id) {
        this.latestOrder = data.order;
      }
    });
  }

  async loadLatestOrder(): Promise<void> {
    const history = await this.cartService.getOrderHistory();
    if (history.length > 0) {
      // Tomamos el pedido más reciente
      this.latestOrder = history[history.length - 1];
    }
  }
}