<script setup lang="ts"></script>

<template>
  <div class="container-fluid p-0">
    <div class="row g-0 min-vh-100">
      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center brand-side">
        <div class="text-center">
          <img
            src="../../../common/images/listaCompra.png"
            class="img-fluid mb-3"
            style="max-width: 160px"
          />
          <h2 class="fw-semibold">Lista de la compra</h2>
          <p class="text-muted mb-0">
            Organiza la compra semanal con una experiencia simple y visual
          </p>
        </div>
      </div>

      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center">
        <div class="w-100" style="max-width: 420px">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
