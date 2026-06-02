<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {
  getShoppingLists,
  addShoppingList,
  deleteShoppingList,
} from '../services/shopping.service';
import type { ShoppingListDto } from '../models/shoppingList.dto';
import { useToast } from '@/common/composables/useToast';

const router = useRouter();
const toast = useToast();

const search = ref('');

const shoppingLists = ref<ShoppingListDto[]>([]);

const resetSearch = () => {
  search.value = '';
};

// redireccion a detalle de lista
const goToShoppingList = (shoppingListId: string) => {
  router.push({
    name: 'detalleLista',
    params: { shoppingListId },
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
    const res = await getShoppingLists();
    shoppingLists.value = res.shoppingLists;
  } catch (err) {
    toast.error(`Error al cargar las listas: ${(err as Error).message}`, 3000);
    // si falla volvemos al inicio
    goHome();
  }
};

// esquema para la validación de campos previo al alta de producto
const schema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .required('La fecha es obligatoria'),
});

// Gestión y validación del estado del formulario
const { handleSubmit, defineField, errors, meta, resetForm } = useForm<ShoppingListDto>({
  validationSchema: schema,
  initialValues: {
    title: '',
    date: '',
  },
});

const [title, titleAttrs] = defineField('title');
const [date, dateAttrs] = defineField('date');

// insert lista
const crearLista = handleSubmit(async (values) => {
  try {
    const shoppingList: ShoppingListDto = {
      title: values.title,
      date: values.date,
    };

    await addShoppingList(shoppingList);

    toast.success('Lista creada correctamente');

    resetForm();

    await cargarDatos();
  } catch (err) {
    toast.error(`Error al crear la lista: ${(err as Error).message}`, 3000);
  }
});

// delete de la lista
const eliminarLista = async (shoppingListId: string) => {
  try {
    await deleteShoppingList(shoppingListId);

    toast.success('Lista eliminada correctamente');
    // recarga de datos
    await cargarDatos();
  } catch (err) {
    toast.error(`Error al eliminar la lista: ${(err as Error).message}`, 3000);
  }
};

// filtro de listas
const filteredLists = computed(() => {
  return shoppingLists.value.filter((list) =>
    list.title.toLowerCase().includes(search.value.toLowerCase())
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
            <p class="text-primary fw-semibold small mb-2">🛒 Listas</p>
            <h1 class="display-5 fw-bold mb-3">Mis listas de compra</h1>
            <p class="lead text-secondary mb-4">
              Crea y organiza listas distintas para la compra semanal, eventos o recados.
            </p>
            <div class="d-flex gap-2">
              <span class="badge bg-primary">Listas: {{ shoppingLists.length }}</span>
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
              <h3 class="fw-bold">Crear lista de compra</h3>
              <p class="text-secondary mb-0">
                Define un título y una fecha para organizar mejor tus próximas compras.
              </p>
            </div>
            <div class="row g-3">
              <div class="col-md-7">
                <label class="form-label fw-semibold">Título</label>
                <input
                  v-model="title"
                  v-bind="titleAttrs"
                  type="text"
                  class="form-control"
                  placeholder="Ej. Compra semanal"
                />
                <small class="text-danger">
                  {{ errors.title }}
                </small>
              </div>
              <div class="col-md-5">
                <label class="form-label fw-semibold">Fecha</label>
                <input v-model="date" v-bind="dateAttrs" type="date" class="form-control" />
                <small class="text-danger">
                  {{ errors.date }}
                </small>
              </div>
            </div>
            <button class="btn btn-primary mt-4 px-4" :disabled="!meta.valid" @click="crearLista">
              Crear lista
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-4">
      <div class="container">
        <label class="label py-2">Buscar lista</label>
        <div class="d-flex flex-column flex-lg-row gap-3 align-items-lg-center">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Busca por título..."
          />
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary px-4" @click="resetSearch">Recargar</button>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6" v-for="(list, index) in filteredLists" :key="index">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-4">
                <div class="mb-4">
                  <h3 class="fw-bold">{{ list.title }}</h3>
                  <p class="text-secondary mb-0">Fecha: {{ list.date }}</p>
                </div>
                <p class="text-secondary">
                  Gestiona los productos incluidos en esta lista y revisa su coste estimado.
                </p>
                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-primary" @click="goToShoppingList(list.shoppingListId!)">
                    Ver detalle
                  </button>
                  <button
                    class="btn btn-outline-danger"
                    @click="eliminarLista(list.shoppingListId!)"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredLists.length === 0" class="col-12">
          <div class="text-center py-5 border rounded-4 bg-white">
            <h5 class="fw-bold">No hay listas</h5>
            <p class="text-secondary mb-0">Crea una nueva lista o prueba otra búsqueda.</p>
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
