<template>
    <header>
        <div>
            <img src="/assets/logo.png" alt="Logo">
            <p id="logo-title">OpenWaredle</p>
        </div>

        <div>
            <n-button quaternary size="large" @click="enableTerminal">
                Se connecter
            </n-button>

            <n-button quaternary size="large" @click="enableTerminal">
                S'inscrire
            </n-button>
        </div>
    </header>
</template>




<script lang="ts" setup>
    import { useTerminalStore } from '@/stores/terminal';

    const terminalStore = useTerminalStore()
    const son = new Audio("/assets/error.mp3")

    function enableTerminal() {
        terminalStore.openTerminal()

        son.play()
    }
</script>




<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid lightgray;
        padding: 0 10px;
    }

    div {
        display: flex;
        align-items: center;
    }

    img {
        width: 75px;
    }

    #logo-title {
        font-size: 20px;
    }
</style>