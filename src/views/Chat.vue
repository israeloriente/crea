<template>
  <div class="chat-container">
    <ChatList @select-chat="handleChatSelect" :selectedChatId="selectedChat" />
    <ChatWindow v-if="selectedChat" :chatId="selectedChat" />
    <div v-else class="no-chat-selected">
      <i class="fas fa-comments"></i>
      <p>Selecione uma conversa para começar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chat';
import ChatList from "../components/ChatList.vue";
import ChatWindow from "../components/ChatWindow.vue";
import { supabase } from "../lib/supabase";

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

onMounted(async () => {
  await chatStore.fetchChats();

  const channel = supabase
    .channel('public:human_chats')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'human_chats',
      },
      () => {
        chatStore.fetchChats();
      }
    )
    .subscribe();

  // Adiciona listener para novas mensagens
  const messagesChannel = supabase
    .channel('public:human_chat_histories')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'human_chat_histories',
      },
      (payload) => {
        const message = typeof payload.new.message === 'string'
          ? JSON.parse(payload.new.message)
          : payload.new.message;

        // Atualiza a última mensagem e marca como novo se necessário
        const chat = chatStore.chats.find(c => c.phone === payload.new.session_id);
        if (chat) {
          chat.lastMessage = message.content;
          if (chat.id !== selectedChat.value && message.type === 'human') {
            chat.isNew = true;
          }
        }
      }
    )
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(channel);
    supabase.removeChannel(messagesChannel);
  });
});
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f0f2f5;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #667781;

  i {
    font-size: 4rem;
    margin-bottom: 16px;
    color: #00a884;
  }

  p {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
}
</style>
