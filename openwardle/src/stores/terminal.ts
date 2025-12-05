import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTerminalStore = defineStore('terminal', () => {
    const showTerminal = ref(false)

    function openTerminal() {
        showTerminal.value = true
    }

    function closeTerminal() {
        showTerminal.value = false
    }

    return { showTerminal, openTerminal, closeTerminal }
})
