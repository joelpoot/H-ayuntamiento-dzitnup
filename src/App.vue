<template>
  <div>
    <SplashScreen v-if="cargandoApp" @terminado="cargandoApp = false" />
    <template v-else>
      <Navbar v-if="!adminState.autenticado" />
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import SplashScreen from './components/SplashScreen.vue'
import { adminState } from './stores/adminState.js'

const cargandoApp = ref(true)
</script>