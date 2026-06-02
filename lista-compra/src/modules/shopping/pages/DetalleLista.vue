<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {
  getShoppingList,
  updateShoppingList,
  addItemShoppingList,
  deleteItemShoppingList,
} from '../services/shopping.service';
import { getProducts } from '@/modules/products/services/products.service';
import type { ShoppingListDto } from '../models/shoppingList.dto';
import type { ShoppingListUpdateDto } from '../models/shoppingList.update.dto';
import type { ProductDto } from '@/modules/products/models/product.dto';
import { useToast } from '@/common/composables/useToast';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const shoppingListId = route.params.shoppingListId as string;

const shopList = ref<ShoppingListDto>({
  shoppingListId: '',
  title: '',
  date: '',
  items: [],
});

const productos = ref<ProductDto[]>([]);

// redireccion a listas compra
const goListas = () => {
  router.push({
    name: 'listaCompra',
  });
};

// calculo de items totales
const totalItems = computed<number>(() => shopList.value?.items?.length ?? 0);

// calculo de importe total
const totalImporte = computed<number>(
  () => shopList.value.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0
);

// Carga inicial de datos de la pantalla
const cargarDatos = async () => {
  try {
    const [listaRes, productosRes] = await Promise.all([
      getShoppingList(shoppingListId),
      getProducts(),
    ]);
    // lista de la compra seleccionada
    shopList.value = listaRes.shoppingList;
    // combo productos
    productos.value = productosRes.productsList;
    // valores de la lista
    setValues({
      title: listaRes.shoppingList.title,
      date: listaRes.shoppingList.date,
    });
  } catch (err) {
    toast.error(`Error al cargar los datos: ${(err as Error).message}`, 3000);
    goListas();
  }
};

// esquema para la validación de campos previo al update de la lista
const updateSchema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .required('La fecha es obligatoria'),
});

// Gestión y validación del estado del formulario lista
const { handleSubmit, defineField, errors, meta, setValues } = useForm<ShoppingListDto>({
  validationSchema: updateSchema,
  initialValues: {
    title: '',
    date: '',
  },
});

const [title, titleAttrs] = defineField('title');
const [date, dateAttrs] = defineField('date');

// update lista
const actualizarLista = handleSubmit(async (values) => {
  try {
    const listaUpdate: ShoppingListUpdateDto = {
      title: values.title,
      date: values.date,
    };
    await updateShoppingList(shoppingListId, listaUpdate);

    shopList.value.title = values.title;
    shopList.value.date = values.date;

    toast.success('Lista actualizada correctamente.');
  } catch (err) {
    toast.error(`Error al actualizar la lista: ${(err as Error).message}`, 3000);
  }
});

// esquema para la validación de campos previo al insert de producto
const itemSchema = yup.object({
  productId: yup.string().trim().required('Se ha de seleccionar el producto'),
  quantity: yup
    .number()
    .required('La cantidad es obligatoria')
    .min(1, 'La cantidad debe ser mayor que 0'),

  price: yup
    .number()
    .required('El precio es obligatorio')
    .min(0, 'El precio no puede ser negativo'),
});

type ItemForm = {
  productId: string;
  quantity: number;
  price: number;
};

// Gestión y validación del estado del formulario insert producto
const {
  handleSubmit: handleSubmitItem,
  defineField: defineItemField,
  errors: itemErrors,
  resetForm: resetItemForm,
  meta: itemMeta,
} = useForm<ItemForm>({
  validationSchema: itemSchema,
  initialValues: {
    productId: '',
    quantity: 1,
    price: 0,
  },
});

const [productId, productIdAttrs] = defineItemField('productId');
const [quantity, quantityAttrs] = defineItemField('quantity');
const [price, priceAttrs] = defineItemField('price');

// add producto a la lista
const anadirItem = handleSubmitItem(async (values) => {
  try {
    const productoSeleccionado = productos.value.find((x) => x.productId === values.productId);

    if (!productoSeleccionado) {
      toast.warning('Producto no válido.');
      return;
    }
    await addItemShoppingList(shoppingListId, values);

    toast.success('Producto añadido correctamente.');

    resetItemForm();
    // recarga de datos
    await cargarDatos();
  } catch (err) {
    toast.error(`Error al añadir el producto: ${(err as Error).message}`, 3000);
  }
});

// delete de producto de la lista
const eliminarItem = async (shoppingListItemId: string) => {
  try {
    await deleteItemShoppingList(shoppingListId, shoppingListItemId);

    toast.success('Producto eliminado correctamente.');
    // recarga de datos
    await cargarDatos();
  } catch (err) {
    toast.error(`Error al eliminar el producto: ${(err as Error).message}`, 3000);
  }
};

// carga de pantalla
onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <div class="bg-light min-vh-100">
    <section class="py-2">
      <div class="container">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div class="col-lg-6 p-0">
            <p class="text-primary fw-semibold small mb-2">🛒 Listas</p>
            <h1 class="display-5 fw-bold mb-3">Detalle de la lista</h1>
            <p class="lead text-secondary mb-4">
              Edita la lista y gestiona sus productos asociados.
            </p>
          </div>
          <RouterLink :to="{ name: 'listaCompra' }" class="btn btn-outline-secondary">
            ← Volver a las listas
          </RouterLink>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div>
                <small class="text-secondary"> ID: {{ shoppingListId }} </small>
                <h3 class="fw-bold mb-0 mt-1">
                  {{ shopList?.title }}
                </h3>
              </div>
              <div class="d-flex gap-2">
                <span class="badge bg-primary"> Items: {{ totalItems }} </span>
                <span class="badge bg-secondary"> Importe: {{ totalImporte.toFixed(2) }} € </span>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-7">
                <label class="form-label fw-semibold"> Título </label>
                <input v-model="title" v-bind="titleAttrs" type="text" class="form-control" />
                <small class="text-danger">
                  {{ errors.title }}
                </small>
              </div>
              <div class="col-md-5">
                <label class="form-label fw-semibold"> Fecha </label>
                <input v-model="date" v-bind="dateAttrs" type="date" class="form-control" />
                <small class="text-danger">
                  {{ errors.date }}
                </small>
              </div>
            </div>
            <button
              class="btn btn-primary mt-4 px-4"
              :disabled="!meta.valid"
              @click="actualizarLista"
            >
              Guardar cambios
            </button>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4">Añadir producto a la lista</h4>
            <div class="row g-3 align-items-start">
              <div class="col-md-6">
                <label class="form-label fw-semibold"> Producto </label>
                <select v-model="productId" v-bind="productIdAttrs" class="form-select">
                  <option value="">Selecciona un producto</option>
                  <option
                    v-for="product in productos"
                    :key="product.productId"
                    :value="product.productId"
                  >
                    {{ product.name }}
                  </option>
                </select>
                <small class="text-danger">
                  {{ itemErrors.productId }}
                </small>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold"> Cantidad </label>
                <input
                  v-model.number="quantity"
                  v-bind="quantityAttrs"
                  type="number"
                  min="1"
                  class="form-control"
                />
                <small class="text-danger">
                  {{ itemErrors.quantity }}
                </small>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold"> Precio </label>
                <input
                  v-model.number="price"
                  v-bind="priceAttrs"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                />
                <small class="text-danger">
                  {{ itemErrors.price }}
                </small>
              </div>
            </div>
            <div class="col-md-3">
              <button
                class="btn btn-primary mt-4 px-4"
                :disabled="!itemMeta.valid"
                @click="anadirItem"
              >
                Añadir ítem
              </button>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-4">Ítems de la lista</h4>
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Unidad</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th class="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in shopList.items" :key="item.shoppingListItemId">
                    <td>
                      <div class="fw-semibold">
                        {{ item.product?.name }}
                      </div>
                    </td>
                    <td>
                      {{ item.product?.unit }}
                    </td>
                    <td>
                      {{ Math.trunc(item.quantity) }}
                    </td>
                    <td>{{ item.price }} €</td>
                    <td class="fw-semibold">{{ (item.price * item.quantity).toFixed(2) }} €</td>
                    <td class="text-end">
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="eliminarItem(item.shoppingListItemId!)"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                  <tr v-if="shopList.items?.length === 0">
                    <td colspan="6" class="text-center py-4 text-secondary">
                      No hay productos en la lista.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
