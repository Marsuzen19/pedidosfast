import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})

//el nombre que luego se va a usar para importarlo en routes
export class MenuComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'todos';
  cartItemCount: number = 0;

  //inyeccion de servicios
  constructor(
    private productService: ProductService,
    private cartService: CartService
    ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.filteredProducts = this.products;
    this.updateCartCount();
  }

  // Actualizar la cantidad de elementos en el carrito
  updateCartCount(): void {
    const items = this.cartService.getCartItems();
    this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  }

  filterCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'todos') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  // Cada vez que la vista vuelve al menú, actualizamos el contador
  ionViewWillEnter(): void {
    this.updateCartCount();
  }
}