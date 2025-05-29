<template>
  <div class="chat-container">
    <ChatList @select-chat="handleChatSelect" :selectedChatId="selectedChat" />
    <ChatWindow v-if="selectedChat" :chatId="selectedChat" />
    <div v-else class="no-chat-selected">
      <p>Selecione uma conversa para começar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chat';
import ChatList from "../components/ChatList.vue";
import ChatWindow from "../components/ChatWindow.vue";

const chatStore = useChatStore();
const { currentChatId } = storeToRefs(chatStore);
const selectedChat = ref<number | null>(null);

const handleChatSelect = (chatId: number) => {
  selectedChat.value = chatId;
  chatStore.setCurrentChat(chatId);
};

// Sync the selected chat with the store
watch(currentChatId, (newChatId) => {
  selectedChat.value = newChatId;
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f0f2f5;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  color: #54656f;
  font-size: 1.1rem;
}
</style>
