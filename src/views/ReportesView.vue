<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Reportes Ciudadanos</h1>
      <p class="text-[#c2a878] text-sm mt-1">Reporta un problema en tu comunidad</p>
    </div>

    <!-- Formulario -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="flex">
          <div class="w-1 bg-[#c2a878]"></div>
          <div class="flex-1 p-6">

            <h2 class="text-[#14392b] font-bold text-lg mb-6">Formulario de Reporte</h2>

            <!-- Mensaje de éxito -->
            <div v-if="exito" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              ✅ Reporte enviado correctamente. Será revisado por el administrador antes de publicarse.
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              ❌ Ocurrió un error al enviar el reporte. Intenta de nuevo.
            </div>

            <!-- Mensaje de validación -->
            <div v-if="errorValidacion" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4">
              ⚠️ {{ errorValidacion }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Tipo de reporte -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo de Reporte</label>
                <select v-model="form.tipo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]">
                  <option value="">Seleccionar...</option>
                  <option>Fuga de agua</option>
                  <option>Alumbrado</option>
                  <option>Bache</option>
                  <option>Basura</option>
                  <option>Seguridad</option>
                  <option>Otro</option>
                </select>
              </div>

              <!-- Nombre -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre del Reportante (Opcional)</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Pedro Ucán Tun"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>

              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Descripción Detallada</label>
                <textarea v-model="form.descripcion" rows="3" placeholder="Describe el problema con detalle..."
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]"></textarea>
              </div>

              <!-- Teléfono -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono / Correo Electrónico <span class="text-red-500">*</span></label>
                <input v-model="form.telefono" type="text" placeholder="Ej. 9851122334"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
              </div>

              <!-- Fecha -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha de Registro</label>
                <input type="text" :value="fechaHoy" disabled
                  class="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" />
              </div>

            </div>

            <!-- Localización -->
            <div class="mt-6">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Localización</label>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <div class="flex gap-2">
                  <input v-model="direccionBusqueda" @keyup.enter="buscarDireccion" type="text"
                    placeholder="Escribe la calle o referencia y presiona Buscar"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                  <button @click="buscarDireccion" :disabled="buscando" type="button"
                    class="bg-[#14392b] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0a1f17] transition-colors disabled:opacity-50 shrink-0">
                    {{ buscando ? 'Buscando...' : 'Buscar' }}
                  </button>
                </div>
                <input :value="form.latitud ? `${form.latitud}, ${form.longitud}` : ''" disabled placeholder="Coordenadas seleccionadas"
                  class="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" />
              </div>

              <p v-if="errorBusqueda" class="text-xs text-red-500 mt-1">{{ errorBusqueda }}</p>
              <p class="text-xs text-gray-400 mt-1 italic">Puedes arrastrar el pin en el mapa para ajustar la ubicación exacta. Tu ubicación no será compartida públicamente.</p>

              <div id="mapaReporte" class="mt-3 h-64 w-full rounded-lg border border-gray-300 z-0"></div>

              <button @click="obtenerUbicacion" type="button"
                class="mt-3 bg-[#c2a878] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#a8916a] transition-colors">
                📌 Usar mi ubicación actual
              </button>
            </div>

            <!-- Foto -->
            <div class="mt-6">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Foto Adjunta del Problema <span class="text-red-500">*</span></label>
              <div @click="$refs.inputFoto.click()"
                class="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-[#14392b] transition-colors overflow-hidden">
                <img v-if="fotoPreview" :src="fotoPreview" class="h-full w-full object-cover" />
                <span v-else>📷 Subir imagen desde tu dispositivo</span>
              </div>
              <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoChange" />
            </div>

            <!-- Botón guardar -->
            <div class="mt-6 text-center">
              <button @click="guardarReporte" :disabled="cargando"
                class="bg-[#c2a878] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#a8916a] transition-colors uppercase tracking-wide disabled:opacity-50">
                {{ cargando ? 'Guardando...' : 'Guardar Reporte' }}
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
import { useRouter } from 'vue-router'
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

const router = useRouter()

const cargando = ref(false)
const exito = ref(false)
const error = ref(false)
const errorValidacion = ref('')

const fechaHoy = new Date().toLocaleDateString('es-MX', {
  day: '2-digit', month: '2-digit', year: 'numeric'
})

const form = ref({
  tipo: '',
  nombre: '',
  descripcion: '',
  ubicacion: '',
  telefono: '',
  latitud: null,
  longitud: null,
})

// --- Mapa ---
let map = null
let marker = null
const direccionBusqueda = ref('')
const buscando = ref(false)
const errorBusqueda = ref('')

const CENTRO_DZITNUP = [20.6633, -88.2442]

const colocarPin = (lat, lng) => {
  form.value.latitud = lat.toFixed(6)
  form.value.longitud = lng.toFixed(6)

  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      form.value.latitud = pos.lat.toFixed(6)
      form.value.longitud = pos.lng.toFixed(6)
    })
  }
  map.setView([lat, lng], 16)
}

const buscarDireccion = async () => {
  if (!direccionBusqueda.value.trim()) return
  errorBusqueda.value = ''
  buscando.value = true
  form.value.ubicacion = direccionBusqueda.value

  try {
    const query = `${direccionBusqueda.value}, Dzitnup, Valladolid, Yucatán, México`
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data = await res.json()

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      colocarPin(lat, lng)
    } else {
      // No se encontró la dirección exacta: centramos en Dzitnup con buen zoom
      // para que el usuario marque el punto manualmente.
      map.setView(CENTRO_DZITNUP, 17)
      errorBusqueda.value = 'No pudimos ubicar esa dirección automáticamente. Por favor, toca el punto exacto en el mapa de abajo para marcar dónde está el problema.'
    }
  } catch (e) {
    errorBusqueda.value = 'Error al buscar la dirección. Intenta de nuevo o marca el punto directamente en el mapa.'
  } finally {
    buscando.value = false
  }
}

const obtenerUbicacion = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      colocarPin(pos.coords.latitude, pos.coords.longitude)
    })
  }
}

onMounted(() => {
  map = L.map('mapaReporte').setView(CENTRO_DZITNUP, 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)

  map.on('click', (e) => {
    colocarPin(e.latlng.lat, e.latlng.lng)
  })
})

// --- Foto ---
const fotoPreview = ref(null)
const fotoArchivo = ref(null)

const onFotoChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    fotoArchivo.value = file
    fotoPreview.value = URL.createObjectURL(file)
  }
}

const guardarReporte = async () => {
  if (!form.value.tipo || !form.value.descripcion || !form.value.latitud || !fotoArchivo.value || !form.value.telefono) {
    errorValidacion.value = 'Por favor llena los campos obligatorios: Tipo, Descripción, Ubicación en el mapa, Foto y Teléfono/Correo'
    return
  }
  errorValidacion.value = ''

  cargando.value = true
  error.value = false
  exito.value = false

  let foto_url = null

  if (fotoArchivo.value) {
    const archivo = fotoArchivo.value
    const nombreArchivo = `${Date.now()}_${archivo.name}`

    const { error: uploadError } = await supabase.storage
      .from('reportes')
      .upload(nombreArchivo, archivo)

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('reportes')
        .getPublicUrl(nombreArchivo)
      foto_url = urlData.publicUrl
    }
  }

  const { error: err } = await supabase
    .from('reportes')
    .insert([{
      tipo: form.value.tipo,
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      ubicacion: form.value.ubicacion || `${form.value.latitud}, ${form.value.longitud}`,
      telefono: form.value.telefono,
      latitud: form.value.latitud,
      longitud: form.value.longitud,
      foto_url: foto_url,
      estado: 'En Revisión',
      moderado: false
    }])

  cargando.value = false

  if (err) {
    error.value = true
    console.log('Error Supabase:', err)
  } else {
    exito.value = true
    form.value = { tipo: '', nombre: '', descripcion: '', ubicacion: '', telefono: '', latitud: null, longitud: null }
    fotoPreview.value = null
    fotoArchivo.value = null
    direccionBusqueda.value = ''
    if (marker) { map.removeLayer(marker); marker = null }
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
}
</script>