<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative h-90 flex items-center justify-center overflow-hidden">
      <img src="/Cenote-Dzitnup-Valladolid-001.jpg" class="absolute inset-0 w-full h-full object-cover object-center" style="object-position: center 69%" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#1a5f5a]/40 to-[#0f3d3a]/60"></div>
      <div class="relative text-center text-white px-4">
        <h1 class="text-4xl font-bold tracking-wide">COMISARIA MUNICIPAL DE DZITNUP, YUCATÁN</h1>
        <p class="mt-2 text-yellow-200 text-lg">Administración 2024 - 2027</p>
        <div class="mt-4 w-16 h-1 bg-[#F5A623] mx-auto rounded"></div>
      </div>
    </div>

    <!-- Grid de módulos -->
    <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Avisos y Noticias -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3 flex items-center gap-2">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📢 Avisos y Noticias</span>
        </div>
        <div class="p-4">
          <div v-if="ultimoAviso" class="flex items-center gap-3 mb-3">
            <div class="bg-[#1a5f5a] text-white rounded-lg px-3 py-2 text-center">
              <p class="text-xl font-bold">{{ formatDia(ultimoAviso.fecha_publicacion) }}</p>
              <p class="text-xs">{{ formatMes(ultimoAviso.fecha_publicacion) }}</p>
            </div>
            <div>
              <p class="font-bold text-sm text-gray-800">{{ ultimoAviso.titulo }}</p>
              <p class="text-xs text-gray-500">{{ ultimoAviso.descripcion }}</p>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400 mb-3">No hay avisos recientes.</div>
          <RouterLink to="/avisos" class="text-[#F5A623] text-sm font-semibold hover:underline">Ver todos los avisos →</RouterLink>
        </div>
      </div>

      <!-- Reportes Ciudadanos -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🚨 Reportes Ciudadanos</span>
        </div>
        <div class="p-4 flex flex-col items-center justify-center gap-4">
          <p class="text-gray-600 text-sm text-center">¿Detectaste un problema en tu comunidad? Repórtalo aquí.</p>
          <RouterLink to="/reportes"
            class="bg-[#F5A623] text-white font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            📝 Enviar un Reporte
          </RouterLink>
        </div>
      </div>

      <!-- Agenda Comunitaria -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📅 Agenda Comunitaria</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="evento in proximosEventos" :key="evento.id" class="flex gap-3 items-start">
            <div class="bg-[#1a5f5a] text-white rounded-lg px-3 py-2 text-center min-w-[48px]">
              <p class="text-xl font-bold">{{ formatDia(evento.fecha) }}</p>
              <p class="text-xs">{{ formatMes(evento.fecha) }}</p>
            </div>
            <div>
              <p class="font-bold text-sm text-gray-800">{{ evento.titulo }}</p>
              <p class="text-xs text-gray-500">{{ evento.lugar }}</p>
            </div>
          </div>
          <div v-if="proximosEventos.length === 0" class="text-xs text-gray-400">No hay eventos próximos.</div>
          <RouterLink to="/agenda" class="text-[#F5A623] text-sm font-semibold hover:underline">Ver agenda completa →</RouterLink>
        </div>
      </div>

      <!-- Horarios de Atención -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🕐 Horarios de Atención</span>
        </div>
        <div class="p-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-gray-500 text-xs border-b">
                <th class="text-left pb-2">Área</th>
                <th class="text-left pb-2">Días</th>
                <th class="text-left pb-2">Horario</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in horariosPreview" :key="h.id" class="border-b border-gray-50">
                <td class="py-2 font-medium">{{ h.area }}</td>
                <td class="py-2 text-gray-500">{{ h.dias }}</td>
                <td class="py-2 text-gray-500">{{ h.hora_entrada }} - {{ h.hora_salida }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Directorio Municipal -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📞 Directorio Municipal</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(persona, i) in directorioPreview" :key="persona.id"
            :class="i < directorioPreview.length - 1 ? 'border-b pb-3' : ''"
            class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
              {{ persona.iniciales }}
            </div>
            <div>
              <p class="font-bold text-sm">{{ persona.nombre }}</p>
              <p class="text-xs text-[#F5A623] font-semibold">{{ persona.cargo }}</p>
              <p class="text-xs text-gray-500">📞 {{ persona.telefono }}</p>
            </div>
          </div>
          <div v-if="directorioPreview.length === 0" class="text-xs text-gray-400">Sin contactos registrados.</div>
        </div>
      </div>

      <!-- Galería -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🖼️ Galería</span>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-3 gap-2">
            <div v-for="foto in galeriaPreview" :key="foto.id"
              class="rounded-lg h-20 overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="foto.imagen_url" :src="foto.imagen_url" class="w-full h-full object-cover" />
              <span v-else class="text-xs text-gray-400 text-center px-1">{{ foto.titulo }}</span>
            </div>
            <div v-for="n in Math.max(0, 3 - galeriaPreview.length)" :key="'empty-' + n"
              class="bg-gray-200 rounded-lg h-20"></div>
          </div>
          <RouterLink to="/galeria" class="text-[#F5A623] text-sm font-semibold hover:underline mt-3 block">Ver galería completa →</RouterLink>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="bg-[#1a5f5a] text-white mt-10 py-6 px-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span>📞</span>
          <div>
            <p>Contacto: ayuntamiento@dzitnup.gob.mx</p>
            <p class="text-green-200">985-100-2211</p>
          </div>
        </div>
        <div class="flex gap-4 text-green-200">
          <span class="cursor-pointer hover:text-white">Facebook</span>
        </div>
        <div class="flex items-center gap-2">
          <span>📍</span>
          <div>
            <p>Calle Principal S/N</p>
            <p class="text-green-200">Dzitnup, Yucatán</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../supabase.js'

const ultimoAviso = ref(null)
const proximosEventos = ref([])
const horariosPreview = ref([])
const directorioPreview = ref([])
const galeriaPreview = ref([])

const formatDia = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).getUTCDate().toString().padStart(2, '0')
}

const formatMes = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()
}

onMounted(async () => {
  // Último aviso activo
  const { data: avisos } = await supabase
    .from('avisos')
    .select('*')
    .eq('estado', 'Activo')
    .order('fecha_publicacion', { ascending: false })
    .limit(1)
  if (avisos && avisos.length > 0) ultimoAviso.value = avisos[0]

  // Próximos 2 eventos
  const hoy = new Date().toISOString().split('T')[0]
  const { data: eventos } = await supabase
    .from('agenda')
    .select('*')
    .gte('fecha', hoy)
    .order('fecha', { ascending: true })
    .limit(2)
  if (eventos) proximosEventos.value = eventos

  // Primeros 3 horarios
  const { data: horarios } = await supabase
    .from('horarios')
    .select('*')
    .order('area', { ascending: true })
    .limit(3)
  if (horarios) horariosPreview.value = horarios

  // Primeros 2 contactos
  const { data: directorio } = await supabase
    .from('directorio')
    .select('*')
    .order('area', { ascending: true })
    .limit(2)
  if (directorio) directorioPreview.value = directorio

  // Últimas 3 fotos de galería
  const { data: galeria } = await supabase
    .from('galeria')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(3)
  if (galeria) galeriaPreview.value = galeria
})
</script>