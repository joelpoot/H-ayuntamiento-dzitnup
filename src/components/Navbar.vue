<template>
  <nav class="bg-[#1a5f5a] text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
      
      <!-- Logo y nombre -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#F5A623] rounded-full flex items-center justify-center font-bold text-[#1a5f5a] text-sm">
          C
        </div>
        <div class="leading-tight">
          <p class="font-bold text-sm uppercase tracking-wide">Comisaria Municipal de Dzitnup</p>
          <p class="text-xs text-green-200">Valladolid, Yucatán</p>
        </div>
      </div>

      <!-- Links de navegación -->
      <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        <RouterLink to="/" class="hover:text-[#F5A623] transition-colors">Inicio</RouterLink>
        <RouterLink to="/avisos" class="hover:text-[#F5A623] transition-colors">Avisos</RouterLink>
        <RouterLink to="/reportes" class="hover:text-[#F5A623] transition-colors">Reportes</RouterLink>
        <RouterLink to="/horarios" class="hover:text-[#F5A623] transition-colors">Horarios</RouterLink>
        <RouterLink to="/directorio" class="hover:text-[#F5A623] transition-colors">Directorio</RouterLink>
        <RouterLink to="/agenda" class="hover:text-[#F5A623] transition-colors">Agenda</RouterLink>
        <RouterLink to="/galeria" class="hover:text-[#F5A623] transition-colors">Galería</RouterLink>
        <RouterLink to="/mapa" class="hover:text-[#F5A623] transition-colors">Mapa</RouterLink>
      </div>

    </div>
  </nav>
</template>