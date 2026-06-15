<template>
  <div>
    <!-- Header -->
    <div class="bg-[#1a5f5a] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">🚨 Reportes Ciudadanos</h1>
      <p class="text-green-200 text-sm mt-1">Reporta un problema en tu comunidad</p>
    </div>

    <!-- Formulario -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="flex">
          <div class="w-1 bg-[#F5A623]"></div>
          <div class="flex-1 p-6">

            <h2 class="text-[#1a5f5a] font-bold text-lg mb-6">Formulario de Reporte</h2>

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
                <select v-model="form.tipo" class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]">
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
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>

              <!-- Descripción -->
              <div class="md:col-span-2">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Descripción Detallada</label>
                <textarea v-model="form.descripcion" rows="3" placeholder="Describe el problema con detalle..."
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]"></textarea>
              </div>

              <!-- Ubicación -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ubicación (Calle o Referencia)</label>
                <input v-model="form.ubicacion" type="text" placeholder="Ej. Calle 12 s/n x 15, frente al parque"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>

              <!-- Teléfono -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono / Correo Electrónico</label>
                <input v-model="form.telefono" type="text" placeholder="Ej. 9851122334"
                  class="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a5f5a]" />
              </div>

              <!-- Fecha -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha de Registro</label>
                <input type="text" :value="fechaHoy" disabled
                  class="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" />
              </div>

              <!-- Estado -->
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado Inicial</label>
                <div class="mt-1 w-full border border-[#F5A623] bg-yellow-50 rounded-lg px-3 py-2 text-sm text-[#F5A623] font-semibold">
                  ⏳ En Revisión
                </div>
              </div>

            </div>

            <!-- Foto y coordenadas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Foto Adjunta del Problema <span class="text-red-500">*</span></label>
                <div @click="$refs.inputFoto.click()"
                  class="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-[#1a5f5a] transition-colors overflow-hidden">
                  <img v-if="fotoPreview" :src="fotoPreview" class="h-full w-full object-cover" />
                  <span v-else>📷 Subir imagen desde tu dispositivo</span>
                </div>
                <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoChange" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Coordenadas GPS</label>
                <div class="mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 h-32 flex flex-col justify-center items-center gap-2">
                  <p class="text-center text-xs text-gray-400">
                    Comparte tu ubicación para que se pueda localizar el problema más fácilmente.
                  </p>
                  <p v-if="form.latitud" class="text-xs text-green-600 font-semibold">✅ Ubicación obtenida correctamente</p>
                  <p v-else class="text-xs text-gray-400 italic">"Tu ubicación no será compartida públicamente."</p>
                  <button @click="obtenerUbicacion"
                    class="bg-[#1a5f5a] text-white text-xs px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
                    📌 Obtener mi ubicación
                  </button>
                </div>
              </div>
            </div>

            <!-- Botón guardar -->
            <div class="mt-6 text-center">
              <button @click="guardarReporte" :disabled="cargando"
                class="bg-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors uppercase tracking-wide disabled:opacity-50">
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
import { ref } from 'vue'
import { supabase } from '../supabase.js'
import { useRouter } from 'vue-router'
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

const obtenerUbicacion = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      form.value.latitud = pos.coords.latitude.toFixed(4)
      form.value.longitud = pos.coords.longitude.toFixed(4)
    })
  }
}

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
  if (!form.value.tipo || !form.value.descripcion || !form.value.ubicacion || !fotoArchivo.value) {
    errorValidacion.value = 'Por favor llena los campos obligatorios: Tipo, Descripción, Ubicación y Foto'
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
      ubicacion: form.value.ubicacion,
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
    setTimeout(() => {
      router.push('/reportes')
    }, 2000)
  }
}
</script>