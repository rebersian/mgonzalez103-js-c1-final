import apiClient from '@/api/apiClient';
import type { ShoppingListDto } from '../models/shoppingList.dto';
import type { ShoppingListItemDto } from '../models/shoppingListItem.dto';
import type { ShoppingListDeleteDto } from '../models/shoppingList.delete.dto';
import type { ShoppingListUpdateDto } from '../models/shoppingList.update.dto';
import type { ShoppingListItemDeleteDto } from '../models/shoppingListItem.delete.dto';

export async function getShoppingLists() {
  const response = await apiClient.get<ShoppingListDto[]>('/shopping-lists');

  if (response.status !== 200) {
    throw new Error('Error al obtener las listas de la compra');
  }

  return {
    shoppingLists: response.data,
  };
}

export async function getShoppingList(shoppingListId: string) {
  const response = await apiClient.get<ShoppingListDto>(`/shopping-lists/${shoppingListId}`);

  if (response.status !== 200) {
    throw new Error('Error al obtener la lista seleccionada');
  }

  return {
    shoppingList: response.data,
  };
}

export async function addShoppingList(shopList: ShoppingListDto) {
  const response = await apiClient.post<ShoppingListDto>('/shopping-lists', shopList);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error al añadir la lista de la compra');
  }

  return {
    shoppingList: response.data,
  };
}

export async function updateShoppingList(shoppingListId: string, shopList: ShoppingListUpdateDto) {
  const response = await apiClient.patch<ShoppingListUpdateDto>(
    `/shopping-lists/${shoppingListId}`,
    shopList
  );

  if (response.status !== 200) {
    throw new Error('Error al actualizar la lista.');
  }

  return {
    shoppingList: response.data,
  };
}

export async function deleteShoppingList(shoppingListId: string) {
  const response = await apiClient.delete<ShoppingListDeleteDto>(
    `/shopping-lists/${shoppingListId}`
  );

  if (response.status !== 200 || !response.data.deleted) {
    throw new Error('Error al eliminar el producto');
  }

  return {
    shoppingList: response.data,
  };
}

export async function addItemShoppingList(
  shoppingListId: string,
  shoppingListItemDto: ShoppingListItemDto
) {
  const response = await apiClient.post<ShoppingListDto>(
    `/shopping-lists/${shoppingListId}/items`,
    shoppingListItemDto
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error al añadir la lista de la compra');
  }

  return {
    shoppingList: response.data,
  };
}

export async function deleteItemShoppingList(shoppingListId: string, shoppingListItemId: string) {
  const response = await apiClient.delete<ShoppingListItemDeleteDto>(
    `/shopping-lists/${shoppingListId}/items/${shoppingListItemId}`
  );

  if (response.status !== 200 || !response.data.deleted) {
    throw new Error('Error al añadir la lista de la compra');
  }

  return {
    shoppingList: response.data,
  };
}
