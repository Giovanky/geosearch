import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import('@/views/dashboard/Login')
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      meta: {requireAuth: true},
      children: [
        {
          name: 'Buscar Ubicacion',
          path: '/search',
          component: () => import('@/views/dashboard/useCases/SearchLocation'),
          meta: {requireAuth: true}
        },
        {
          name: 'Enrutar Ubicacion',
          path: '/route',
          component: () => import('@/views/dashboard/useCases/RouteLocation'),
          meta: {requireAuth: true}
        },
        {
          name: 'Ubicaciones',
          path: '/locations',
          component: () => import('@/views/dashboard/useCases/locations/Locations'),
          meta: {requireAuth: true, admin: true}
        },
        {
          name: 'Crear Ubicacion',
          path: '/locations/create',
          component: () => import('@/views/dashboard/useCases/locations/CreateLocation'),
          meta: {requireAuth: true, admin: true}
        },
        {
          name: 'Editar Ubicacion',
          path: '/locations/edit/:id',
          component: () => import('@/views/dashboard/useCases/locations/EditLocation'),
          meta: {requireAuth: true, admin: true}
        },
        {
          name: 'Usuarios',
          path: '/users',
          component: () => import('@/views/dashboard/useCases/users/Users'),
          meta: {requireAuth: true, admin: true}
        },
        {
          name: 'Crear Usuario',
          path: '/users/create',
          component: () => import('@/views/dashboard/useCases/users/CreateUser'),
          meta: {requireAuth: true, admin: true}
        },
        {
          name: 'Editar Usuario',
          path: '/users/edit/:id',
          component: () => import('@/views/dashboard/useCases/users/EditUser'),
          meta: {requireAuth: true, admin: true}
        },
        // Dashboard
        {
          name: 'Inicio',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: {requireAuth: true}
        }
      ],
    },
    //redireccionamiento
    {
      path: '*',
      component: () => import('@/views/dashboard/Index')
    }
  ],
})

router.beforeEach((to, from, next) => {
  const protectedRoutes = to.matched.some(record => record.meta.requireAuth)
  const isAdmin = to.matched.some(record => record.meta.admin)
  if(protectedRoutes && store.state.user === ''){
    next('/login')
  }else{
    if(isAdmin && store.state.user !== 'admin'){
      next('/search')
    }
    next()
  }
})

export default router
