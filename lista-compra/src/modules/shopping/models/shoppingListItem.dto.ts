import type { ProductDto } from '@/modules/products/models/product.dto';

export type ShoppingListItemDto = {
  shoppingListItemId?: string;
  quantity: number;
  price: number;
  product?: ProductDto;
};
