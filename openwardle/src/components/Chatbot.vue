<script setup lang="ts">
import { ref } from 'vue'
import { getChatResponse, type Message } from '../services/mistralService'

// State
const isOpen = ref(false)
const messages = ref<{ text: string; isUser: boolean }[]>([
  { text: 'Hello! How can I help you today?', isUser: false }
])
const inputMessage = ref('')
const isLoading = ref(false)

// Toggle chatbot
const toggleChatbot = () => {
  isOpen.value = !isOpen.value
}

// Send message
const sendMessage = async () => {
  if (inputMessage.value.trim() === '' || isLoading.value) return

  const userMessage = inputMessage.value

  // Add user message
  messages.value.push({
    text: userMessage,
    isUser: true
  })

  inputMessage.value = ''
  isLoading.value = true

  try {
    // Prepare conversation history for Mistral
    const conversationHistory: Message[] = messages.value.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }))

    // Get response from Mistral
    const botResponse = await getChatResponse(conversationHistory)

    // Add bot response
    messages.value.push({
      text: botResponse,
      isUser: false
    })
  } catch (error) {
    console.error('Error getting response:', error)
    messages.value.push({
      text: 'Sorry, I encountered an error. Please try again.',
      isUser: false
    })
  } finally {
    isLoading.value = false
  }
}

// Handle enter key
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    sendMessage()
  }
}
</script>

<template>
  <div class="chatbot-container">
    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>Chatbot</h3>
        <button @click="toggleChatbot" class="close-btn">&times;</button>
      </div>

      <div class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.isUser ? 'user-message' : 'bot-message']"
        >
          {{ message.text }}
        </div>
        <div v-if="isLoading" class="message bot-message loading">
          <span class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="inputMessage"
          @keypress="handleKeyPress"
          type="text"
          placeholder="Type a message..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" class="send-btn" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>

    <!-- Chat Icon -->
    <button @click="toggleChatbot" class="chat-icon">
      💬
    </button>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 360px;
  height: 520px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #4CAF50;
  color: white;
  padding: 15px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 75%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
}

.user-message {
  background: #4CAF50;
  color: white;
  margin-left: auto;
  text-align: right;
  font-weight: 500;
}

.bot-message {
  background: white;
  color: #333;
  margin-right: auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 22px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  border-color: #4CAF50;
}

.chat-input input::placeholder {
  color: #999;
}

.send-btn {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #45a049;
}

.chat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #4CAF50;
  border: none;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.chat-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.loading {
  opacity: 0.8;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-input input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}
</style>
