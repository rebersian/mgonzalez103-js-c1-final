<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { getProduct, getUnits, updateProduct, deleteProduct } from '../services/products.service';
import type { ProductUpdateDto } from '../models/product.update.dto';
import type { ProductDto } from '../models/product.dto';
import { useToast } from '@/common/composables/useToast';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const productId = route.params.productId as string;

const units = ref<string[]>([]);

// redireccion a lista de productos
const goListaProductos = () => {
  router.push({
    name: 'productos',
  });
};

// Carga inicial de datos de la pantalla
const cargarDatos = async () => {
  try {
    const [productRes, unitsRes] = await Promise.all([getProduct(productId), getUnits()]);
    // combo unidades
    units.value = unitsRes.unitsList;
    // valores del producto
    setValues({
      name: productRes.product.name,
      unit: productRes.product.unit,
      description: productRes.product.description,
    });
  } catch (err) {
    toast.error(`Error al cargar los datos: ${(err as Error).message}`, 3000);
    goListaProductos();
  }
};

// esquema para la validación de campos previo al update
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  unit: yup.string().required('Se ha de seleccionar la unidad'),
  description: yup.string().nullable(),
});

// Gestión y validación del estado del formulario
const { handleSubmit, defineField, errors, meta, setValues } = useForm<ProductDto>({
  validationSchema: schema,
  initialValues: {
    name: '',
    unit: '',
    description: '',
  },
});

const [name, nameAttrs] = defineField('name');
const [unit, unitAttrs] = defineField('unit');
const [description, descriptionAttrs] = defineField('description');

// update de producto
const actualizarProducto = handleSubmit(async (values) => {
  try {
    const prodUpdate: ProductUpdateDto = {
      name: values.name,
      unit: values.unit,
      description: values.description,
    };
    await updateProduct(prodUpdate, productId);

    toast.success('Producto actualizado correctamente.');
    // tras actualizar el producto recargamos la lista de productos
    goListaProductos();
  } catch (err) {
    toast.error(`No se ha podido actualizar el producto: ${(err as Error).message}`, 3000);
  }
});

// delete de producto
const eliminarProducto = async () => {
  try {
    await deleteProduct(productId);

    toast.success('Producto eliminado correctamente.');
    // tras eliminar el producto recargamos la lista de productos
    goListaProductos();
  } catch (err) {
    toast.error(`No se ha podido eliminar el producto: ${(err as Error).message}`, 3000);
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
            <p class="text-primary fw-semibold small mb-2">🛒 Catálogo</p>
            <h1 class="display-5 fw-bold mb-3">Detalle del producto</h1>
          </div>
          <div>
            <RouterLink :to="{ name: 'productos' }" class="btn btn-outline-secondary">
              ← Volver al listado
            </RouterLink>
          </div>
        </div>
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div>
                <small class="text-secondary">ID: {{ productId }}</small>
                <h3 class="fw-bold mb-2">
                  {{ name }}
                </h3>
                <span class="badge bg-light text-dark border">
                  {{ unit }}
                </span>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-danger" @click="eliminarProducto">Eliminar</button>
                <button class="btn btn-primary" :disabled="!meta.valid" @click="actualizarProducto">
                  Guardar cambios
                </button>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nombre del producto</label>
                <input v-model="name" v-bind="nameAttrs" type="text" class="form-control" />
                <small class="text-danger">{{ errors.name }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Unidad</label>
                <select v-model="unit" v-bind="unitAttrs" class="form-select">
                  <option value="">Selecciona</option>
                  <option v-for="u in units" :key="u" :value="u">
                    {{ u }}
                  </option>
                </select>
                <small class="text-danger">{{ errors.unit }}</small>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descripción</label>
                <textarea
                  v-model="description"
                  v-bind="descriptionAttrs"
                  class="form-control"
                  rows="4"
                ></textarea>
                <small class="text-danger">{{ errors.description }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
