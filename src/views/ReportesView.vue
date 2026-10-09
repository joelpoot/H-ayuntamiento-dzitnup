<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-8 border-l-4 border-[#c2a878] relative">
      <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl bg-[#c2a878]/15 flex items-center justify-center shrink-0">
        <AlertTriangle :size="24" class="text-black" />
        </div>
        <div>
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Reportes Ciudadanos</h1>
      <p class="text-[#c2a878] text-sm mt-1">Reporta un problema en tu comunidad</p>
    </div>
  </div>
</div>

    <!-- Formulario -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="flex">
          <div class="w-1 bg-[#c2a878]"></div>
          <div class="flex-1 p-6">

            <h2 class="text-[#14392b] font-bold text-lg mb-6">Formulario de Reporte</h2>

            <!-- Mensaje de éxito -->
            <div v-if="exito" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <CheckCircle2 :size="18" class="shrink-0 mt-0.5" />
              <div>
                <p>Reporte enviado correctamente. Será revisado por el administrador antes de publicarse.</p>
                <p v-if="folioGenerado" class="mt-1">
                  Tu número de folio es <strong class="break-all">{{ folioGenerado }}</strong>. Guárdalo para darle seguimiento en
                  <RouterLink to="/seguimiento" class="underline font-semibold">Seguimiento de Reporte</RouterLink>.
                </p>
              </div>
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <XCircle :size="18" class="shrink-0" />
              Ocurrió un error al enviar el reporte. Intenta de nuevo.
            </div>

            <!-- Mensaje de validación -->
            <div v-if="errorValidacion" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertTriangle :size="18" class="shrink-0" />
              {{ errorValidacion }}
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
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre del Reportante</label>
                <input v-model="form.nombre" type="text"
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
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Número de teléfono para darle seguimiento a su reporte <span class="text-red-500">*</span></label>
                <input v-model="form.telefono" @input="filtrarTelefono" type="tel" maxlength="10" placeholder="Ej. 9851122334"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                <p v-if="errorTelefono" class="text-xs text-red-500 mt-1">{{ errorTelefono }}</p>
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
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Punto de Referencia del Lugar</label>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <input v-model="form.ubicacion" type="text"
                  placeholder="Ej. Frente a la escuela, cerca de la iglesia ..."
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#14392b]" />
                <input :value="form.latitud ? `${form.latitud}, ${form.longitud}` : ''" disabled placeholder="Coordenadas seleccionadas"
                  class="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" />
              </div>

              <p v-if="errorArea" class="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle :size="14" class="shrink-0" />{{ errorArea }}
              </p>
              <p class="text-xs text-gray-400 mt-1 italic">Describe el lugar con una referencia conocida (una casa, negocio, escuela, etc.) y marca el punto exacto tocando el mapa. Tu ubicación no será compartida públicamente.</p>

              <div id="mapaReporte" class="mt-3 h-64 w-full rounded-lg border border-gray-300 z-0"></div>

              <button @click="obtenerUbicacion" type="button"
                class="mt-3 bg-[#c2a878] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#a8916a] transition-colors flex items-center gap-1.5">
                <LocateFixed :size="14" />Usar mi ubicación actual
              </button>
              <p class="text-xs text-gray-400 mt-2 italic">Usa este botón si estás en el lugar del reporte; así el mapa marcará tu ubicación exacta automáticamente.</p>
            </div>

            <!-- Foto -->
            <div class="mt-6">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Foto Adjunta del Problema <span class="text-red-500">*</span></label>
              <div @click="$refs.inputFoto.click()"
                class="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-[#14392b] transition-colors overflow-hidden">
                <img v-if="fotoPreview" :src="fotoPreview" class="h-full w-full object-cover" />
                <span v-else class="flex items-center gap-1.5"><Camera :size="16" />Subir imagen desde tu dispositivo</span>
              </div>
              <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoChange" />
              <p v-if="errorFoto" class="text-xs text-red-500 mt-1">{{ errorFoto }}</p>
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
import { CheckCircle2, XCircle, AlertTriangle, LocateFixed, Camera } from 'lucide-vue-next'
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

const cargando = ref(false)
const exito = ref(false)
const error = ref(false)
const errorValidacion = ref('')
const errorTelefono = ref('')
const folioGenerado = ref(null)

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

const CENTRO_DZITNUP = [20.6471, -88.2448]
const errorArea = ref('')

// Rectángulo ajustado al polígono real de Dzitnup (centro del pueblo + margen ~1.5km)
const LIMITES_DZITNUP = L.latLngBounds(
  [20.6320, -88.2620], // esquina suroeste
  [20.6620, -88.2270]  // esquina noreste
)

const dentroDelArea = (lat, lng) => {
  return LIMITES_DZITNUP.contains([lat, lng])
}

const colocarPin = (lat, lng) => {
  if (!dentroDelArea(lat, lng)) {
    errorArea.value = 'Esa ubicación está fuera del área de Dzitnup. Por favor marca un punto dentro de la comunidad.'
    return
  }
  errorArea.value = ''

  form.value.latitud = lat.toFixed(6)
  form.value.longitud = lng.toFixed(6)

  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      if (!dentroDelArea(pos.lat, pos.lng)) {
        errorArea.value = 'Esa ubicación está fuera del área de Dzitnup. Por favor mueve el pin dentro de la comunidad.'
        // Regresa el pin a la última posición válida
        marker.setLatLng([form.value.latitud, form.value.longitud])
        return
      }
      errorArea.value = ''
      form.value.latitud = pos.lat.toFixed(6)
      form.value.longitud = pos.lng.toFixed(6)
    })
  }
  map.setView([lat, lng], 16)
}

const obtenerUbicacion = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      colocarPin(pos.coords.latitude, pos.coords.longitude)
    })
  }
}

const filtrarTelefono = () => {
  form.value.telefono = form.value.telefono.replace(/\D/g, '').slice(0, 10)
}

onMounted(() => {
  map = L.map('mapaReporte', {
    maxBounds: LIMITES_DZITNUP.pad(0.1),
    maxBoundsViscosity: 1.0,
    minZoom: 13
  }).setView(CENTRO_DZITNUP, 14)
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
const errorFoto = ref('')

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

const onFotoChange = (e) => {
  errorFoto.value = ''
  const file = e.target.files[0]
  if (!file) return

  if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.type)) {
    errorFoto.value = 'Formato no admitido. Sube una foto en JPG, PNG, WEBP o GIF.'
    e.target.value = ''
    fotoArchivo.value = null
    fotoPreview.value = null
    return
  }

  fotoArchivo.value = file
  fotoPreview.value = URL.createObjectURL(file)
}

// Vuelve a dibujar la imagen en un canvas y la reexporta como JPEG: esto
// normaliza por completo el archivo (ya no depende del nombre, extensión
// ni metadatos originales) y de paso lo comprime. Rechaza con un mensaje
// claro si el archivo está dañado o no es una imagen real.
const comprimirFoto = (file, maxAncho = 1280, calidad = 0.75) => {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer el archivo de la fotografía.'))
    lector.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida o está dañado.'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let ancho = img.width, alto = img.height
        if (ancho > maxAncho) { alto = Math.round((alto * maxAncho) / ancho); ancho = maxAncho }
        canvas.width = ancho
        canvas.height = alto
        canvas.getContext('2d').drawImage(img, 0, 0, ancho, alto)
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('No se pudo procesar la fotografía.')); return }
          // Nombre 100% generado por nosotros: uuid + extensión fija .jpg,
          // sin rastro del nombre/caracteres del archivo original.
          resolve(new File([blob], `${crypto.randomUUID()}.jpg`, { type: 'image/jpeg' }))
        }, 'image/jpeg', calidad)
      }
      img.src = e.target.result
    }
    lector.readAsDataURL(file)
  })
}

// Sube la foto ya comprimida con nombre único y seguro (solo [a-z0-9-.]).
// upsert:false evita sobrescribir un archivo existente ante una colisión
// de nombre (prácticamente imposible con uuid, pero así falla en vez de
// pisar una foto ajena).
const subirFotoReporte = async (archivoComprimido) => {
  const { error } = await supabase.storage.from('reportes').upload(archivoComprimido.name, archivoComprimido, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) throw error
  return archivoComprimido.name
}

const guardarReporte = async () => {
  errorTelefono.value = ''
  errorFoto.value = ''

  if (!form.value.tipo || !form.value.descripcion || !form.value.latitud || !fotoArchivo.value || !form.value.telefono) {
    errorValidacion.value = 'Por favor llena los campos obligatorios: Tipo, Descripción, Ubicación en el mapa, Foto y Teléfono'
    return
  }

  if (!TIPOS_IMAGEN_PERMITIDOS.includes(fotoArchivo.value.type)) {
    errorFoto.value = 'Formato de imagen no admitido. Usa JPG, PNG, WEBP o GIF.'
    return
  }

  if (form.value.telefono.length !== 10) {
    errorTelefono.value = 'El número de teléfono debe tener exactamente 10 dígitos.'
    return
  }

  errorValidacion.value = ''

  cargando.value = true
  error.value = false
  exito.value = false

  // Paso 1: comprimir y normalizar la fotografía.
  let archivoListo
  try {
    archivoListo = await comprimirFoto(fotoArchivo.value)
  } catch (e) {
    cargando.value = false
    error.value = true
    errorFoto.value = e.message || 'No se pudo procesar la fotografía. Intenta con otra imagen.'
    return
  }

  // Paso 2: subir a Storage. La foto es obligatoria, así que si esto falla
  // se detiene todo aquí y no se guarda ningún reporte (evita reportes sin
  // evidencia, que es justo lo que el formulario exige).
  let foto_url
  try {
    foto_url = await subirFotoReporte(archivoListo)
  } catch (e) {
    cargando.value = false
    error.value = true
    errorFoto.value = 'No se pudo subir la fotografía. Verifica tu conexión e intenta de nuevo.'
    console.log('Error subiendo foto a Storage:', e)
    return
  }

  // Paso 3: insertar el reporte. El folio se genera en el navegador (no se
  // pide de vuelta con .select()) porque la política RLS de "reportes" solo
  // permite INSERT al visitante anónimo, no SELECT.
  const folio = crypto.randomUUID()

  const { error: err } = await supabase
    .from('reportes')
    .insert([{
      id: folio,
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
    // La foto ya se subió pero el reporte no se guardó: se borra para no
    // dejar un archivo huérfano en Storage sin reporte asociado.
    await supabase.storage.from('reportes').remove([foto_url])
    return
  }

  exito.value = true
  folioGenerado.value = folio
  form.value = { tipo: '', nombre: '', descripcion: '', ubicacion: '', telefono: '', latitud: null, longitud: null }
  fotoPreview.value = null
  fotoArchivo.value = null
  if (marker) { map.removeLayer(marker); marker = null }
}
</script>