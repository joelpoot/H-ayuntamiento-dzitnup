<template>
  <div>
    <!-- Login -->
    <div v-if="!autenticado" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#1a5f5a] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl font-bold">H</span>
          </div>
          <h1 class="text-xl font-bold text-[#1a5f5a]">Panel de Administración</h1>
          <p class="text-sm text-gray-500 mt-1">H. Ayuntamiento de Dzitnup</p>
        </div>

        <div v-if="errorLogin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          ❌ Credenciales incorrectas
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase">Usuario</label>
            <input v-model="loginForm.usuario" type="text" placeholder="admin"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase">Contraseña</label>
            <input v-model="loginForm.password" type="password" placeholder="••••••••"
              class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
          </div>
          <button @click="iniciarSesion"
            class="w-full bg-[#1a5f5a] text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Panel Admin -->
    <div v-else>
      <div class="bg-[#1a5f5a] px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-white text-2xl font-bold uppercase tracking-wide">⚙️ Panel de Administración</h1>
          <p class="text-green-200 text-sm mt-1">H. Ayuntamiento de Dzitnup</p>
        </div>
        <button @click="cerrarSesion" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
          Cerrar Sesión
        </button>
      </div>

      <!-- Tabs -->
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex gap-2 mb-6 flex-wrap">
          <button v-for="tab in tabs" :key="tab.id" @click="tabActivo = tab.id"
            :class="tabActivo === tab.id ? 'bg-[#1a5f5a] text-white' : 'border border-[#1a5f5a] text-[#1a5f5a] hover:bg-[#1a5f5a] hover:text-white'"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Reportes -->
        <div v-if="tabActivo === 'reportes'">
          <h2 class="text-[#1a5f5a] font-bold text-lg mb-4">Gestión de Reportes</h2>
          <div v-if="cargandoReportes" class="text-center py-6 text-gray-400">Cargando...</div>
          <div v-else class="space-y-3">
            <div v-for="r in reportes" :key="r.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-start gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-bold text-gray-800">{{ r.tipo }}</p>
                  <span :class="estadoColor(r.estado)" class="text-xs px-2 py-1 rounded-full font-semibold">{{ r.estado }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ r.descripcion }}</p>
                <p class="text-xs text-gray-400 mt-1">📍 {{ r.ubicacion }} | 📅 {{ formatFecha(r.fecha_registro) }}</p>
              </div>
              <div class="flex flex-col gap-2 shrink-0">
                <button @click="cambiarEstado(r, 'Resuelto')"
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">
                  Marcar como Resuelto
                </button>
                <button @click="cambiarEstado(r, 'En Proceso')"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors">
                  Marcar como En Proceso
                </button>
                 <button @click="cambiarEstado(r, 'Pendiente')"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-200 transition-colors">
                  Marcar como Pendiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Avisos -->
        <div v-if="tabActivo === 'avisos'">
          <h2 class="text-[#1a5f5a] font-bold text-lg mb-4">Publicar Nuevo Aviso</h2>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            <div v-if="exitoAviso" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ✅ Aviso publicado correctamente
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Título</label>
                <input v-model="nuevoAviso.titulo" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Categoría</label>
                <select v-model="nuevoAviso.categoria" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]">
                  <option>Corte de agua</option>
                  <option>Corte de luz</option>
                  <option>Obra</option>
                  <option>Evento</option>
                  <option>General</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="text-xs font-semibold text-gray-500 uppercase">Descripción</label>
                <textarea v-model="nuevoAviso.descripcion" rows="3" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]"></textarea>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Área</label>
                <input v-model="nuevoAviso.area" type="text" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Fecha de Vigencia</label>
                <input v-model="nuevoAviso.fecha_vigencia" type="date" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>
            </div>

            <div class="mt-6 text-center">
              <button @click="publicarAviso"
                class="bg-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors uppercase">
                Publicar Aviso
              </button>
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

const autenticado = ref(false)
const errorLogin = ref(false)
const tabActivo = ref('reportes')
const reportes = ref([])
const cargandoReportes = ref(true)
const exitoAviso = ref(false)

const loginForm = ref({ usuario: '', password: '' })

const tabs = [
  { id: 'reportes', label: '🚨 Reportes' },
  { id: 'avisos', label: '📢 Avisos' },
]

const nuevoAviso = ref({
  titulo: '',
  categoria: 'General',
  descripcion: '',
  area: '',
  fecha_vigencia: '',
  estado: 'Activo'
})

const iniciarSesion = () => {
  if (loginForm.value.usuario === 'admin' && loginForm.value.password === 'dzitnup2024') {
    autenticado.value = true
    errorLogin.value = false
    cargarReportes()
  } else {
    errorLogin.value = true
  }
}

const cerrarSesion = () => {
  autenticado.value = false
  loginForm.value = { usuario: '', password: '' }
}

const cargarReportes = async () => {
  cargandoReportes.value = true
  const { data, error } = await supabase
    .from('reportes')
    .select('*')
    .order('fecha_registro', { ascending: false })

  if (!error) reportes.value = data
  cargandoReportes.value = false
}

const cambiarEstado = async (reporte, nuevoEstado) => {
  const { error } = await supabase
    .from('reportes')
    .update({ estado: nuevoEstado })
    .eq('id', reporte.id)

  if (!error) {
    reporte.estado = nuevoEstado
  }
}

const publicarAviso = async () => {
  const hoy = new Date().toISOString().split('T')[0]
  const { error } = await supabase
    .from('avisos')
    .insert([{
      titulo: nuevoAviso.value.titulo,
      categoria: nuevoAviso.value.categoria,
      descripcion: nuevoAviso.value.descripcion,
      area: nuevoAviso.value.area,
      fecha_publicacion: hoy,
      fecha_vigencia: nuevoAviso.value.fecha_vigencia,
      estado: 'Activo'
    }])

  if (!error) {
    exitoAviso.value = true
    nuevoAviso.value = { titulo: '', categoria: 'General', descripcion: '', area: '', fecha_vigencia: '', estado: 'Activo' }
    setTimeout(() => exitoAviso.value = false, 3000)
  }
}

const estadoColor = (estado) => {
  if (estado === 'Resuelto') return 'bg-green-100 text-green-700'
  if (estado === 'En Proceso') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-700'
}

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX')
}
</script>