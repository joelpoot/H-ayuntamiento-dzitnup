import { createRouter, createWebHistory } from 'vue-router'

// Cada vista se carga en su propio chunk bajo demanda (en vez de un solo
// bundle gigante con todo junto). Reduce bastante el JS que el navegador
// tiene que descargar y ejecutar para cualquier página en particular —
// por ejemplo, Leaflet (mapa) o Swiper (galería) ya no van en el bundle
// inicial si el visitante solo entra a Inicio o Avisos.
const InicioView = () => import('../views/InicioView.vue')
const AvisosView = () => import('../views/AvisosView.vue')
const ReportesView = () => import('../views/ReportesView.vue')
const SeguimientoView = () => import('../views/SeguimientoView.vue')
const HorariosView = () => import('../views/HorariosView.vue')
const DirectorioView = () => import('../views/DirectorioView.vue')
const AgendaView = () => import('../views/AgendaView.vue')
const GaleriaView = () => import('../views/GaleriaView.vue')
const MapaView = () => import('../views/MapaView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: InicioView },
    { path: '/avisos', component: AvisosView },
    { path: '/reportes', component: ReportesView },
    { path: '/seguimiento', component: SeguimientoView },
    { path: '/horarios', component: HorariosView },
    { path: '/directorio', component: DirectorioView },
    { path: '/agenda', component: AgendaView },
    { path: '/galeria', component: GaleriaView },
    { path: '/mapa', component: MapaView },
    { path: '/admin', component: () => import('../views/AdminView.vue') },
    { path: '/admin/restablecer', name: 'restablecer-password', component: () => import('../views/RestablecerPasswordView.vue') },
  ]
})

export default router
