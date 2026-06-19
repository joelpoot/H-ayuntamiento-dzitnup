<template>
  <div>
    <!-- Header -->
    <div class="bg-[#14392b] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">Horarios de Atención</h1>
      <p class="text-[#c2a878] text-sm mt-1">Horarios oficiales del H. Ayuntamiento de Dzitnup</p>
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
                <th class="text-left px-4 py-3 rounded-l-lg">Área / Depto</th>
                <th class="text-left px-4 py-3">Días</th>
                <th class="text-left px-4 py-3 rounded-r-lg">Horario</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-50" v-for="(area, i) in horarios" :key="i">
                <td class="px-4 py-4 font-semibold text-[#14392b]">{{ area.area }}</td>
                <td class="px-4 py-4 text-gray-500">{{ area.dias }}</td>
                <td class="px-4 py-4 text-gray-500">{{ area.hora_entrada }} - {{ area.hora_salida }}</td>
              </tr>
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