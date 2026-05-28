import type { ShoppingListItemDto } from './shoppingListItem.dto';

export type ShoppingListDto = {
  shoppingListId?: string;
  title: string;
  date: string;
  items?: ShoppingListItemDto[];
};
