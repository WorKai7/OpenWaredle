<template>
  <div class="terminal" @click="focusInput">
    <div class="headbar">
      <span @click="terminalStore.closeTerminal">X</span>
    </div>
    <div class="output">
      <div v-for="(line, i) in history" :key="i">{{ line }}</div>
    </div>

    <div class="input-line">
      <span>guest@openwaredle:~$ </span>
      <input
        v-model="command"
        @keyup.enter="runCommand"
        ref="inputRef"
        autofocus
      />
    </div>
  </div>
</template>

<script setup>
    import { ref } from "vue"
    import { useTerminalStore } from "@/stores/terminal"
    import router from "@/router"

    const terminalStore = useTerminalStore()

    const command = ref("")
    const history = ref([])
    const commands = {
        ls: () => ["ls | help | snake"],
        help: () => ["Utilise ls pour afficher les commandes"],
        snake: () => router.push("/snake")
    }

    function runCommand() {
        const cmd = command.value.trim()
        history.value.push(`guest@openwaredle:~$ ${cmd}`)

        if (cmd === "ls") history.value.push(...commands.ls())
        else if (cmd === "help") history.value.push(...commands.help())
        else if (cmd === "snake") {
            commands.snake()
        } else {
            history.value.push(`Commande inconnue : ${cmd}`)
        }

        command.value = ""
    }

    const inputRef = ref(null)
    const focusInput = () => inputRef.value?.focus()
</script>

<style scoped>
    .terminal {
        background: #0f0f0f;
        color: #0f0;
        font-family: monospace;
        padding: 10px;
        height: 300px;
        overflow-y: auto;
        border-radius: 6px;
        outline: 2px solid #0f0;
    }

    .input-line {
        display: flex;
        gap: 6px;
    }

    input {
        background: transparent;
        border: none;
        color: #0f0;
        width: 100%;
        font-family: monospace;
        outline: none;
    }

    .headbar {
        display: flex;
        justify-content: right;
        border-bottom: 1px solid #0f0;
    }

    .headbar:hover {
        cursor: pointer;
    }
</style>
