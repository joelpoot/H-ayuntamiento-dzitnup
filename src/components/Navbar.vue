<template>
  <nav class="bg-[#14392b] text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
      
      <!-- Logo y nombre -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#c2a878] rounded-full flex items-center justify-center font-bold text-[#14392b] text-sm">
          C
        </div>
        <div class="leading-tight">
          <p class="font-bold text-sm uppercase tracking-wide">Comisaria Municipal de Dzitnup</p>
          <p class="text-xs text-[#c2a878]">Valladolid, Yucatán</p>
        </div>
      </div>

      <!-- Links de navegación -->
        <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <RouterLink to="/avisos" class="nav-link">Avisos</RouterLink>
        <RouterLink to="/reportes" class="nav-link">Reportes</RouterLink>
        <RouterLink to="/horarios" class="nav-link">Horarios</RouterLink>
        <RouterLink to="/directorio" class="nav-link">Directorio</RouterLink>
        <RouterLink to="/agenda" class="nav-link">Agenda</RouterLink>
        <RouterLink to="/galeria" class="nav-link">Galería</RouterLink>
        <RouterLink to="/mapa" class="nav-link">Mapa</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  color: white;
  text-decoration: none;
  padding-bottom: 4px;
  position: relative;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #c2a878;
  border-radius: 2px;
  transition: width 0.25s ease;
}

.nav-link:hover {
  color: #c7973d;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active::after {
  width: 100%;
}
</style>