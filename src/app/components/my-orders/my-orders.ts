import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, Order } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent implements OnInit {
  myOrders: Order[] = [];

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const history = await this.cartService.getOrderHistory();
    // Mostramos los pedidos del más reciente al más antiguo
    this.myOrders = history.reverse();
    this.cdr.detectChanges();

    //  si la cocina cambia el estado o el pago de algún pedido en tiempo real
    this.cartService.listenToChannel((data) => {
      if (data.type === 'UPDATE_ORDER') {
        const index = this.myOrders.findIndex(o => o.id === data.order.id);
        if (index !== -1) {
          this.myOrders[index] = data.order;
          this.cdr.detectChanges();
        }
      }
    });
  }

  // Método para abrir el modal de simulación de pago
  async openPaymentModal(order: Order): Promise<void> {
    if (!order.id) return;

    const { value: method } = await Swal.fire({
      title: '💳 Selecciona tu método de pago',
      input: 'select',
      inputOptions: {
        'Yape / Plin': '📱 Yape / Plin',
        'Efectivo': '💵 Efectivo al recibir',
        'Tarjeta': '💳 Tarjeta de Crédito/Débito'
      },
      inputPlaceholder: 'Elige una opción',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754'
    });

    if (method) {
      // Actualizamos en IndexedDB y enviamos por el canal de comunicación
      await this.cartService.updateOrderPayment(order.id, true, method);

      // Actualizamos localmente en la vista
      order.isPaid = true;
      order.paymentMethod = method;
      this.cdr.detectChanges();

      Swal.fire({
        title: '¡Pago Exitoso! 🎉',
        text: `Tu pedido #${order.id} ha sido cancelado con ${method}.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
}