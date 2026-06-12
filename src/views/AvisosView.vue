<template>
  <div>
    <!-- Header -->
    <div class="bg-[#1a5f5a] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">📢 Avisos y Noticias</h1>
      <p class="text-green-200 text-sm mt-1">Información oficial del H. Ayuntamiento de Dzitnup</p>
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
    <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando avisos...</div>

    <!-- Cards -->
    <div class="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="aviso in avisosFiltrados" :key="aviso.id"
        class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3 flex justify-between items-center">
          <span class="text-white font-bold text-sm">{{ aviso.titulo }}</span>
          <span class="bg-[#F5A623] text-white text-xs px-2 py-1 rounded-full font-semibold">{{ aviso.categoria }}</span>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-600 mb-3">{{ aviso.descripcion }}</p>
          <div class="rounded-lg h-32 mb-3 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img v-if="aviso.imagen_url" :src="aviso.imagen_url" class="w-full h-full object-contain" />
            <span v-else class="text-gray-400 text-sm">[ Evidencia / Póster del Aviso ]</span>
          </div>
          <div class="text-xs text-gray-500 space-y-1">
            <p><span class="font-semibold">Área:</span> {{ aviso.area }}</p>
            <p><span class="font-semibold">Pub:</span> {{ aviso.fecha_publicacion }} | <span class="font-semibold">Vig:</span> {{ aviso.fecha_vigencia }}</p>
          </div>
          <div class="mt-2 flex items-center gap-1">
            <span :class="aviso.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full inline-block"></span>
            <span :class="aviso.estado === 'Activo' ? 'text-green-600' : 'text-red-600'" class="text-xs font-semibold">{{ aviso.estado }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="!cargando && avisosFiltrados.length === 0" class="text-center py-10 text-gray-400">
      No hay avisos en esta categoría.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const avisos = ref([])
const cargando = ref(true)
const filtroActivo = ref('Todos')

const categorias = ['Corte de agua', 'Corte de luz', 'Obra', 'Evento', 'General']

const avisosFiltrados = computed(() => {
  if (filtroActivo.value === 'Todos') return avisos.value
  return avisos.value.filter(a => a.categoria === filtroActivo.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .order('fecha_publicacion', { ascending: false })

  if (!error) avisos.value = data
  cargando.value = false
})
</script>