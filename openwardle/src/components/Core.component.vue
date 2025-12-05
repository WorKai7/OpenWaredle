<template>
  <div class="wordle-container">
    <h1>OpenWaredle</h1>
    <p class="subtitle">{{ subtitle }}</p>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="startNewGame">Réessayer</button>
    </div>

    <div v-else class="game">
      <!-- Game Grid -->
      <div class="grid">
        <div v-for="rowIndex in MAX_ATTEMPTS" :key="rowIndex" class="row">
          <div
            v-for="(cell, colIndex) in getRowCells(rowIndex - 1)"
            :key="colIndex"
            :class="['cell', getCellStatus(rowIndex - 1, colIndex)]"
          >
            {{ cell }}
          </div>
        </div>
      </div>

      <!-- Game Status -->
      <div v-if="gameOver" class="game-status">
        <div v-if="won" class="won">
          🎉 Félicitations ! Vous avez trouvé <strong>{{ targetWord }}</strong> !
        </div>
        <div v-else class="lost">
          😢 Perdu ! Le mot était <strong>{{ targetWord }}</strong>
        </div>

        <!-- Open Source Alternative (for closed mode) -->
        <div v-if="mode === 'closed' && openSourceAlternative" class="alternative">
          <h3>💡 Alternative Open Source</h3>
          <div class="alternative-card">
            <span class="alternative-name">{{ openSourceAlternative.name }}</span>
            <p class="alternative-description">{{ openSourceAlternative.description }}</p>
          </div>
        </div>

        <div class="game-actions">
          <button @click="startNewGame" class="new-game-btn">Nouvelle partie</button>
          <router-link to="/" class="home-btn">Changer de mode</router-link>
        </div>
      </div>

      <!-- Input -->
      <div v-if="!gameOver" class="input-section">
        <input
          v-model="currentGuess"
          @keyup.enter="submitGuess"
          type="text"
          :placeholder="'Essai ' + (currentRow + 1) + '/6'"
          :disabled="gameOver"
          class="guess-input"
          ref="inputRef"
        />
        <button @click="submitGuess" :disabled="gameOver" class="submit-btn">
          Valider
        </button>
      </div>

      <p class="hint">{{ wordLength }} caractères</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps<{
  mode: 'open' | 'closed'
}>()

const MAX_ATTEMPTS = 6

// State
const targetWord = ref('')
const normalizedTarget = ref('')
const wordLength = ref(0)
const guesses = ref<string[]>([])
const currentGuess = ref('')
const currentRow = ref(0)
const gameOver = ref(false)
const won = ref(false)
const loading = ref(true)
const error = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const revealedPositions = ref<Set<number>>(new Set())
const openSourceAlternative = ref<{ name: string; description: string } | null>(null)

// Computed
const subtitle = computed(() => {
  return props.mode === 'open'
    ? 'Devinez le logiciel open source !'
    : 'Devinez le logiciel propriétaire !'
})

// Normalize string for comparison (remove accents, lowercase)
const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Calculate random positions to reveal
const calculateRevealedPositions = (length: number): Set<number> => {
  const count = length < 5 ? 1 : Math.floor(length / 5)
  const positions = new Set<number>()

  while (positions.size < count) {
    positions.add(Math.floor(Math.random() * length))
  }

  return positions
}

// Fetch random software from API
const fetchRandomSoftware = async () => {
  loading.value = true
  error.value = ''
  openSourceAlternative.value = null

  const endpoint = props.mode === 'open'
    ? 'http://localhost:3000/software/random-open'
    : 'http://localhost:3000/software/random-closed'

  try {
    const response = await fetch(endpoint)
    if (!response.ok) throw new Error('Erreur API')

    const data = await response.json()
    targetWord.value = data.nom_logiciel
    normalizedTarget.value = normalizeString(data.nom_logiciel)
    wordLength.value = data.nom_logiciel.length
    revealedPositions.value = calculateRevealedPositions(data.nom_logiciel.length)
    guesses.value = []
    currentRow.value = 0
    currentGuess.value = ''

    // Mock open source alternative for closed mode
    if (props.mode === 'closed') {
      openSourceAlternative.value = {
        name: 'Alternative Open Source',
        description: 'Une alternative libre et gratuite à ce logiciel propriétaire.'
      }
    }
    gameOver.value = false
    won.value = false
  } catch (e) {
    error.value = 'Impossible de charger le jeu. Vérifiez que l\'API est lancée.'
  } finally {
    loading.value = false
  }
}

// Get cells for a row (filled with guess or empty, with revealed hints)
const getRowCells = (rowIndex: number): string[] => {
  const guess = guesses.value[rowIndex] || ''
  const cells: string[] = []

  for (let i = 0; i < wordLength.value; i++) {
    if (guess[i]) {
      cells.push(guess[i])
    } else if (revealedPositions.value.has(i)) {
      cells.push(targetWord.value[i])
    } else {
      cells.push('')
    }
  }

  return cells
}

// Get cell status for styling
const getCellStatus = (rowIndex: number, colIndex: number): string => {
  if (rowIndex >= guesses.value.length) {
    if (revealedPositions.value.has(colIndex)) {
      return 'revealed'
    }
    return 'empty'
  }

  const guess = guesses.value[rowIndex]
  if (!guess || colIndex >= guess.length) return 'empty'

  const normalizedGuess = normalizeString(guess)
  const guessChar = normalizedGuess[colIndex]
  const targetChar = normalizedTarget.value[colIndex]

  // Correct position = green
  if (guessChar === targetChar) {
    return 'correct'
  }

  // Count occurrences of this letter in target
  const targetCount = [...normalizedTarget.value].filter(c => c === guessChar).length

  if (targetCount === 0) {
    return 'absent'
  }

  // Count how many are already correct (green) in the guess
  let correctCount = 0
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (normalizedGuess[i] === guessChar && normalizedGuess[i] === normalizedTarget.value[i]) {
      correctCount++
    }
  }

  // Count how many yellow we've already assigned before this position
  let yellowBeforeCount = 0
  for (let i = 0; i < colIndex; i++) {
    if (normalizedGuess[i] === guessChar && normalizedGuess[i] !== normalizedTarget.value[i]) {
      yellowBeforeCount++
    }
  }

  // Remaining available for yellow
  const availableForYellow = targetCount - correctCount

  if (yellowBeforeCount < availableForYellow) {
    return 'present'
  }

  return 'absent'
}

// Submit a guess
const submitGuess = () => {
  const guess = currentGuess.value.trim()

  if (guess.length !== wordLength.value) {
    return
  }

  guesses.value.push(guess)

  // Check for win
  if (normalizeString(guess) === normalizedTarget.value) {
    gameOver.value = true
    won.value = true
    return
  }

  currentRow.value++

  // Check for loss
  if (currentRow.value >= MAX_ATTEMPTS) {
    gameOver.value = true
    won.value = false
    return
  }

  currentGuess.value = ''
  inputRef.value?.focus()
}

// Start new game
const startNewGame = () => {
  fetchRandomSoftware()
}

onMounted(() => {
  fetchRandomSoftware()
})
</script>

<style scoped>
.wordle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 80vh;
}

h1 {
  color: #333;
  margin-bottom: 5px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
}

.error button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  gap: 8px;
}

.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #d3d6da;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px;
  transition: all 0.2s;
}

.cell.empty {
  background: white;
}

.cell.revealed {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.cell.correct {
  background: #6aaa64;
  border-color: #6aaa64;
  color: white;
}

.cell.present {
  background: #c9b458;
  border-color: #c9b458;
  color: white;
}

.cell.absent {
  background: #787c7e;
  border-color: #787c7e;
  color: white;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.guess-input {
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.2s;
}

.guess-input:focus {
  border-color: #4CAF50;
}

.submit-btn {
  padding: 12px 24px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.hint {
  color: #666;
  font-size: 14px;
}

.game-status {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.won {
  color: #2e7d32;
  font-size: 18px;
}

.lost {
  color: #c62828;
  font-size: 18px;
}

.new-game-btn {
  margin-top: 15px;
  padding: 12px 24px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.new-game-btn:hover {
  background: #45a049;
}

.game-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.home-btn {
  padding: 12px 24px;
  font-size: 16px;
  background: #5C6BC0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s;
}

.home-btn:hover {
  background: #3F51B5;
}

.alternative {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  border-radius: 12px;
  border: 2px solid #4CAF50;
}

.alternative h3 {
  margin: 0 0 15px 0;
  color: #2E7D32;
}

.alternative-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alternative-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1B5E20;
}

.alternative-description {
  margin: 10px 0 0 0;
  color: #555;
  font-size: 0.95rem;
}
</style>
