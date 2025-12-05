<template>
    <HeaderMenuComponent/>
    <CoreComponent/>
    <Chatbot/>
    <RouterView/>
</template>

<script lang="ts" setup>
    import HeaderMenuComponent from './components/HeaderMenu.component.vue';
    import CoreComponent from './components/Core.component.vue';
    import Chatbot from './components/Chatbot.vue';
    
</script>

<style scoped>

</style>