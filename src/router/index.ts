import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import AvisosView from '../views/AvisosView.vue'
import ReportesView from '../views/ReportesView.vue'
import HorariosView from '../views/HorariosView.vue'
import DirectorioView from '../views/DirectorioView.vue'
import AgendaView from '../views/AgendaView.vue'
import GaleriaView from '../views/GaleriaView.vue'
import MapaView from '../views/MapaView.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: InicioView },
    { path: '/avisos', component: AvisosView },
    { path: '/reportes', component: ReportesView },
    { path: '/horarios', component: HorariosView },
    { path: '/directorio', component: DirectorioView },
    { path: '/agenda', component: AgendaView },
    { path: '/galeria', component: GaleriaView },
    { path: '/mapa', component: MapaView },
    { path: '/admin', component: () => import('../views/AdminView.vue') },
  ]
})

export default router