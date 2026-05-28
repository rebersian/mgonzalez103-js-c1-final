<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { getUnits, getProducts, addProduct } from '../services/products.service';
import type { ProductDto } from '../models/product.dto';
import { useToast } from '@/common/composables/useToast';

const router = useRouter();
const toast = useToast();

const search = ref('');
const viewMode = ref<'cards' | 'list'>('cards');

const units = ref<string[]>([]);
const products = ref<ProductDto[]>([]);

const resetSearch = () => {
  search.value = '';
};

// cambio de lista a tarjetas
const toggleView = () => {
  viewMode.value = viewMode.value === 'cards' ? 'list' : 'cards';
};

// redireccion a detalle de producto
const goToProduct = (productId: string) => {
  router.push({
    name: 'detalleProducto',
    params: { productId },
  });
};

// redireccion a pantalla inicial
const goHome = () => {
  router.push({
    name: 'home',
  });
};

// Carga inicial de datos de la pantalla
const cargarDatos = async () => {
  try {
    const [unitsRes, productosRes] = await Promise.all([getUnits(), getProducts()]);

    products.value = productosRes.productsList;
    units.value = unitsRes.unitsList;
  } catch {
    toast.error('Error al cargar los datos de productos.', 3000);
    // si falla volvemos al inicio
    goHome();
  }
};

// esquema para la validación de campos previo al alta de producto
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  unit: yup.string().required('Se ha de seleccionar la unidad'),
  description: yup.string().nullable(),
});

// Gestión y validación del estado del formulario
const { handleSubmit, defineField, errors, meta, resetForm } = useForm<ProductDto>({
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

const anadirProducto = handleSubmit(async (values) => {
  try {
    const product: ProductDto = {
      name: values.name,
      unit: values.unit,
      description: values.description,
    };

    await addProduct(product);

    toast.success('Producto creado correctamente');

    resetForm();

    await cargarDatos();
  } catch {
    toast.error('Se ha producido un error al guardar el producto.', 3000);
  }
});

// filtro de productos
const filteredProducts = computed(() => {
  return products.value.filter((p) =>
    `${p.name} ${p.description} ${p.unit}`.toLowerCase().includes(search.value.toLowerCase())
  );
});

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
            <h1 class="display-5 fw-bold mb-3">Mi lista de productos</h1>
            <p class="lead text-secondary mb-4">
              Añade y consulta los productos que necesitas para la próxima compra.
            </p>
            <div class="d-flex gap-2">
              <span class="badge bg-primary">Total: {{ products.length }}</span>
              <span class="badge bg-secondary">Unidades: {{ units.length }}</span>
            </div>
          </div>
          <div>
            <RouterLink to="/" class="btn btn-outline-secondary px-4">
              ← Volver al inicio
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-4">
      <div class="container">
        <div class="border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="mb-4">
              <h3 class="fw-bold">Añadir producto</h3>
              <p class="text-secondary mb-0">
                Guarda el nombre, la unidad y una pequeña descripción.
              </p>
            </div>

            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label fw-semibold">Nombre del producto</label>

                <input
                  v-model="name"
                  v-bind="nameAttrs"
                  type="text"
                  class="form-control"
                  placeholder="Ej. Leche"
                />

                <small class="text-danger">{{ errors.name }}</small>
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold">Unidad</label>

                <select v-model="unit" v-bind="unitAttrs" class="form-select">
                  <option value="">Selecciona</option>

                  <option v-for="u in units" :key="u" :value="u">
                    {{ u }}
                  </option>
                </select>

                <small class="text-danger">{{ errors.unit }}</small>
              </div>

              <div class="col-md-5">
                <label class="form-label fw-semibold">Descripción</label>

                <input
                  v-model="description"
                  v-bind="descriptionAttrs"
                  type="text"
                  class="form-control"
                  placeholder="Ej. Entera"
                />

                <small class="text-danger">{{ errors.description }}</small>
              </div>
            </div>

            <button
              class="btn btn-primary mt-4 px-4"
              :disabled="!meta.valid"
              @click="anadirProducto"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-4">
      <div class="container">
        <label class="label py-2">Búsqueda rápida</label>

        <div class="d-flex flex-column flex-lg-row gap-3 align-items-lg-center">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Busca por nombre, unidad o descripción..."
          />

          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary px-4 text-nowrap" @click="toggleView">
              {{ viewMode === 'cards' ? 'Ver lista' : 'Ver tarjetas' }}
            </button>

            <button class="btn btn-outline-secondary px-4" @click="resetSearch">Recargar</button>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container">
        <div v-if="viewMode === 'cards'" class="row g-4">
          <div
            class="col-md-6 col-xl-4"
            v-for="product in filteredProducts"
            :key="product.productId"
          >
            <div
              class="card border-0 shadow-sm rounded-4 h-100"
              @click="goToProduct(product.productId!)"
            >
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 class="fw-bold mb-1">{{ product.name }}</h4>
                    <p class="text-secondary mb-0">
                      {{ product.description }}
                    </p>
                  </div>

                  <span class="badge bg-light text-dark border">
                    {{ product.unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div
            v-for="product in filteredProducts"
            :key="product.productId"
            class="d-flex justify-content-between align-items-center p-3 border-bottom product-row"
            @click="goToProduct(product.productId!)"
          >
            <div>
              <h6 class="fw-bold mb-1">{{ product.name }}</h6>
              <p class="text-secondary mb-0 small">
                {{ product.description }}
              </p>
            </div>

            <span class="badge bg-light text-dark border">
              {{ product.unit }}
            </span>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="col-12">
          <div class="text-center py-5 border rounded-4 bg-white">
            <h5 class="fw-bold">No hay productos</h5>
            <p class="text-secondary mb-0">Añade un producto o prueba otra búsqueda.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card:hover {
  transform: translateY(-4px);
  transition: all 0.2s ease;
}
</style>
