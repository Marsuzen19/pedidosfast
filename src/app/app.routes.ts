import { Routes } from '@angular/router';
import { WelcomeComponent } from '././components/welcome/welcome';
import { MenuComponent } from '././components/menu/menu';
import { ProductDetailComponent } from '././components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { KitchenComponent } from './components/kitchen/kitchen';
import { OrderStatusComponent } from './components/order-status/order-status';
import { MyOrdersComponent } from './components/my-orders/my-orders';

export const routes: Routes = [
  // Pantalla de bienvenida y seleccion de con que rol entrar
  { path: '', component: WelcomeComponent },

  //Vista del Cliente
  { path: 'menu', component: MenuComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'estado-pedido', component: OrderStatusComponent },
  { path: 'mis-pedidos', component: MyOrdersComponent },

  //Vista de cocina
  { path: 'cocina', component: KitchenComponent },

  { path: '**', redirectTo: '' }
];