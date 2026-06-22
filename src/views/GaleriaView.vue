<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Galería</h1>
      <p class="text-[#c2a878] text-sm mt-1">Eventos, obras y actividades de la comunidad</p>
    </div>

    <!-- Filtros -->
    <div class="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-2">
      <button @click="filtroActivo = 'Todos'"
        :class="filtroActivo === 'Todos' ? 'bg-[#14392b] text-white' : 'border border-[#14392b] text-[#14392b] hover:bg-[#14392b] hover:text-white'"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">Todos</button>
      <button v-for="cat in categorias" :key="cat" @click="filtroActivo = cat"
        :class="filtroActivo === cat ? 'bg-[#14392b] text-white' : 'border border-[#14392b] text-[#14392b] hover:bg-[#14392b] hover:text-white'"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">{{ cat }}</button>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando galería...</div>

    <!-- Carrusel -->
    <div v-else-if="galeriaFiltrada.length > 0" class="max-w-6xl mx-auto px-4 pb-14">
      <Swiper
        :key="filtroActivo"
        :modules="[EffectCoverflow, Pagination, Autoplay]"
        effect="coverflow"
        :grab-cursor="true"
        :centered-slides="true"
        slides-per-view="auto"
        :coverflow-effect="{ rotate: 0, stretch: 0, depth: 140, modifier: 1.8, slideShadows: false }"
        :autoplay="{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }"
        pagination
        class="galeria-swiper"
      >
        <SwiperSlide v-for="(foto, i) in galeriaFiltrada" :key="i" style="width: 360px">
          <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div class="bg-gray-200 h-72 flex items-center justify-center text-gray-400 text-sm">
              <span v-if="!foto.imagen_url">[ {{ foto.titulo }} ]</span>
              <img v-else :src="foto.imagen_url" class="w-full h-full object-cover" />
            </div>
            <div class="bg-[#14392b] px-4 py-3 flex justify-between items-center">
              <p class="text-white font-bold text-sm">{{ foto.titulo }}</p>
              <span class="bg-[#c2a878] text-white text-xs px-2 py-1 rounded-full">{{ foto.categoria }}</span>
            </div>
            <div class="px-4 py-3 text-xs text-gray-500">
              <p>📁 Álbum: {{ foto.album }}</p>
              <p class="mt-1">{{ foto.descripcion }}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Sin resultados -->
    <div v-if="!cargando && galeriaFiltrada.length === 0" class="text-center py-10 text-gray-400">
      No hay fotos en esta categoría.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const galeria = ref([])
const cargando = ref(true)
const filtroActivo = ref('Todos')

const categorias = ['Evento', 'Obra', 'Actividad', 'General']

const galeriaFiltrada = computed(() => {
  if (filtroActivo.value === 'Todos') return galeria.value
  return galeria.value.filter(f => f.categoria === filtroActivo.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('galeria')
    .select('*')
    .order('fecha', { ascending: false })

  if (!error) galeria.value = data
  cargando.value = false
})
</script>

<style scoped>
.galeria-swiper {
  padding: 30px 10px 50px;
  --swiper-theme-color: #14392b;
  --swiper-pagination-color: #14392b;
  --swiper-pagination-bullet-inactive-color: #c2a878;
  --swiper-pagination-bullet-inactive-opacity: 0.5;
  --swiper-navigation-size: 22px;
}
.galeria-swiper :deep(.swiper-slide) {
  opacity: 0.55;
  transition: opacity 0.3s ease;
}
.galeria-swiper :deep(.swiper-slide-active) {
  opacity: 1;
}
</style>