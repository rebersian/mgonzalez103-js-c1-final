<script setup lang="ts">
import { useToast } from '@/common/composables/useToast';
import { useField, useForm } from 'vee-validate';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import type { UpdateUserDto } from '@/modules/auth/models/update-user.dto';
import type { User } from '@/modules/auth/models/user.model';
import {
  getInfoUser,
  updateUserProfile,
  resetUser,
  seedUser,
} from '@/modules/auth/services/auth.service';
import { clearAuth } from '@/modules/auth/utils/token';

const router = useRouter();
const toast = useToast();

const user = ref<User | null>(null);

const schema = yup.object({
  name: yup.string().required().min(3),
  email: yup.string().required('El email es obligatorio').email('Formato de email inválido'),
  password: yup
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .notRequired()
    .min(6)
    .max(50),
});

type ProfileValues = {
  name: string;
  email: string;
  password: string;
};

const initialValues: ProfileValues = {
  name: '',
  email: '',
  password: '',
};

const { handleSubmit, meta, setValues } = useForm<ProfileValues>({
  validationSchema: schema,
  initialValues,
});

const nameField = useField<string>('name');
const emailField = useField<string>('email');
const passwordField = useField<string>('password');

const showNameError = computed(() => nameField.meta.touched && !!nameField.errorMessage.value);
const showEmailError = computed(() => emailField.meta.touched && !!emailField.errorMessage.value);
const showPasswordError = computed(
  () => passwordField.meta.touched && !!passwordField.errorMessage.value
);

const canSubmit = computed(() => meta.value.valid && meta.value.dirty);

const loadUser = async () => {
  try {
    const res = await getInfoUser();
    user.value = res.user;

    setValues({
      name: res.user.name ?? '',
      email: res.user.email ?? '',
      password: '',
    });
  } catch {
    toast.error('No se ha podido cargar los datos del usuario.', 3000);
  }
};

onMounted(loadUser);

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload: UpdateUserDto = {
      name: values.name,
      email: values.email,
      password: values.password?.trim() || undefined,
    };

    await updateUserProfile(payload);

    toast.success('Perfil actualizado correctamente');
    await loadUser();
  } catch {
    toast.error('No se ha podido actualizar el perfil.', 3000);
  }
});

function logout() {
  clearAuth();
  toast.info('Sesión cerrada');
  router.push('/login');
}

const cargarEjemplo = async () => {
  try {
    await seedUser();

    toast.success('Perfil actualizado. Datos de simulacion cargados correctamente.');
  } catch {
    toast.error('No se ha podido cargar los datos simulados.', 3000);
  }
};

const eliminarEjemplo = async () => {
  try {
    await resetUser();

    toast.success('Perfil actualizado. Eliminados los datos correctamente.');
  } catch {
    toast.error('No se ha podido eliminar los datos del perfil.', 3000);
  }
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-12">
      <div class="py-5 bg-body-tertiary rounded-3 border">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8">
              <h1 class="display-6 fw-bold mb-2">Perfil de usuario</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="py-5">
        <div class="card border-1 shadow-sm rounded-4">
          <div class="card-body p-4 p-md-5">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="p-3 bg-light rounded-4 border">
                  <small class="text-secondary">Identificador</small>
                  <div class="fw-semibold text-break">
                    {{ user?.id }}
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="p-3 bg-light rounded-4 border">
                  <small class="text-secondary">Correo actual</small>
                  <div class="fw-semibold">
                    {{ user?.email }}
                  </div>
                </div>
              </div>
            </div>

            <form @submit.prevent="onSubmit" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input
                    class="form-control form-control-lg rounded-3"
                    v-model="nameField.value.value"
                    @blur="nameField.handleBlur"
                    :class="{ 'is-invalid': showNameError }"
                  />
                  <div v-if="showNameError" class="invalid-feedback">
                    {{ nameField.errorMessage.value }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Correo electrónico</label>
                  <input
                    class="form-control form-control-lg rounded-3"
                    v-model="emailField.value.value"
                    @blur="emailField.handleBlur"
                    :class="{ 'is-invalid': showEmailError }"
                  />
                  <div v-if="showEmailError" class="invalid-feedback">
                    {{ emailField.errorMessage.value }}
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    class="form-control form-control-lg rounded-3"
                    v-model="passwordField.value.value"
                    @blur="passwordField.handleBlur"
                    :class="{ 'is-invalid': showPasswordError }"
                    placeholder="Déjala vacía si no quieres cambiarla"
                    autocomplete="new-password"
                  />
                  <div v-if="showPasswordError" class="invalid-feedback">
                    {{ passwordField.errorMessage.value }}
                  </div>
                </div>
              </div>

              <div class="row g-2 mt-4">
                <div class="col-12 col-md-4">
                  <button class="btn btn-primary w-100" type="submit" :disabled="!canSubmit">
                    Guardar cambios
                  </button>
                </div>

                <div class="col-12 col-md-4">
                  <button
                    class="btn btn-outline-secondary w-100"
                    type="button"
                    @click="cargarEjemplo"
                  >
                    Cargar datos de ejemplo
                  </button>
                </div>

                <div class="col-12 col-md-4">
                  <button
                    class="btn btn-outline-warning w-100"
                    type="button"
                    @click="eliminarEjemplo"
                  >
                    Eliminar datos de ejemplo
                  </button>
                </div>
              </div>
            </form>

            <hr class="my-4" />

            <button class="btn btn-outline-danger btn-sm w-100" type="button" @click="logout">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
