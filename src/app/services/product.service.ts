import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    //  HAMBURGUESAS //
    {
      id: 1,
      name: 'Hamburguesa Clásica FastOrder',
      description: 'Carne jugosa 100% de res, lechuga fresca, tomate y salsa especial.',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Lechuga', 'Tomate', 'Salsa especial'],
        addableExtras: ['Extra queso', 'Tocino crujiente', 'Huevo frito']
      }
    },
    {
      id: 2,
      name: 'Hamburguesa Doble Cheese',
      description: 'Doble porción de carne, doble queso cheddar fundido y pepinillos.',
      price: 24.00,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Pepinillos', 'Queso cheddar'],
        addableExtras: ['Doble tocino', 'Cebolla caramelizada']
      }
    },
    {
      id: 3,
      name: 'Hamburguesa BBQ Bacon',
      description: 'Carne a la parrilla, salsa BBQ ahumada, tocino crujiente y aros de cebolla.',
      price: 26.50,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Aros de cebolla', 'Salsa BBQ'],
        addableExtras: ['Extra tocino', 'Queso cheddar fundido']
      }
    },
    {
      id: 4,
      name: 'Hamburguesa Pollo Crispy',
      description: 'Pechuga de pollo empanizada y crujiente, lechuga y mayonesa de la casa.',
      price: 19.00,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Lechuga', 'Mayonesa'],
        addableExtras: ['Queso cheddar', 'Tocino']
      }
    },
    {
      id: 5,
      name: 'Hamburguesa Mega Monster (Triple)',
      description: 'Tres carnes de res, triple queso, tocino y aros de cebolla.',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Queso', 'Tocino'],
        addableExtras: ['Huevo frito', 'Pepinillos extra']
      }
    },
    {
      id: 6,
      name: 'Hamburguesa Vegetariana',
      description: 'Medallón a base de lentejas y quinua, palta fresca, tomate y lechuga.',
      price: 20.00,
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500',
      category: 'hamburguesas',
      customizableOptions: {
        removableIngredients: ['Tomate', 'Lechuga'],
        addableExtras: ['Extra palta', 'Queso fundido']
      }
    },

    // ACOMPAÑAMIENTOS //
    {
      id: 7,
      name: 'Papas Fritas Crocantes',
      description: 'Porción de papas doradas y crujientes con toque de sal.',
      price: 7.00,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500',
      category: 'acompañamientos',
      customizableOptions: {
        removableIngredients: ['Sal'],
        addableExtras: ['Salsa de la casa', 'Queso fundido']
      }
    },
    {
      id: 8,
      name: 'Aros de Cebolla Dorados',
      description: 'Aros de cebolla empanizados y fritos, acompañados de salsa ranch.',
      price: 9.00,
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500',
      category: 'acompañamientos',
      customizableOptions: {
        removableIngredients: ['Salsa ranch'],
        addableExtras: ['Salsa BBQ extra']
      }
    },
    {
      id: 9,
      name: 'Salchipapas FastOrder',
      description: 'Corte de papas fritas mezcladas con rodajas de hot dog jugoso.',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500',
      category: 'acompañamientos',
      customizableOptions: {
        removableIngredients: ['Hot dog', 'Cremas'],
        addableExtras: ['Huevo frito', 'Queso rallado']
      }
    },
    {
      id: 10,
      name: 'Tequeños de Queso (6 unidades)',
      description: 'Dedoswantán rellenos de queso fresco acompañados de salsa huancaína.',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500',
      category: 'acompañamientos',
      customizableOptions: {
        removableIngredients: ['Salsa huancaína'],
        addableExtras: ['Porción extra de salsa huancaína']
      }
    },

    // BEBIDAS //
    {
      id: 11,
      name: 'Gaseosa Helada 500ml',
      description: 'Bebida gaseosa sabor cola bien fría.',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
      category: 'bebidas',
      customizableOptions: {
        removableIngredients: ['Hielo'],
        addableExtras: ['Rodaja de limón']
      }
    },
    {
      id: 12,
      name: 'Chicha Morada Artesanal 500ml',
      description: 'Refrescante bebida tradicional a base de maíz morado, manzana y piña.',
      price: 6.00,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
      category: 'bebidas',
      customizableOptions: {
        removableIngredients: ['Hielo', 'Canela en polvo'],
        addableExtras: ['Limón extra']
      }
    },
    {
      id: 13,
      name: 'Limonada Frozen',
      description: 'Limonada granizada natural con un toque de menta.',
      price: 7.00,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
      category: 'bebidas',
      customizableOptions: {
        removableIngredients: ['Hojas de menta'],
        addableExtras: ['Azúcar adicional']
      }
    },
    {
      id: 14,
      name: 'Agua Mineral sin Gas 600ml',
      description: 'Agua purificada de mesa.',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
      category: 'bebidas',
      customizableOptions: {
        removableIngredients: [],
        addableExtras: ['Rodaja de limón']
      }
    },

    // POSTRES //
    {
      id: 15,
      name: 'Pie de Maracuyá',
      description: 'Clásico postre frío con base de galleta y crema de maracuyá agridulce.',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500',
      category: 'postres',
      customizableOptions: {
        removableIngredients: [],
        addableExtras: ['Sirope de chocolate']
      }
    },
    {
      id: 16,
      name: 'Helado de Fudge con Chocolate',
      description: 'Dos bolas de helado de vainilla cubiertas con fudge caliente y maní.',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500',
      category: 'postres',
      customizableOptions: {
        removableIngredients: ['Maní'],
        addableExtras: ['Extra fudge', 'Chispas de chocolate']
      }
    }
  ];

  constructor() {}

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}