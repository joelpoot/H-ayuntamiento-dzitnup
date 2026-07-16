<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()

// Cierra el menú cada vez que cambia la ruta (al tocar un link)
watch(() => route.path, () => {
  isOpen.value = false
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

// Cerrar con Escape
function onKeydown(e) {
  if (e.key === 'Escape') isOpen.value = false
}
</script>

<template>
  <nav
    class="bg-[#14392b] text-white shadow-lg"
    @keydown="onKeydown"
  >
    <div class="w-full px-4 flex items-center justify-between h-16">

      <!-- Logo y nombre -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 flex-shrink-0 bg-[#c2a878] rounded-full flex items-center justify-center font-bold text-[#14392b] text-sm">
          C
        </div>
        <div class="leading-tight min-w-0">
          <p class="font-bold text-xs sm:text-sm uppercase tracking-wide truncate">
            Comisaria Municipal de Dzitnup
          </p>
          <p class="text-xs text-[#c2a878] truncate">Valladolid, Yucatán</p>
        </div>
      </div>

      <!-- Links de navegación (desktop) -->
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

      <!-- Botón hamburguesa (solo móvil) -->
      <button
        type="button"
        class="md:hidden flex-shrink-0 p-2 -mr-2 rounded-md hover:bg-white/10 transition-colors"
        :aria-expanded="isOpen"
        aria-label="Abrir menú de navegación"
        aria-controls="mobile-menu"
        @click="toggleMenu"
      >
        <!-- Ícono hamburguesa / X según estado -->
        <svg
          v-if="!isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Panel desplegable móvil -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        id="mobile-menu"
        class="md:hidden border-t border-white/10 bg-[#14392b]"
      >
        <div class="flex flex-col px-4 py-3 space-y-1 text-sm font-medium">
          <RouterLink to="/" class="mobile-link">Inicio</RouterLink>
          <RouterLink to="/avisos" class="mobile-link">Avisos</RouterLink>
          <RouterLink to="/reportes" class="mobile-link">Reportes</RouterLink>
          <RouterLink to="/horarios" class="mobile-link">Horarios</RouterLink>
          <RouterLink to="/directorio" class="mobile-link">Directorio</RouterLink>
          <RouterLink to="/agenda" class="mobile-link">Agenda</RouterLink>
          <RouterLink to="/galeria" class="mobile-link">Galería</RouterLink>
          <RouterLink to="/mapa" class="mobile-link">Mapa</RouterLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* --- Links desktop --- */
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

/* Home solo activa en ruta exacta; el resto con active normal */
.nav-link.router-link-exact-active::after {
  width: 100%;
}

/* --- Links móvil --- */
.mobile-link {
  color: white;
  text-decoration: none;
  padding: 0.625rem 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s, color 0.15s;
}

.mobile-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #c7973d;
}

.mobile-link.router-link-exact-active {
  color: #c2a878;
  background-color: rgba(194, 168, 120, 0.12);
}
</style>