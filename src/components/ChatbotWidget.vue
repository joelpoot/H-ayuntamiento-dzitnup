<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end">

    <!-- Panel del chat -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="abierto"
        class="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style="height: 480px; max-height: 70vh;">

        <!-- Encabezado -->
        <div class="bg-[#14392b] px-4 py-3 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-[#c2a878] flex items-center justify-center font-bold text-[#14392b] text-sm shrink-0">C</div>
            <div class="min-w-0">
              <p class="text-white font-bold text-sm leading-tight truncate">Asistente Virtual</p>
              <p class="text-[#c2a878] text-xs leading-tight truncate">Comisaría de Dzitnup</p>
            </div>
          </div>
          <button type="button" @click="abierto = false" aria-label="Cerrar chat"
            class="text-white/80 hover:text-white shrink-0 p-1">
            <X :size="18" />
          </button>
        </div>

        <!-- Mensajes -->
        <div ref="areaMensajes" class="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#faf9f6]">
          <div v-if="mensajes.length === 0" class="text-center text-xs text-gray-500 px-4 py-8 leading-relaxed">
            Pregúntame sobre avisos, horarios, el directorio o la agenda comunitaria.
          </div>

          <template v-for="(m, i) in mensajes" :key="i">
            <div v-if="m.rol === 'usuario'" class="flex justify-end">
              <div class="bg-[#e8dcc4] text-[#14392b] text-sm rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[80%] break-words">
                {{ m.texto }}
              </div>
            </div>
            <div v-else class="flex justify-start">
              <div class="bg-white border border-gray-200 text-gray-800 text-sm rounded-2xl rounded-bl-sm px-3.5 py-2 max-w-[85%] break-words whitespace-pre-line">
                {{ m.texto }}
              </div>
            </div>
          </template>

          <!-- Escribiendo... -->
          <div v-if="cargando" class="flex justify-start">
            <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span class="punto"></span><span class="punto"></span><span class="punto"></span>
            </div>
          </div>

          <div v-if="errorMsg" class="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {{ errorMsg }}
          </div>

          <!-- Chips rápidos tras la primera respuesta -->
          <div v-if="mensajes.length > 0 && !cargando" class="flex gap-2 flex-wrap pt-1">
            <RouterLink to="/agenda"
              class="text-xs font-semibold bg-white border border-[#e8dcc4] text-[#8a7249] px-3 py-1.5 rounded-full hover:bg-[#f7f1e4] transition-colors">
              Ver agenda completa
            </RouterLink>
            <button type="button" @click="enfocarInput"
              class="text-xs font-semibold bg-white border border-[#e8dcc4] text-[#8a7249] px-3 py-1.5 rounded-full hover:bg-[#f7f1e4] transition-colors">
              ¿Algo más?
            </button>
          </div>
        </div>

        <!-- Entrada -->
        <div class="border-t border-gray-200 p-2.5 flex items-center gap-2 shrink-0 bg-white">
          <input ref="inputPregunta" v-model="pregunta" @keyup.enter="enviar" :disabled="cargando"
            type="text" maxlength="500" placeholder="Escribe tu pregunta..."
            class="flex-1 min-w-0 text-sm border border-gray-300 rounded-full px-3.5 py-2 focus:outline-none focus:border-[#14392b] disabled:bg-gray-100" />
          <button type="button" @click="enviar" :disabled="cargando || !pregunta.trim()" aria-label="Enviar pregunta"
            class="w-9 h-9 rounded-full bg-[#8a7249] hover:bg-[#6f5934] disabled:opacity-40 flex items-center justify-center text-white shrink-0 transition-colors">
            <Send :size="16" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Botón flotante -->
    <button type="button" @click="alternar" :aria-expanded="abierto" aria-label="Abrir chat del asistente virtual"
      class="w-14 h-14 rounded-full bg-[#8a7249] hover:bg-[#6f5934] shadow-xl flex items-center justify-center text-white transition-colors">
      <MessageCircle v-if="!abierto" :size="26" />
      <X v-else :size="24" />
    </button>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { MessageCircle, X, Send } from 'lucide-vue-next'

const abierto = ref(false)
const pregunta = ref('')
const mensajes = ref([])
const cargando = ref(false)
const errorMsg = ref('')
const areaMensajes = ref(null)
const inputPregunta = ref(null)

const alternar = async () => {
  abierto.value = !abierto.value
  if (abierto.value) {
    await nextTick()
    inputPregunta.value?.focus()
  }
}

const enfocarInput = () => {
  inputPregunta.value?.focus()
}

const scrollAbajo = async () => {
  await nextTick()
  if (areaMensajes.value) areaMensajes.value.scrollTop = areaMensajes.value.scrollHeight
}

const enviar = async () => {
  const texto = pregunta.value.trim()
  if (!texto || cargando.value) return

  errorMsg.value = ''
  mensajes.value.push({ rol: 'usuario', texto })
  pregunta.value = ''
  cargando.value = true
  await scrollAbajo()

  try {
    const resp = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pregunta: texto }),
    })
    const datos = await resp.json()
    if (!resp.ok) throw new Error(datos?.error || 'No se pudo obtener una respuesta.')
    mensajes.value.push({ rol: 'asistente', texto: datos.respuesta })
  } catch (e) {
    errorMsg.value = e.message || 'Ocurrió un error de conexión. Intenta de nuevo.'
  } finally {
    cargando.value = false
    await scrollAbajo()
  }
}
</script>

<style scoped>
.punto {
  width: 6px; height: 6px; border-radius: 50%; background: #c2a878;
  animation: rebote 1.1s infinite ease-in-out;
}
.punto:nth-child(2) { animation-delay: 0.15s; }
.punto:nth-child(3) { animation-delay: 0.3s; }

@keyframes rebote {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .punto { animation: none; opacity: 0.8; }
}
</style>
