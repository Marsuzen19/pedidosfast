import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  removedIngredients: string[];
  addedExtras: string[];
  totalItemPrice: number;
}