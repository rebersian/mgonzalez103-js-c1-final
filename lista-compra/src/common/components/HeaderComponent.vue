<script setup lang="ts">
import { useToast } from '@/common/composables/useToast';
import { clearAuth, isAuthenticated } from '@/modules/auth/utils/token';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const toast = useToast();

const isLoggedIn = computed(() => isAuthenticated());

function logout() {
  clearAuth();
  toast.info('Sesión cerrada');
  router.push('/login');
}
</script>

<template>
  <header class="navbar navbar-expand-lg bg-light border-bottom">
    <div class="container">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <img src="../images/listaCompra.png" alt="Vue logo" height="32" class="me-2" />
        <span class="fw-semibold">Lista de la compra</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <nav id="mainNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" exact-active-class="active">Inicio</RouterLink>
          </li>

          <li v-if="isLoggedIn" class="nav-item">
            <RouterLink to="/productos" class="nav-link" exact-active-class="active"
              >Productos</RouterLink
            >
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <RouterLink to="/listaCompra" class="nav-link" exact-active-class="active"
              >Lista de compra</RouterLink
            >
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <RouterLink to="/perfil" class="nav-link" exact-active-class="active"
              >Perfil</RouterLink
            >
          </li>

          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" exact-active-class="active"
              >Sobre la app</RouterLink
            >
          </li>

          <li v-if="!isLoggedIn" class="nav-item">
            <RouterLink to="/login" class="nav-link" exact-active-class="active">Login</RouterLink>
          </li>
          <li v-if="!isLoggedIn" class="nav-item ms-lg-2">
            <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
          </li>

          <li v-if="isLoggedIn" class="nav-item ms-lg-2">
            <button class="btn btn-outline-danger btn-sm" type="button" @click="logout">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-link.active {
  font-weight: 600;
}
</style>
