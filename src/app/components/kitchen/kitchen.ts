import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, Order } from '../../services/cart.service';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './kitchen.html',
  styleUrls: ['./kitchen.css']
})
export class KitchenComponent implements OnInit {
  liveOrders: Order[] = [];

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  async ngOnInit(): Promise<void> {
    // Cargamos el historial de IndexedDB al iniciar
    const history = await this.cartService.getOrderHistory();
    // Invertimos el array para que los más recientes aparezcan arriba
    this.liveOrders = history.reverse();
    this.cdr.detectChanges(); 

    // Escuchar eventos en tiempo real
    this.cartService.listenToChannel((data) => {
      if (data.type === 'NEW_ORDER') {
        // Evitamos duplicados verificando si ya existe por ID
        const exists = this.liveOrders.some(o => o.id === data.order.id);
        if (!exists) {
          this.liveOrders.unshift(data.order);
          this.cdr.detectChanges();
        }
      } else if (data.type === 'UPDATE_ORDER') {
        // Si se actualizó desde otra pestaña, refrescamos el estado localmente
        const index = this.liveOrders.findIndex(o => o.id === data.order.id);
        if (index !== -1) {
          this.liveOrders[index] = data.order;
          this.cdr.detectChanges();
        }
      }
    });
  }

  // Función para que la cocina actualice el estado y el tiempo de entrega
  async updateOrder(order: Order, newStatus: Order['status'], deliveryTimeInput: string): Promise<void> {
    if (!order.id) return;

    const timeText = deliveryTimeInput ? `${deliveryTimeInput} min` : (order.deliveryTime || '15 min');
    
    // Actualizar en el servicio 
    await this.cartService.updateOrderStatus(order.id, newStatus, timeText);
    
    // Actualizar localmente en pantalla
    order.status = newStatus;
    order.deliveryTime = timeText;
    this.cdr.detectChanges();
  }
}