<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative h-90 flex items-center justify-center overflow-hidden">
  <img src="/Cenote-Dzitnup-Valladolid-001.jpg" class="absolute inset-0 w-full h-full object-cover object-center" style="object-position: center 69%" />
  <div class="absolute inset-0 bg-gradient-to-b from-[#1a5f5a]/40 to-[#0f3d3a]/60"></div>
      <div class="relative text-center text-white px-4">
        <h1 class="text-4xl font-bold tracking-wide">COMISARIA MUNICIPAL DE DZITNUP, YUCATÁN</h1>
        <p class="mt-2 text-yellow-200 text-lg">Administración 2024 - 2027</p>
        <div class="mt-4 w-16 h-1 bg-[#F5A623] mx-auto rounded"></div>
      </div>
    </div>

    <!-- Grid de módulos -->
    <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Avisos y Noticias -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3 flex items-center gap-2">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📢 Avisos y Noticias</span>
        </div>
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="bg-[#1a5f5a] text-white rounded-lg px-3 py-2 text-center">
              <p class="text-xl font-bold">07</p>
              <p class="text-xs">JUN</p>
            </div>
            <div>
              <p class="font-bold text-sm text-gray-800">Corte de Suministro</p>
              <p class="text-xs text-gray-500">Reparación de tubería en calle 20</p>
            </div>
          </div>
          <RouterLink to="/avisos" class="text-[#F5A623] text-sm font-semibold hover:underline">Ver todos los avisos →</RouterLink>
        </div>
      </div>

      <!-- Reportes Ciudadanos -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🚨 Reportes Ciudadanos</span>
        </div>
        <div class="p-4 flex flex-col items-center justify-center gap-4">
          <p class="text-gray-600 text-sm text-center">¿Detectaste un problema en tu comunidad? Repórtalo aquí.</p>
          <RouterLink to="/reportes"
            class="bg-[#F5A623] text-white font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
            📝 Enviar un Reporte
          </RouterLink>
        </div>
      </div>

      <!-- Agenda Comunitaria -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📅 Agenda Comunitaria</span>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex gap-3 items-start">
            <div class="bg-[#1a5f5a] text-white rounded-lg px-3 py-2 text-center min-w-[48px]">
              <p class="text-xl font-bold">15</p>
              <p class="text-xs">JUN</p>
            </div>
            <div>
              <p class="font-bold text-sm text-gray-800">Reunión Ejidal de Cabildo</p>
              <p class="text-xs text-gray-500">Palacio Municipal</p>
            </div>
          </div>
          <div class="flex gap-3 items-start">
            <div class="bg-[#1a5f5a] text-white rounded-lg px-3 py-2 text-center min-w-[48px]">
              <p class="text-xl font-bold">24</p>
              <p class="text-xs">JUN</p>
            </div>
            <div>
              <p class="font-bold text-sm text-gray-800">Gremio y Vaquería Tradicional</p>
              <p class="text-xs text-gray-500">Domo Principal</p>
            </div>
          </div>
          <RouterLink to="/agenda" class="text-[#F5A623] text-sm font-semibold hover:underline">Ver agenda completa →</RouterLink>
        </div>
      </div>

      <!-- Horarios de Atención -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🕐 Horarios de Atención</span>
        </div>
        <div class="p-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-gray-500 text-xs border-b">
                <th class="text-left pb-2">Área</th>
                <th class="text-left pb-2">Días</th>
                <th class="text-left pb-2">Horario</th>
              </tr>
            </thead>
            <tbody class="space-y-1">
              <tr class="border-b border-gray-50">
                <td class="py-2 font-medium">Presidencia</td>
                <td class="py-2 text-gray-500">Lun - Vie</td>
                <td class="py-2 text-gray-500">8AM - 3PM</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-2 font-medium">Tesorería</td>
                <td class="py-2 text-gray-500">Lun - Vie</td>
                <td class="py-2 text-gray-500">8AM - 3PM</td>
              </tr>
              <tr>
                <td class="py-2 font-medium">Comandancia</td>
                <td class="py-2 text-gray-500">Lun - Sáb</td>
                <td class="py-2 text-gray-500">8AM - 3PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Directorio Municipal -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">📞 Directorio Municipal</span>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-center gap-3 border-b pb-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">BP</div>
            <div>
              <p class="font-bold text-sm">T.S. Juan Pablo</p>
              <p class="text-xs text-[#F5A623] font-semibold">Comisario Municipal</p>
              <p class="text-xs text-gray-500">📞 985-100-2211</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">AM</div>
            <div>
              <p class="font-bold text-sm">Lic. Alondra May Canul</p>
              <p class="text-xs text-[#F5A623] font-semibold">Encargada de Finanzas</p>
              <p class="text-xs text-gray-500">📞 985-104-5588</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Galería -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-[#1a5f5a] px-4 py-3">
          <span class="text-white font-bold text-sm uppercase tracking-wide">🖼️ Galería</span>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-xs text-gray-400 text-center">Cenote Samulá</div>
            <div class="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-xs text-gray-400 text-center">Entrega Domo</div>
            <div class="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-xs text-gray-400 text-center">Limpieza</div>
          </div>
          <RouterLink to="/galeria" class="text-[#F5A623] text-sm font-semibold hover:underline mt-3 block">Ver galería completa →</RouterLink>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="bg-[#1a5f5a] text-white mt-10 py-6 px-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span>📞</span>
          <div>
            <p>Contacto: ayuntamiento@dzitnup.gob.mx</p>
            <p class="text-green-200">985-100-2211</p>
          </div>
        </div>
        <div class="flex gap-4 text-green-200">
          <span class="cursor-pointer hover:text-white">Facebook</span>
          <span class="cursor-pointer hover:text-white">Twitter</span>
          <span class="cursor-pointer hover:text-white">Instagram</span>
        </div>
        <div class="flex items-center gap-2">
          <span>📍</span>
          <div>
            <p>Calle Principal S/N</p>
            <p class="text-green-200">Dzitnup, Yucatán</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>