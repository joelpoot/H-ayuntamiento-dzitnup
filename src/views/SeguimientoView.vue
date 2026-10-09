<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-8 border-l-4 border-[#c2a878] relative">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#c2a878]/15 flex items-center justify-center shrink-0">
          <Search :size="24" class="text-black" />
        </div>
        <div>
          <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Seguimiento de Reporte</h1>
          <p class="text-[#c2a878] text-sm mt-1">Consulta el estado de tu reporte con tu folio y teléfono</p>
        </div>
      </div>
    </div>

    <div class="max-w-xl mx-auto px-4 py-10">
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="flex">
          <div class="w-1 bg-[#c2a878]"></div>
          <div class="flex-1 p-6">
            <h2 class="text-[#14392b] font-bold text-lg mb-4">Buscar mi reporte</h2>
            <p class="text-sm text-gray-500 mb-6">
              Ingresa el número de folio que recibiste al enviar tu reporte y el teléfono que
              registraste. Por privacidad, solo se muestra el estado si ambos datos coinciden.
            </p>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Número de folio</label>
                <input v-model="folio" type="text" placeholder="El folio que recibiste al enviar tu reporte"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono registrado</label>
                <input v-model="telefono" @input="telefono = telefono.replace(/\D/g, '').slice(0, 10)" type="tel"
                  maxlength="10" placeholder="10 dígitos"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>
            </div>

            <p v-if="errorValidacion" class="text-xs text-red-500 mt-3">{{ errorValidacion }}</p>

            <div class="mt-6 text-center">
              <button @click="buscar" :disabled="cargando"
                class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase tracking-wide disabled:opacity-50">
                {{ cargando ? 'Buscando...' : 'Consultar estado' }}
              </button>
            </div>

            <!-- No encontrado -->
            <div v-if="buscado && !resultado" class="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle :size="18" class="shrink-0" />
              No encontramos un reporte con ese folio y teléfono. Verifica los datos e intenta de nuevo.
            </div>

            <!-- Resultado -->
            <div v-if="resultado" class="mt-6 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-[#14392b] px-4 py-3 flex justify-between items-center flex-wrap gap-2">
                <p class="text-white font-bold text-sm break-all">Folio {{ resultado.id }} — {{ resultado.tipo }}</p>
                <span :class="estadoColor(resultado.estado)" class="text-xs px-3 py-1 rounded-full font-semibold">
                  {{ resultado.moderado ? resultado.estado : 'En Revisión' }}
                </span>
              </div>
              <div class="p-4 text-sm text-gray-600 space-y-2">
                <p>{{ resultado.descripcion }}</p>
                <p class="text-xs text-gray-400 flex items-center gap-1"><MapPin :size="12" />{{ resultado.ubicacion }}</p>
                <p class="text-xs text-gray-400 flex items-center gap-1"><Calendar :size="12" />{{ formatFecha(resultado.fecha_registro) }}</p>
                <p v-if="!resultado.moderado" class="text-xs text-gray-400 italic mt-2">
                  Tu reporte aún está en revisión por el administrador antes de asignarse a un área para su atención.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase.js'
import { Search, AlertTriangle, MapPin, Calendar } from 'lucide-vue-next'

const folio = ref('')
const telefono = ref('')
const cargando = ref(false)
const buscado = ref(false)
const resultado = ref(null)
const errorValidacion = ref('')

const buscar = async () => {
  errorValidacion.value = ''
  resultado.value = null
  buscado.value = false

  if (!folio.value.trim()) {
    errorValidacion.value = 'Ingresa tu número de folio.'
    return
  }
  if (telefono.value.length !== 10) {
    errorValidacion.value = 'El teléfono debe tener exactamente 10 dígitos.'
    return
  }

  cargando.value = true
  const { data, error } = await supabase.rpc('buscar_reporte_folio', {
    p_folio: folio.value.trim(),
    p_telefono: telefono.value,
  })
  cargando.value = false
  buscado.value = true

  if (!error && data && data.length > 0) {
    resultado.value = data[0]
  }
}

const estadoColor = (estado) => {
  if (estado === 'Resuelto') return 'bg-green-100 text-green-700'
  if (estado === 'En Proceso') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-700'
}

const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-MX') : ''
</script>
