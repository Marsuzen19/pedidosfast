export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hamburguesas' | 'bebidas' | 'acompañamientos' | 'postres';
  customizableOptions?: {
    removableIngredients: string[]; // para quitar ingredientes 
    addableExtras: string[];        // para agregar ingredientes
  };
}