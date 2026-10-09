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
                <div v-if="folioGenerado" class="mt-2">
                  <p>Tu número de folio es:</p>
                  <div class="flex items-center gap-2 mt-1 flex-wrap">
                    <code class="bg-white border border-green-300 rounded px-2 py-1 text-xs break-all">{{ folioGenerado }}</code>
                    <button type="button" @click="copiarFolio" class="text-xs font-semibold underline hover:no-underline shrink-0">
                      {{ folioCopiado ? '¡Copiado!' : 'Copiar' }}
                    </button>
                  </div>
                  <p class="mt-1">
                    Guárdalo (o cópialo) para darle seguimiento en
                    <RouterLink to="/seguimiento" class="underline font-semibold">Seguimiento de Reporte</RouterLink>.
                  </p>
                </div>
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
                {{ cargando ? 'Enviando...' : 'Guardar Reporte' }}
              </button>
            </div>

            <!-- Barra de progreso de envío -->
            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="etapaEnvio" class="mt-5 bg-[#f7f4ed] border border-[#e8dcc4] rounded-xl p-4">
                <!-- Pasos -->
                <div class="flex items-center justify-between mb-3">
                  <template v-for="(paso, i) in [
                    { id: 'preparando', label: 'Preparando' },
                    { id: 'subiendo', label: 'Subiendo' },
                    { id: 'guardando', label: 'Guardando' },
                    { id: 'completado', label: 'Enviado' },
                  ]" :key="paso.id">
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-300"
                        :class="{
                          'bg-[#14392b] text-white': estadoEtapa(paso.id) === 'hecho',
                          'bg-[#c2a878] text-white shadow-[0_0_0_4px_rgba(194,168,120,0.25)]': estadoEtapa(paso.id) === 'activo',
                          'bg-gray-200 text-gray-400': estadoEtapa(paso.id) === 'pendiente',
                        }">
                        <Check v-if="estadoEtapa(paso.id) === 'hecho'" :size="12" />
                        <span v-else>{{ i + 1 }}</span>
                      </div>
                      <span class="text-[10px] font-semibold uppercase tracking-wide text-center leading-tight"
                        :class="estadoEtapa(paso.id) === 'pendiente' ? 'text-gray-400' : 'text-[#14392b]'">
                        {{ paso.label }}
                      </span>
                    </div>
                    <div v-if="i < 3" class="h-0.5 flex-1 -mt-4 transition-colors duration-300"
                      :class="estadoEtapa(paso.id) === 'hecho' ? 'bg-[#14392b]' : 'bg-gray-200'"></div>
                  </template>
                </div>

                <!-- Barra -->
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-xs font-semibold text-[#14392b]">{{ etiquetaEtapa() }}</span>
                  <span v-if="etapaEnvio === 'subiendo'" class="text-xs font-bold text-[#a8824f]">{{ progresoSubida }}%</span>
                </div>
                <div class="h-2.5 w-full bg-white border border-[#e8dcc4] rounded-full overflow-hidden">
                  <div v-if="etapaEnvio === 'subiendo'"
                    class="h-full rounded-full transition-[width] duration-150 ease-out"
                    style="background: linear-gradient(90deg, #14392b, #c2a878)"
                    :style="{ width: progresoSubida + '%' }"></div>
                  <div v-else-if="etapaEnvio === 'completado'"
                    class="h-full w-full rounded-full bg-green-500 transition-all duration-300"></div>
                  <div v-else class="h-full w-full rounded-full barra-indeterminada"></div>
                </div>
              </div>
            </transition>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase, supabaseUrl, supabaseKey } from '../supabase.js'
import { CheckCircle2, XCircle, AlertTriangle, LocateFixed, Camera, Check } from 'lucide-vue-next'
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
const folioCopiado = ref(false)

const copiarFolio = async () => {
  if (!folioGenerado.value) return
  try {
    await navigator.clipboard.writeText(folioGenerado.value)
    folioCopiado.value = true
    setTimeout(() => { folioCopiado.value = false }, 2000)
  } catch {
    // Clipboard API no disponible (navegador viejo o sin permiso); el
    // folio ya está visible y seleccionable a mano como respaldo.
  }
}

// --- Progreso de envío ---
// etapaEnvio: '' | 'preparando' | 'subiendo' | 'guardando' | 'completado'
// progresoSubida: 0-100, porcentaje REAL (de xhr.upload.onprogress), solo
// tiene sentido durante la etapa "subiendo". Las demás etapas no tienen una
// forma honesta de medirse en %, así que se muestran como indeterminadas.
const ETAPAS_ENVIO = ['preparando', 'subiendo', 'guardando', 'completado']
const etapaEnvio = ref('')
const progresoSubida = ref(0)

const estadoEtapa = (paso) => {
  const actual = ETAPAS_ENVIO.indexOf(etapaEnvio.value)
  const este = ETAPAS_ENVIO.indexOf(paso)
  if (actual === -1) return 'pendiente'
  if (este < actual) return 'hecho'
  if (este === actual) return 'activo'
  return 'pendiente'
}

const etiquetaEtapa = () => {
  switch (etapaEnvio.value) {
    case 'preparando': return 'Preparando fotografía...'
    case 'subiendo': return 'Subiendo fotografía...'
    case 'guardando': return 'Guardando reporte...'
    case 'completado': return 'Reporte enviado correctamente'
    default: return ''
  }
}

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

// Detecta una sola vez si el navegador realmente sabe codificar WebP
// (algunos navegadores viejos aceptan el mimeType pero regresan PNG sin
// avisar, por eso se verifica blob.type después de pedirlo).
let soportaWebpCache = null
const soportaWebp = () => {
  if (soportaWebpCache != null) return Promise.resolve(soportaWebpCache)
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1; canvas.height = 1
    canvas.toBlob((blob) => {
      soportaWebpCache = !!blob && blob.type === 'image/webp'
      resolve(soportaWebpCache)
    }, 'image/webp')
  })
}

// Vuelve a dibujar la imagen en un canvas y la reexporta (WebP si el
// navegador lo soporta de verdad, si no JPEG): esto normaliza por completo
// el archivo —ya no depende del nombre, extensión ni metadatos originales—
// y de paso lo comprime. Usa createObjectURL en vez de leer el archivo como
// base64, que es más rápido y no infla la memoria con una cadena enorme.
// Rechaza con un mensaje claro si el archivo está dañado o no es una
// imagen real.
const comprimirFoto = async (file, maxAncho = 1280, calidad = 0.75) => {
  const usarWebp = await soportaWebp()
  const objectUrl = URL.createObjectURL(file)

  try {
    return await new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida o está dañado.'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let ancho = img.width, alto = img.height
        if (ancho > maxAncho) { alto = Math.round((alto * maxAncho) / ancho); ancho = maxAncho }
        canvas.width = ancho
        canvas.height = alto
        canvas.getContext('2d').drawImage(img, 0, 0, ancho, alto)

        const tipoSalida = usarWebp ? 'image/webp' : 'image/jpeg'
        const extension = usarWebp ? 'webp' : 'jpg'

        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('No se pudo procesar la fotografía.')); return }
          console.log(`Foto optimizada: ${(file.size / 1024).toFixed(0)} KB → ${(blob.size / 1024).toFixed(0)} KB (${tipoSalida})`)
          // Nombre 100% generado por nosotros: uuid + extensión fija, sin
          // rastro del nombre/caracteres del archivo original.
          resolve(new File([blob], `${crypto.randomUUID()}.${extension}`, { type: tipoSalida }))
        }, tipoSalida, calidad)
      }
      img.src = objectUrl
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

// Sube la foto ya comprimida con nombre único y seguro (solo [a-z0-9-.]),
// reportando progreso REAL de la transferencia vía XMLHttpRequest. El
// cliente supabase-js normal usa fetch internamente, y fetch no expone
// progreso de subida en ningún navegador (solo de descarga), así que para
// esta única petición se arma a mano la misma llamada que hace storage-js:
// POST {url}/object/{bucket}/{ruta} con FormData (campo "cacheControl" +
// el archivo en un campo sin nombre) y los mismos headers de apikey/auth
// que ya usa el resto del sitio. upsert:false evita sobrescribir un
// archivo existente ante una colisión de nombre (prácticamente imposible
// con uuid, pero así falla en vez de pisar una foto ajena).
const subirFotoReporte = (archivoComprimido, onProgreso) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('cacheControl', '3600')
    formData.append('', archivoComprimido)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/reportes/${archivoComprimido.name}`)
    xhr.setRequestHeader('apikey', supabaseKey)
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`)
    xhr.setRequestHeader('x-upsert', 'false')

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgreso) {
        onProgreso(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgreso?.(100)
        resolve(archivoComprimido.name)
        return
      }
      let mensaje = 'No se pudo subir la fotografía.'
      try {
        const cuerpo = JSON.parse(xhr.responseText)
        if (cuerpo?.message) mensaje = cuerpo.message
      } catch { /* respuesta no era JSON, se usa el mensaje genérico */ }
      reject(new Error(mensaje))
    }

    xhr.onerror = () => reject(new Error('Error de conexión al subir la fotografía.'))

    xhr.send(formData)
  })
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
  progresoSubida.value = 0

  // Paso 1: comprimir y normalizar la fotografía. No tiene una forma
  // honesta de medirse en %, así que la barra se ve "indeterminada" aquí.
  etapaEnvio.value = 'preparando'
  let archivoListo
  try {
    archivoListo = await comprimirFoto(fotoArchivo.value)
  } catch (e) {
    cargando.value = false
    error.value = true
    etapaEnvio.value = ''
    errorFoto.value = e.message || 'No se pudo procesar la fotografía. Intenta con otra imagen.'
    return
  }

  // Paso 2: subir a Storage con progreso real (xhr.upload.onprogress). La
  // foto es obligatoria, así que si esto falla se detiene todo aquí y no se
  // guarda ningún reporte (evita reportes sin evidencia).
  etapaEnvio.value = 'subiendo'
  let foto_url
  try {
    foto_url = await subirFotoReporte(archivoListo, (pct) => { progresoSubida.value = pct })
  } catch (e) {
    cargando.value = false
    error.value = true
    etapaEnvio.value = ''
    errorFoto.value = e.message || 'No se pudo subir la fotografía. Verifica tu conexión e intenta de nuevo.'
    console.log('Error subiendo foto a Storage:', e)
    return
  }

  // Paso 3: insertar el reporte. El folio se genera en el navegador (no se
  // pide de vuelta con .select()) porque la política RLS de "reportes" solo
  // permite INSERT al visitante anónimo, no SELECT. Tampoco tiene una forma
  // honesta de medirse en %: es una sola petición breve.
  etapaEnvio.value = 'guardando'
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
    etapaEnvio.value = ''
    console.log('Error Supabase:', err)
    // La foto ya se subió pero el reporte no se guardó: se borra para no
    // dejar un archivo huérfano en Storage sin reporte asociado.
    await supabase.storage.from('reportes').remove([foto_url])
    return
  }

  // Solo aquí, con la foto Y el reporte ya confirmados en la base de
  // datos, se marca la etapa final al 100%.
  etapaEnvio.value = 'completado'
  exito.value = true
  folioGenerado.value = folio
  form.value = { tipo: '', nombre: '', descripcion: '', ubicacion: '', telefono: '', latitud: null, longitud: null }
  fotoPreview.value = null
  fotoArchivo.value = null
  if (marker) { map.removeLayer(marker); marker = null }
}
</script>

<style scoped>
/* Franja animada para las etapas "Preparando" y "Guardando": no hay forma
   honesta de medirlas en %, así que se muestran como progreso indeterminado
   en vez de inventar un número. */
.barra-indeterminada {
  background-image: repeating-linear-gradient(135deg, #14392b 0, #14392b 10px, #c2a878 10px, #c2a878 20px);
  background-size: 200% 100%;
  animation: desplazar-rayas 1s linear infinite;
  opacity: 0.8;
}

@keyframes desplazar-rayas {
  from { background-position: 0 0; }
  to { background-position: -28px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .barra-indeterminada { animation: none; }
}
</style>