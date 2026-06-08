<template>
  <div>
    <!-- Header -->
    <div class="bg-[#1a5f5a] px-8 py-6">
      <h1 class="text-white text-2xl font-bold uppercase tracking-wide">📞 Directorio Municipal</h1>
      <p class="text-green-200 text-sm mt-1">Contactos oficiales del H. Ayuntamiento de Dzitnup</p>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-10 space-y-4">

      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-10 text-gray-400">Cargando directorio...</div>

      <div v-else v-for="(persona, i) in directorio" :key="i"
        class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div class="flex">
          <div class="w-1 bg-[#F5A623]"></div>
          <div class="flex-1 p-5 flex items-center gap-4">

            <!-- Avatar -->
            <div class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg shrink-0">
              {{ persona.iniciales }}
            </div>

            <!-- Info -->
            <div class="flex-1">
              <p class="font-bold text-gray-800">{{ persona.nombre }}</p>
              <p class="text-xs font-semibold text-[#F5A623] uppercase tracking-wide">{{ persona.cargo }}</p>
              <p class="text-xs text-gray-500 mt-1">📞 {{ persona.telefono }}</p>
            </div>

            <!-- Área -->
            <div class="hidden md:block text-right">
              <span class="bg-[#1a5f5a] text-white text-xs px-3 py-1 rounded-full">{{ persona.area }}</span>
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

const directorio = ref([])
const cargando = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('directorio')
    .select('*')
    .order('area', { ascending: true })

  if (!error) directorio.value = data
  cargando.value = false
})
</script>