<template>
  <div>
    <Navbar v-if="!adminState.autenticado" />
    <RouterView />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { adminState } from './stores/adminState.js'
</script>