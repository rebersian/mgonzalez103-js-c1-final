import apiClient from '@/api/apiClient';
import type { ProductDto } from '../models/product.dto';
import type { ProductUpdateDto } from '../models/product.update.dto';
import type { ProductDeleteDto } from '../models/product.delete.dto';

export async function getUnits() {
  const response = await apiClient.get<string[]>('/products/units');

  if (response.status !== 200) {
    throw new Error('Error al obtener las unidades');
  }

  return {
    unitsList: response.data,
  };
}
export async function getProducts() {
  const response = await apiClient.get<ProductDto[]>('/products');

  if (response.status !== 200) {
    throw new Error('Error al obtener las unidades');
  }

  return {
    productsList: response.data,
  };
}
export async function addProduct(prodDto: ProductDto) {
  const response = await apiClient.post<ProductDto>('/products', prodDto);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error al añadir el producto');
  }

  return {
    product: response.data,
  };
}

export async function getProduct(id: string) {
  const response = await apiClient.get<ProductDto>(`/products/${id}`);

  if (response.status !== 200) {
    throw new Error('Error al obtener el producto');
  }

  return {
    product: response.data,
  };
}

export async function updateProduct(prodDto: ProductUpdateDto, id: string) {
  const response = await apiClient.patch<ProductUpdateDto>(`/products/${id}`, prodDto);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error al actualizar el producto');
  }

  return {
    product: response.data,
  };
}

export async function deleteProduct(id: string) {
  const response = await apiClient.delete<ProductDeleteDto>(`/products/${id}`);

  if (response.status !== 200 || !response.data.deleted) {
    throw new Error('Error al eliminar el producto');
  }

  return {
    product: response.data,
  };
}
