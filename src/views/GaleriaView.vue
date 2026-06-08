<template>
  <div>
    <!-- Header -->
    <div class="bg-[#1a5f5a] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">🖼️ Galería</h1>
      <p class="text-green-200 text-sm mt-1">Eventos, obras y actividades de la comunidad</p>
    </div>

    <!-- Filtros -->
    <div class="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-2">
      <button @click="filtroActivo = 'Todos'"
        :class="filtroActivo === 'Todos' ? 'bg-[#1a5f5a] text-white' : 'border border-[#1a5f5a] text-[#1a5f5a] hover:bg-[#1a5f5a] hover:text-white'"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">Todos</button>
      <button v-for="cat in categorias" :key="cat" @click="filtroActivo = cat"
        :class="filtroActivo === cat ? 'bg-[#1a5f5a] text-white' : 'border border-[#1a5f5a] text-[#1a5f5a] hover:bg-[#1a5f5a] hover:text-white'"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">{{ cat }}</button>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando galería...</div>

    <!-- Grid -->
    <div class="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(foto, i) in galeriaFiltrada" :key="i"
        class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-sm">
          <span v-if="!foto.imagen_url">[ {{ foto.titulo }} ]</span>
          <img v-else :src="foto.imagen_url" class="w-full h-full object-cover" />
        </div>
        <div class="bg-[#1a5f5a] px-4 py-3 flex justify-between items-center">
          <p class="text-white font-bold text-sm">{{ foto.titulo }}</p>
          <span class="bg-[#F5A623] text-white text-xs px-2 py-1 rounded-full">{{ foto.categoria }}</span>
        </div>
        <div class="px-4 py-3 text-xs text-gray-500">
          <p>📁 Álbum: {{ foto.album }}</p>
          <p class="mt-1">{{ foto.descripcion }}</p>
        </div>
      </div>
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