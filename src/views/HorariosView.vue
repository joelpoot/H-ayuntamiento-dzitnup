<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-8 border-l-4 border-[#c2a878] relative">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#c2a878]/15 flex items-center justify-center shrink-0">
          <Clock :size="24" class="text-black" />
        </div>
      <div>
          <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Horarios de Atención</h1>
          <p class="text-[#c2a878] text-sm mt-1">Horarios oficiales de la comisaria</p>
    </div>
  </div>
</div>

    <div class="max-w-4xl mx-auto px-4 py-10">
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#14392b] px-6 py-4">
          <h2 class="text-white font-bold text-sm uppercase tracking-wide">Horarios por Departamento</h2>
        </div>
        <div class="p-6">

          <!-- Cargando -->
          <div v-if="cargando" class="text-center py-6 text-gray-400">Cargando horarios...</div>

          <table v-else class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th class="text-left px-4 py-3 rounded-l-lg">
                  <span class="flex items-center gap-1.5"><Building2 :size="14" />Área / Depto</span>
                </th>
                <th class="text-left px-4 py-3">
                  <span class="flex items-center gap-1.5"><CalendarDays :size="14" />Días</span>
                </th>
                <th class="text-left px-4 py-3 rounded-r-lg">
                  <span class="flex items-center gap-1.5"><Clock :size="14" />Horario</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(area, i) in horarios" :key="i">
                <tr class="fila-escalonada border-b border-gray-50 hover:bg-[#f8f6f0] transition-colors" :style="{ animationDelay: (i * 0.12) + 's' }">
                  <td class="px-4 py-4 font-semibold text-[#14392b]">{{ area.area }}</td>
                  <td class="px-4 py-4 text-gray-500">{{ area.dias }}</td>
                  <td class="px-4 py-4 text-gray-500">{{ area.hora_entrada }} - {{ area.hora_salida }}</td>
                </tr>
                <tr v-if="area.observaciones" class="fila-escalonada border-b border-gray-50 hover:bg-[#f8f6f0] transition-colors" :style="{ animationDelay: (i * 0.12) + 's' }">
                  <td colspan="3" class="px-4 pb-4 -mt-2 text-xs text-gray-400 italic">{{ area.observaciones }}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <p class="text-xs text-gray-400 italic mt-4">* Emergencias de seguridad operan en formato 24/7 de manera presencial.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Building2, CalendarDays, Clock } from 'lucide-vue-next'
import { supabase } from '../supabase.js'

const horarios = ref([])
const cargando = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .order('area', { ascending: true })

  if (!error) horarios.value = data
  cargando.value = false
})
</script>

<style scoped>
@keyframes entradaEscalonada {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.fila-escalonada {
  animation: entradaEscalonada 0.4s ease forwards;
  opacity: 0;
}
</style>