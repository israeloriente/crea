<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "../stores/chat";

const props = defineProps<{
  chatId: number;
}>();

const chatStore = useChatStore();
const { getCurrentMessages } = storeToRefs(chatStore);
const newMessage = ref("");

watch(
  () => props.chatId,
  (newChatId) => {
    if (newChatId) {
      chatStore.setCurrentChat(newChatId);
    }
  },
  { immediate: true }
);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value);
    newMessage.value = "";
  }
};
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="avatar">👤</div>
      <div class="chat-info">
        <h3>Nome do Contato</h3>
        <span class="status">online</span>
      </div>
    </div>

    <div class="messages">
      <div
        v-for="message in getCurrentMessages"
        :key="message.id"
        class="message"
        :class="message.sender"
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
        <i class="fas fa-robot" title="Retomar conversa para o Robô"></i>
      </div>
      <button @click="sendMessage" class="send-button">
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
  background: #f0f2f5;

  .chat-header {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: #f0f2f5;
    border-bottom: 1px solid #e9edef;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      color: #111b21;
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
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;

    .message {
      padding: 8px 12px;
      margin: 4px 8px;
      max-width: 60%;
      border-radius: 8px;
      color: #111b21;
      display: flex;

      &.received {
        background: white;
        margin-right: auto;
        color: #111b21;
      }

      &.sent {
        background: #d9fdd3;
        margin-left: auto;
        color: #111b21;
      }

      &-content {
        max-width: 100%;
        padding: 8px 12px;
        border-radius: 8px;
        position: relative;
        font-size: 0.9rem;
        float: left;
        text-align: left;
      }

      &-time {
        font-size: 0.7rem;
        color: #667781;
        position: absolute;
        right: 8px;
        bottom: -14px;
      }
    }

    .me {
      float: right;
      color: #111b21;
      text-align: right;
      margin-left: auto;

      .message-content {
        background: #d9fdd3;
        float: right;
        text-align: right;
      }
    }

    .them {
      .message-content {
        background: white;
      }
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
        margin: 0 8px;
        cursor: pointer;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        padding: 0 8px;
        font-size: 0.95rem;
        background: transparent;
        color: #111b21;

        &::placeholder {
          color: #54656f;
        }
      }
    }

    .send-button {
      background: transparent;
      border: none;
      color: #54656f;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;

      &:hover {
        color: #00a884;
      }
    }
  }
}
</style>
