import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  template: `<router-outlet></router-outlet>`,
})
export class App implements OnInit {
  protected readonly title = signal('fast-order-pwa');

  ngOnInit() {
    
    window.addEventListener('online', () => this.showNetworkStatus(true));
    window.addEventListener('offline', () => this.showNetworkStatus(false));
  }

  showNetworkStatus(isOnline: boolean) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isOnline ? 'success' : 'warning',
      title: isOnline ? '¡Conexión restaurada! Estás en línea.' : 'Sin conexión. Modo offline activado.',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true
    });
  }
}