<template>
  <div>
    <!-- Header -->
    <div class="bg-[#1a5f5a] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">📅 Agenda Comunitaria</h1>
      <p class="text-green-200 text-sm mt-1">Eventos, fechas cívicas y reuniones de cabildo</p>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-10 space-y-4">

      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando agenda...</div>

      <div v-else v-for="(evento, i) in agenda" :key="i"
        class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div class="flex">
          <div class="w-1 bg-[#F5A623]"></div>
          <div class="flex-1 p-5 flex gap-4 items-start">

            <!-- Fecha -->
            <div class="bg-[#1a5f5a] text-white rounded-lg px-4 py-3 text-center shrink-0">
              <p class="text-2xl font-bold">{{ formatDia(evento.fecha) }}</p>
              <p class="text-xs uppercase">{{ formatMes(evento.fecha) }}</p>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-bold text-gray-800">{{ evento.titulo }}</p>
                <span class="bg-[#F5A623] text-white text-xs px-2 py-1 rounded-full">{{ evento.tipo }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ evento.descripcion }}</p>
              <div class="flex gap-4 mt-2 text-xs text-gray-400">
                <span>📍 {{ evento.lugar }}</span>
                <span>🕐 {{ evento.hora }}</span>
                <span>👥 {{ evento.dirigido }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Sin eventos -->
      <div v-if="!cargando && agenda.length === 0" class="text-center py-10 text-gray-400">
        No hay eventos programados.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const agenda = ref([])
const cargando = ref(true)

const formatDia = (fecha) => {
  return new Date(fecha).getUTCDate().toString().padStart(2, '0')
}

const formatMes = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .order('fecha', { ascending: true })

  if (!error) agenda.value = data
  cargando.value = false
})
</script>