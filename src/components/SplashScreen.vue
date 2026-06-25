<template>
  <transition name="fade">
    <div v-if="mostrar" class="splash">
      <div class="contenido">
        <div class="anillo-wrapper">
          <div class="resplandor"></div>
          <div class="anillo anillo-externo"></div>
          <div class="anillo anillo-interno"></div>
          <img src="/logo-dzitnup.png" alt="Comisaria Municipal de Dzitnup" class="logo" />
        </div>

        <p class="texto-eyebrow">COMISARÍA MUNICIPAL</p>
        <h1 class="texto-titulo">DZITNUP</h1>
        <p class="texto-subtitulo">YUCATÁN &middot; MÉXICO</p>

        <div class="divisor"></div>

        <p class="texto-cargando">
          CARGANDO
          <span class="barras">
            <span class="barra"></span>
            <span class="barra"></span>
            <span class="barra"></span>
          </span>
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['terminado'])
const mostrar = ref(true)

onMounted(() => {
  setTimeout(() => {
    mostrar.value = false
    setTimeout(() => emit('terminado'), 400) // espera a que termine el fade-out
  }, 2200)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #14392b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contenido {
  text-align: center;
  padding: 0 24px;
}

.anillo-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resplandor {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(194, 168, 120, 0.35), transparent 70%);
  filter: blur(4px);
}

.anillo {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(194, 168, 120, 0.25);
}

.anillo-externo {
  inset: 0;
  border-top-color: #c2a878;
  border-right-color: #c2a878;
  animation: girar 2.6s linear infinite;
}

.anillo-interno {
  inset: 14px;
  border-style: dashed;
  opacity: 0.5;
}

.logo {
  position: relative;
  z-index: 1;
  width: 150px;
  height: 150px;
  object-fit: contain;
  background: white;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 0 30px rgba(194, 168, 120, 0.45);
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.texto-eyebrow {
  color: #c2a878;
  font-weight: 600;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.texto-titulo {
  margin: 6px 0 0;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #ffffff 0%, #f0e6d0 50%, #c2a878 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.texto-subtitulo {
  margin-top: 6px;
  color: #9fb8ad;
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.divisor {
  width: 90px;
  height: 2px;
  background: #c2a878;
  margin: 32px auto 18px;
  opacity: 0.7;
}

.texto-cargando {
  color: #c2a878;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.barras {
  display: inline-flex;
  gap: 3px;
}

.barra {
  width: 3px;
  height: 12px;
  background: #c2a878;
  border-radius: 1px;
  animation: pulso 1s ease-in-out infinite;
}
.barra:nth-child(2) { animation-delay: 0.15s; }
.barra:nth-child(3) { animation-delay: 0.3s; }

@keyframes pulso {
  0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>