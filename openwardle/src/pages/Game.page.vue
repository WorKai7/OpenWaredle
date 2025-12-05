<template>
  <HeaderMenuComponent />
  <CoreComponent :mode="mode" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderMenuComponent from '@/components/HeaderMenu.component.vue'
import CoreComponent from '@/components/Core.component.vue'

const route = useRoute()

const mode = computed(() => {
  return route.params.mode as 'open' | 'closed'
})
</script>

<style scoped>
</style>
