<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Avisos y Noticias</h1>
      <p class="text-[#c2a878] text-sm mt-1">Información oficial de la Comisaria</p>
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
    <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando avisos...</div>

    <!-- Cards -->
    <div class="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="aviso in avisosFiltrados" :key="aviso.id"
        class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#14392b] px-4 py-3 flex justify-between items-center">
          <span class="text-white font-bold text-sm">{{ aviso.titulo }}</span>
          <span class="bg-[#c2a878] text-white text-xs px-2 py-1 rounded-full font-semibold">{{ aviso.categoria }}</span>
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-600 mb-3">{{ aviso.descripcion }}</p>
          <div class="rounded-lg h-32 mb-3 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img v-if="aviso.imagen_url" :src="aviso.imagen_url" class="w-full h-full object-contain" />
            <span v-else class="text-gray-400 text-sm">[ Sin imagen ]</span>
          </div>
          <div class="text-xs text-gray-500 space-y-1">
            <p><span class="font-semibold">Área:</span> {{ aviso.area }}</p>
            <p class="flex items-center gap-1">
              <Calendar :size="12" class="shrink-0" />
              <span><span class="font-semibold">Pub:</span> {{ aviso.fecha_publicacion }} | <span class="font-semibold">Vig:</span> {{ aviso.fecha_vigencia }}</span>
            </p>
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
import { Calendar } from 'lucide-vue-next'
import { supabase } from '../supabase.js'

const avisos = ref([])
const cargando = ref(true)
const filtroActivo = ref('Todos')

const categorias = ['Corte de agua', 'Corte de luz', 'Obra', 'Evento', 'General']

const hoyStr = () => new Date().toISOString().split('T')[0]

const esVisible = (aviso) => aviso.estado !== 'Cancelado' && !!aviso.fecha_vigencia && aviso.fecha_vigencia >= hoyStr()

const avisosFiltrados = computed(() => {
  const vigentes = avisos.value.filter(esVisible)
  if (filtroActivo.value === 'Todos') return vigentes
  return vigentes.filter(a => a.categoria === filtroActivo.value)
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