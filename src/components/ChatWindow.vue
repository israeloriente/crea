<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "../stores/chat";
import { supabase } from "../lib/supabase";

const props = defineProps<{
  chatId: number;
}>();

const chatStore = useChatStore();
const { getCurrentChat, getCurrentMessages } = storeToRefs(chatStore);
const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 100);
};

watch(
  getCurrentMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

watch(
  () => props.chatId,
  (newChatId) => {
    if (newChatId) {
      chatStore.setCurrentChat(newChatId);
      scrollToBottom();
    }
  },
  { immediate: true }
);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value);
    newMessage.value = "";
    scrollToBottom();
  }
};

const handleBotToggle = async () => {
  if (props.chatId) {
    await chatStore.toggleBotStatus(props.chatId);
  }
};

onMounted(() => {
  if (!getCurrentChat.value?.phone) return;

  const channel = supabase
    .channel("human_chat_histories")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "human_chat_histories",
        filter: `session_id=eq.${getCurrentChat.value.phone}`,
      },
      (payload) => {
        if (payload.eventType === "INSERT") {
          // Usa appendNew=true para preservar as mensagens existentes
          chatStore.fetchMessages(props.chatId, true);
        }
      }
    )
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(channel);
  });
});
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="chat-header-content">
        <div class="avatar">👤</div>
        <div class="chat-info">
          <h3>{{ getCurrentChat?.phone || "Sem número" }}</h3>
          <span class="status">online</span>
        </div>
      </div>
      <button
        class="robot-button"
        @click="handleBotToggle"
        title="Retomar conversa para o Robô"
      >
        <i class="fas fa-robot"></i>
      </button>
    </div>

    <div class="messages" ref="messagesContainer">
      <div
        v-for="message in getCurrentMessages"
        :key="message.id"
        class="message"
        :class="{
          me: message.sender === 'me',
          them: message.sender === 'them',
        }"
      >
        <div class="message-content">
          {{ message.text }}
          <span class="message-time">{{ message.timestamp }}</span>
        </div>
      </div>
    </div>

    <div class="message-input">
      <div class="input-container">
        <i class="far fa-smile"></i>
        <input
          type="text"
          v-model="newMessage"
          placeholder="Digite uma mensagem"
          @keyup.enter="sendMessage"
        />
      </div>
      <button
        @click="sendMessage"
        class="send-button"
        :disabled="!newMessage.trim()"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #efeae2;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #f0f2f5;
    border-bottom: 1px solid #e9edef;

    .chat-header-content {
      display: flex;
      align-items: center;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: #dfe5e7;
      border-radius: 50%;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .chat-info {
      h3 {
        margin: 0;
        font-size: 1rem;
        color: #111b21;
      }

      .status {
        font-size: 0.8rem;
        color: #667781;
      }
    }

    .robot-button {
      background: none;
      border: none;
      color: #54656f;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s;

      &:hover {
        background: #e9edef;
        color: #00a884;
      }
    }
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .message {
      max-width: 65%;
      margin: 4px 0;
      display: flex;

      &-content {
        padding: 8px 12px;
        border-radius: 8px;
        position: relative;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      &-time {
        font-size: 0.7rem;
        color: #667781;
        margin-left: 8px;
        align-self: flex-end;
      }

      &.me {
        margin-left: auto;

        .message-content {
          background: #d9fdd3;
          color: #111b21;
        }
      }

      &.them {
        margin-right: auto;

        .message-content {
          background: white;
          color: #111b21;
        }
      }
    }

    .no-messages {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667781;
      font-size: 1rem;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
  }

  .message-input {
    padding: 10px 16px;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    gap: 8px;

    .input-container {
      flex: 1;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 8px;
      padding: 8px 12px;

      i {
        color: #54656f;
        font-size: 1.2rem;
        margin-right: 8px;
        cursor: pointer;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        padding: 0;
        font-size: 0.95rem;
        background: transparent;
        color: #111b21;

        &::placeholder {
          color: #54656f;
        }
      }
    }

    .send-button {
      background: none;
      border: none;
      color: #54656f;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        color: #00a884;
      }

      &:disabled {
        color: #b3b3b3;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 768px) {
  .chat-window {
    height: calc(100vh - 60px); // Account for bottom navigation
  }
}
</style>
