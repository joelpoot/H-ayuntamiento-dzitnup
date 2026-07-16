<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-8 border-l-4 border-[#c2a878] relative">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#c2a878]/15 flex items-center justify-center shrink-0">
          <Map :size="24" class="text-black" />
        </div>
        <div>
          <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Mapa de Incidencias</h1>
          <p class="text-[#c2a878] text-sm mt-1">Visualización geográfica de reportes ciudadanos</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Mapa -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div class="bg-[#14392b] px-4 py-3">
            <p class="text-white font-bold text-sm uppercase">Mapa Interactivo — Dzitnup, Yucatán</p>
          </div>
          <div id="mapa" class="h-96 w-full z-0"></div>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="space-y-4">

        <!-- Leyenda -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <p class="font-bold text-[#14392b] text-sm uppercase mb-3">Código de Estatus</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
              <span class="text-sm text-gray-600">Pin Amarillo: <strong>Pendiente</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span class="text-sm text-gray-600">Pin Azul: <strong>En Proceso</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span class="text-sm text-gray-600">Pin Verde: <strong>Resuelto</strong></span>
            </div>
          </div>
        </div>
        
        <!-- Reportes recientes -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div class="bg-[#14392b] px-4 py-3">
            <p class="text-white font-bold text-sm uppercase">Reportes Recientes</p>
          </div>
          <div v-if="cargando" class="p-4 text-center text-gray-400 text-sm">Cargando...</div>
          <div v-else class="divide-y">
            <div v-for="(r, i) in reportes" :key="i" class="p-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ r.tipo }}</p>
                  <p class="text-xs text-gray-500">{{ r.ubicacion }}</p>
                </div>
                <span :class="estadoColor(r.estado)" class="text-xs px-2 py-1 rounded-full font-semibold">
                  {{ r.estado }}
                </span>
              </div>
            </div>
            <div v-if="reportes.length === 0" class="p-4 text-center text-gray-400 text-sm">
              No hay reportes aún.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import { Map } from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

const reportes = ref([])
const cargando = ref(true)

const estadoColor = (estado) => {
  if (estado === 'Resuelto') return 'bg-green-100 text-green-700'
  if (estado === 'En Proceso') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-700'
}

const pinColor = (estado) => {
  if (estado === 'Resuelto') return '#22C55E'
  if (estado === 'En Proceso') return '#3B82F6'
  return '#c2a878'
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('reportes')
    .select('*')
    .eq('moderado', true)
    .order('fecha_registro', { ascending: false })
    .limit(10)

  if (!error) reportes.value = data
  cargando.value = false

  const map = L.map('mapa').setView([20.6633, -88.2442], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)

  if (!error && data) {
    data.forEach((r) => {
      if (r.latitud && r.longitud) {
        const icono = L.circleMarker([r.latitud, r.longitud], {
          radius: 10,
          fillColor: pinColor(r.estado),
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map)

        icono.bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <strong style="color:#14392b">${r.tipo}</strong><br/>
            <span style="font-size:12px;color:#666">${r.ubicacion}</span><br/>
            <span style="font-size:12px;font-weight:bold;color:${pinColor(r.estado)}">
              ● ${r.estado}
            </span>
          </div>
        `)
      }
    })
  }
})
</script>