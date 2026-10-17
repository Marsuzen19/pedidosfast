import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;

  // Control de personalización
  removedIngredients: { [key: string]: boolean } = {};
  addedExtras: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const productId = +idParam;
      this.product = this.productService.getProductById(productId);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/menu']);
  }

  async addToCart(): Promise<void> {
    if (!this.product) return;

    // Filtrar los ingredientes que el usuario marcó para quitar
    const removed = Object.keys(this.removedIngredients).filter(key => this.removedIngredients[key]);
    
    // Filtrar los extras que el usuario marcó para agregar
    const added = Object.keys(this.addedExtras).filter(key => this.addedExtras[key]);

    // Calcular precio total del ítem 
    const itemTotal = this.product.price * this.quantity;

    // Crear el ítem del carrito
    const cartItem = {
      product: this.product,
      quantity: this.quantity,
      removedIngredients: removed,
      addedExtras: added,
      totalItemPrice: itemTotal
    };

    // Guardar en el carrito (IndexedDB)
    await this.cartService.addToCart(cartItem);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `¡${this.product.name} agregado!`,
      showConfirmButton: false,
      timer: 1200,
      timerProgressBar: true
    });

    // Redirigir al carrito
    this.router.navigate(['/carrito']);
  }
}