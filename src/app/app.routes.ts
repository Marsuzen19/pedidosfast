import { Routes } from '@angular/router';
import { MenuComponent } from '././components/menu/menu';
import { ProductDetailComponent } from '././components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartComponent },
  { path: '**', redirectTo: '' }
];