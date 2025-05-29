<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';

defineProps<{
  selectedChatId: number | null;
}>();

const emit = defineEmits<{
  (e: 'select-chat', chatId: number): void;
}>();

const chatStore = useChatStore();

// Mock data for conversations with last messages from the store
const conversations = computed(() => [
  {
    id: 1,
    name: 'João Silva',
    lastMessage: chatStore.chats[0]?.messages[chatStore.chats[0]?.messages.length - 1]?.text || '',
    timestamp: chatStore.chats[0]?.messages[chatStore.chats[0]?.messages.length - 1]?.timestamp || '',
    unread: 2,
    avatar: '👤'
  },
  {
    id: 2,
    name: 'Maria Santos',
    lastMessage: chatStore.chats[1]?.messages[chatStore.chats[1]?.messages.length - 1]?.text || '',
    timestamp: chatStore.chats[1]?.messages[chatStore.chats[1]?.messages.length - 1]?.timestamp || '',
    unread: 0,
    avatar: '👤'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    lastMessage: chatStore.chats[2]?.messages[chatStore.chats[2]?.messages.length - 1]?.text || '',
    timestamp: chatStore.chats[2]?.messages[chatStore.chats[2]?.messages.length - 1]?.timestamp || '',
    unread: 1,
    avatar: '👤'
  }
]);
</script>

<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <h2>Conversas</h2>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Pesquisar ou começar nova conversa" />
      </div>
    </div>
    <div class="conversations">
      <div
        v-for="chat in conversations"
        :key="chat.id"
        class="chat-card"
        :class="{ 'selected': selectedChatId === chat.id }"
        @click="$emit('select-chat', chat.id)"
      >
        <div class="avatar">{{ chat.avatar }}</div>
        <div class="chat-info">
          <div class="chat-header">
            <h3>{{ chat.name }}</h3>
            <span class="timestamp">{{ chat.timestamp }}</span>
          </div>
          <div class="last-message">
            <p>{{ chat.lastMessage }}</p>
            <span v-if="chat.unread" class="unread-badge">{{ chat.unread }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-list {
  width: 350px;
  border-right: 1px solid #e9edef;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &-header {
    padding: 16px;
    background: #f0f2f5;

    h2 {
      margin: 0 0 16px 0;
      font-size: 1.2rem;
      color: #41525d;
    }
  }
}

.search-box {
  position: relative;
  margin-bottom: 8px;

  input {
    width: 100%;
    padding: 8px 32px;
    border-radius: 8px;
    border: none;
    background: white;
    font-size: 0.9rem;
    color: #111b21;
  }

  i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #54656f;
  }
}

.conversations {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 116px);
  background: white;
}

.chat-card {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #e9edef;
  min-height: 72px;
  max-height: 72px;
  overflow: hidden;

  &:hover {
    background: #f5f6f6;
  }

  &.selected {
    background: #f0f2f5;
  }
}

.avatar {
  width: 49px;
  height: 49px;
  background: #dfe5e7;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.chat-info {
  flex: 1;
  min-width: 0; // Importante para que o texto não force a expansão
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #111b21;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
}

.timestamp {
  font-size: 0.75rem;
  color: #667781;
  white-space: nowrap;
}

.last-message {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #111b21;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 20px; // Para garantir altura consistente
  }
}

.unread-badge {
  background: #25d366;
  color: white;
  font-size: 0.75rem;
  padding: 0 6px;
  border-radius: 12px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
