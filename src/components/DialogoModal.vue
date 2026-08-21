<template>
  <Teleport to="body">
    <Transition name="dialogo-fade">
      <div v-if="dialogoState.visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="cerrar(false)">
        <Transition name="dialogo-pop" appear>
          <div v-if="dialogoState.visible" class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="p-6 text-center">
              <div class="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" :class="estilo.iconoFondo">
                <component :is="estilo.icono" :size="26" :class="estilo.iconoColor" />
              </div>
              <h3 class="font-bold text-lg text-gray-800">{{ dialogoState.titulo }}</h3>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ dialogoState.mensaje }}</p>
            </div>
            <div class="px-6 pb-6 flex gap-3">
              <button v-if="!dialogoState.soloAviso" type="button" @click="cerrar(false)"
                class="flex-1 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                {{ dialogoState.textoCancelar }}
              </button>
              <button type="button" @click="cerrar(true)"
                class="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors" :class="estilo.botonConfirmar">
                {{ dialogoState.textoConfirmar }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, Ban, Info, CheckCircle2 } from 'lucide-vue-next'
import { dialogoState, resolverDialogo } from '../composables/useDialogo.js'

const estilos = {
  danger: { icono: AlertTriangle, iconoFondo: 'bg-red-50', iconoColor: 'text-red-600', botonConfirmar: 'bg-red-600 hover:bg-red-700' },
  warning: { icono: Ban, iconoFondo: 'bg-[#e8dcc4]', iconoColor: 'text-[#8a6d3f]', botonConfirmar: 'bg-[#c2a878] hover:bg-[#a8916a]' },
  info: { icono: Info, iconoFondo: 'bg-[#14392b]/10', iconoColor: 'text-[#14392b]', botonConfirmar: 'bg-[#14392b] hover:bg-[#0a1f17]' },
  success: { icono: CheckCircle2, iconoFondo: 'bg-green-50', iconoColor: 'text-green-600', botonConfirmar: 'bg-green-600 hover:bg-green-700' },
}

const estilo = computed(() => estilos[dialogoState.tipo] || estilos.info)

const cerrar = (resultado) => resolverDialogo(resultado)
</script>

<style scoped>
.dialogo-fade-enter-active,
.dialogo-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dialogo-fade-enter-from,
.dialogo-fade-leave-to {
  opacity: 0;
}
.dialogo-pop-enter-active {
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
}
.dialogo-pop-enter-from {
  transform: scale(0.92) translateY(8px);
  opacity: 0;
}
</style>
