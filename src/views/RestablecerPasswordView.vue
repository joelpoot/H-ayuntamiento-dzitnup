<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md">
      <p class="text-xs font-semibold text-[#c2a878] uppercase tracking-widest mb-1">Panel de Administración</p>
      <h1 class="text-2xl font-bold text-[#14392b] mb-2">Nueva Contraseña</h1>
      <p class="text-sm text-gray-500 mb-6">Ingresa tu nueva contraseña para continuar.</p>

      <div v-if="sesionInvalida" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
        <XCircle :size="16" class="shrink-0" />
        Este enlace ya no es válido o expiró. Solicita uno nuevo desde la pantalla de inicio de sesión.
      </div>

      <div v-if="exito" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
        <CheckCircle2 :size="16" class="shrink-0" />
        Contraseña actualizada correctamente. Redirigiendo...
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
        <XCircle :size="16" class="shrink-0" />
        No se pudo actualizar la contraseña. Intenta de nuevo.
      </div>

      <div v-if="!sesionInvalida && !exito" class="space-y-4">
        <div>
          <label class="text-xs font-semibold text-gray-500 uppercase">Nueva contraseña</label>
          <div class="relative mt-1">
            <input v-model="form.password" :type="mostrarPassword ? 'text' : 'password'" placeholder="Mínimo 6 caracteres"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#14392b]" />
            <button type="button" @click="mostrarPassword = !mostrarPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff v-if="mostrarPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-500 uppercase">Confirmar contraseña</label>
          <div class="relative mt-1">
            <input v-model="form.confirmacion" :type="mostrarConfirmacion ? 'text' : 'password'" placeholder="Repite la contraseña" @keyup.enter="actualizarPassword"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#14392b]" />
            <button type="button" @click="mostrarConfirmacion = !mostrarConfirmacion"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeOff v-if="mostrarConfirmacion" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>
        <p v-if="errorValidacion" class="text-xs text-red-500">{{ errorValidacion }}</p>

        <button @click="actualizarPassword" :disabled="cargando"
          class="w-full bg-[#14392b] text-white font-bold py-3 rounded-lg hover:bg-[#0a1f17] transition-colors disabled:opacity-50">
          {{ cargando ? 'Guardando...' : 'Guardar Nueva Contraseña' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { XCircle, CheckCircle2, Eye, EyeOff } from 'lucide-vue-next'
import { supabase } from '../supabase.js'

const router = useRouter()

const form = ref({ password: '', confirmacion: '' })
const mostrarPassword = ref(false)
const mostrarConfirmacion = ref(false)
const cargando = ref(false)
const exito = ref(false)
const error = ref(false)
const errorValidacion = ref('')
const sesionInvalida = ref(false)

// Cuando la persona llega desde el enlace del correo, Supabase ya establece
// una sesión temporal de tipo "recovery" usando el token en la URL.
// Si no hay sesión activa, el enlace ya expiró o es inválido.
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    sesionInvalida.value = true
  }
})

const actualizarPassword = async () => {
  errorValidacion.value = ''

  if (form.value.password.length < 6) {
    errorValidacion.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (form.value.password !== form.value.confirmacion) {
    errorValidacion.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true
  error.value = false

  const { error: err } = await supabase.auth.updateUser({ password: form.value.password })

  cargando.value = false

  if (err) {
    error.value = true
  } else {
    exito.value = true
    setTimeout(() => router.push('/admin'), 2000)
  }
}
</script>