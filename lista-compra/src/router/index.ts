import { authRoutes } from '@/modules/auth/routes';
import HomePage from '@/modules/landing/pages/HomePage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/modules/landing/layouts/LandingLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: HomePage,
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('@/modules/landing/pages/PerfilPage.vue'),
        },
        {
          path: '/productos',
          name: 'productos',
          component: () => import('@/modules/products/pages/ListaProductos.vue'),
        },
        {
          path: '/detalleProducto/:productId',
          name: 'detalleProducto',
          component: () => import('@/modules/products/pages/DetalleProducto.vue'),
        },
        {
          path: '/listaCompra',
          name: 'listaCompra',
          component: () => import('@/modules/shopping/pages/ListaCompra.vue'),
        },
        {
          path: '/detalleLista/:shoppingListId',
          name: 'detalleLista',
          component: () => import('@/modules/shopping/pages/DetalleLista.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/modules/landing/pages/AboutPage.vue'),
        },
      ],
    },
    authRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/common/components/NotFound.vue'),
    },
  ],
});

export default router;
