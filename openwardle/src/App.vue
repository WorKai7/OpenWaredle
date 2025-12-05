<template>
    <HeaderMenuComponent/>
    <Terminal v-if="terminalStore.showTerminal"/>
</template>




<script lang="ts" setup>
    import HeaderMenuComponent from './components/HeaderMenu.component.vue';
    import Terminal from './components/Terminal.component.vue';
    import { useTerminalStore } from './stores/terminal';

    const terminalStore = useTerminalStore()
</script>




<style scoped>

</style>