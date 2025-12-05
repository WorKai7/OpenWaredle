<template>
  <HeaderMenuComponent />
  <Terminal v-if="terminalStore.showTerminal"/>
  <div class="home-container">
    <h1>OpenWardle</h1>
    <p class="tagline">Le Wordle des logiciels !</p>

    <div class="mode-selection">
      <h2>Choisissez votre mode de jeu</h2>

      <div class="modes">
        <router-link to="/play/open" class="mode-card open">
          <h3>Open Source</h3>
          <p>Devinez un logiciel open source</p>
        </router-link>

        <router-link to="/play/closed" class="mode-card closed">
          <h3>Propriétaire</h3>
          <p>Devinez un logiciel propriétaire et découvrez son alternative open source</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderMenuComponent from '@/components/HeaderMenu.component.vue'
import Terminal from '@/components/Terminal.component.vue';

import { useTerminalStore } from '@/stores/terminal';

const terminalStore = useTerminalStore()
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 80vh;
}

h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

.tagline {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 50px;
}

.mode-selection h2 {
  text-align: center;
  color: #444;
  margin-bottom: 30px;
}

.modes {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 40px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 280px;
  cursor: pointer;
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.mode-card.open {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
}

.mode-card.closed {
  background: linear-gradient(135deg, #5C6BC0, #7986CB);
  color: white;
}

.mode-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.mode-card p {
  margin: 0;
  text-align: center;
  opacity: 0.9;
  font-size: 0.95rem;
}
</style>
