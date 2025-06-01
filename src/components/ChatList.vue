<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <div class="header-top">
        <h2>Conversas</h2>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar ou começar nova conversa"
        />
      </div>
    </div>
    <div class="conversations" ref="conversationsRef">
      <div v-if="conversations.length === 0 && !isLoadingMore" class="no-conversations">
        Aguardando Novas Mensagens
      </div>
      <div
        v-for="chat in conversations"
        :key="chat.id"
        class="chat-card"
        :class="{ selected: selectedChatId === chat.id }"
        @click="$emit('select-chat', chat.id)"
      >
        <div class="avatar">{{ chat.avatar || '👤' }}</div>
        <div class="chat-info">
          <div class="chat-header">
            <h3>{{ chat.phone }}</h3>
            <span class="timestamp">{{ formatTimestamp(chat.timestamp || chat.created_at) }}</span>
          </div>
          <div class="last-message">
            <p>{{ chat.lastMessage || 'Nenhuma mensagem' }}</p>
            <span v-if="chat.isNew" class="unread-badge">new</span>
          </div>
        </div>
      </div>
      <div v-if="isLoadingMore" class="loading-more">
        <i class="fas fa-spinner fa-spin"></i>
        Carregando mais chats...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useChatStore } from "../stores/chat";
import { storeToRefs } from 'pinia';
import moment from 'moment';

defineProps<{
  selectedChatId: number | null;
}>();

defineEmits<{
  (e: "select-chat", chatId: number): void;
}>();

const chatStore = useChatStore();
const { isLoadingMore, hasMoreChats } = storeToRefs(chatStore);
const searchQuery = ref("");
const conversationsRef = ref<HTMLElement | null>(null);

const conversations = computed(() => {
  const chats = chatStore.chats;

  if (!searchQuery.value.trim()) {
    return chats;
  }

  const query = searchQuery.value.toLowerCase();
  return chats.filter(chat =>
    chat.phone.toLowerCase().includes(query)
  );
});

function formatTimestamp(timestamp: string | Date | undefined): string {
  if (!timestamp) return '';
  return moment(timestamp).format('HH:mm - DD/MM');
}

const handleScroll = async () => {
  if (!conversationsRef.value || isLoadingMore.value || !hasMoreChats.value) return;

  const { scrollTop, scrollHeight, clientHeight } = conversationsRef.value;
  if (scrollHeight - scrollTop <= clientHeight + 100) {
    await chatStore.fetchChats(true);
  }
};

onMounted(() => {
  if (conversationsRef.value) {
    conversationsRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (conversationsRef.value) {
    conversationsRef.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped lang="scss">
.chat-list {
  width: 350px;
  border-right: 1px solid #e9edef;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;

  &-header {
    padding: 16px;
    background: #f0f2f5;

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #111b21;
      }
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

    &::placeholder {
      color: #54656f;
    }
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
  background: white;
}

.chat-card {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #e9edef;
  min-height: 72px;
  transition: background-color 0.2s;

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
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
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
    text-align: start;
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
    color: #667781;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 20px;
    text-align: start;
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

.no-conversations {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #667781;
  font-size: 1rem;
}

.loading-more {
  padding: 16px;
  text-align: center;
  color: #667781;
  font-size: 0.9rem;

  i {
    margin-right: 8px;
  }
}

@media (max-width: 768px) {
  .chat-list {
    width: 100%;
    height: auto;
    max-height: calc(100vh - 60px);
  }

  .conversations {
    max-height: calc(100vh - 140px);
  }
}
</style>
