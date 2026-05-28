<script setup lang="ts"></script>

<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <p class="text-success fw-semibold small mb-2">🛒 Compra semanal bajo control</p>

          <h1 class="display-5 fw-bold mb-3">Tu lista de la compra, clara y siempre a mano</h1>

          <p class="lead text-secondary mb-4">
            Anota productos, añade recordatorios y marca lo que ya has comprado en segundos. Una app
            sencilla para ahorrar tiempo y evitar olvidos.
          </p>

          <div class="d-flex gap-2">
            <RouterLink to="/about" class="btn btn-primary btn-lg px-4">
              Descubre la app
            </RouterLink>
          </div>

          <div class="d-flex gap-4 mt-4 text-secondary small">
            <span>🗓 Compra planificada</span>
            <span>📱 Diseño responsive</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-lg rounded-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0">Compra del sábado</h5>
                <span class="badge bg-primary">3 pendientes</span>
              </div>

              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>🥛 Leche y yogures</span>
                  <span class="badge bg-success">Comprado</span>
                </li>

                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>🍎 Fruta de temporada</span>
                  <span class="badge bg-warning text-dark">Pendiente</span>
                </li>

                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>🍞 Pan integral</span>
                  <span class="badge bg-warning text-dark">Pendiente</span>
                </li>

                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>🧼 Detergente</span>
                  <span class="badge bg-warning text-dark">Pendiente</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold">Pensada para organizar la compra del día a día</h2>
        <p class="text-secondary">
          Todo lo que necesitas para preparar la nevera, la despensa o la compra familiar desde un
          solo lugar.
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="p-4 border rounded-4 h-100">
            <h5>🧺 Listas claras</h5>
            <p class="text-secondary mb-0">
              Añade productos, notas y fechas de compra para que cada salida al supermercado sea más
              rápida.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="p-4 border rounded-4 h-100">
            <h5>✨ Prioriza lo importante</h5>
            <p class="text-secondary mb-0">
              Utiliza las fechas para organizar y priorizar tus compras y no olvidarte lo más
              necesario.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="p-4 border rounded-4 h-100">
            <h5>📱 Siempre disponible</h5>
            <p class="text-secondary mb-0">
              Accede desde móvil o escritorio mientras compras o planificas la semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
