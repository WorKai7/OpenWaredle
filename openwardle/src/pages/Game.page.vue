<template>
  <HeaderMenuComponent />
  <Terminal v-if="terminalStore.showTerminal"/>
  <CoreComponent :mode="mode" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderMenuComponent from '@/components/HeaderMenu.component.vue'
import CoreComponent from '@/components/Core.component.vue'
import Terminal from '@/components/Terminal.component.vue';
import { useTerminalStore } from '@/stores/terminal'

const route = useRoute()
const terminalStore = useTerminalStore()

const mode = computed(() => {
  return route.params.mode as 'open' | 'closed'
})
</script>

<style scoped>
</style>
