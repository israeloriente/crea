import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

interface Message {
  id: number
  text: string
  timestamp: string
  sender: 'me' | 'them'
}

interface Chat {
  id: number
  name: string
  phone: string
  avatar?: string
  timestamp?: string
  created_at?: string
  unread?: number
  lastMessage?: string
  messages: Message[]
  bot_is_disabled?: boolean
}

interface ChatState {
  chats: Chat[]
  currentChatId: number | null
  currentMessages: Message[]
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chats: [],
    currentChatId: null,
    currentMessages: []
  }),

  actions: {
    async fetchChats() {
      try {
        console.log('Buscando chats...');
        const authStore = useAuthStore();

        const { data, error } = await supabase
          .from('human_chats')
          .select('*')
          .eq('user', authStore.user?.id)
          .eq('bot_is_disabled', true)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar chats:', error);
          return;
        }

        console.log('Chats recebidos:', data);
        this.chats = data || [];
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    },

    async fetchMessages(chatId: number) {
      try {
        const currentChat = this.chats.find(chat => chat.id === chatId);
        if (!currentChat) return;

        const { data, error } = await supabase
          .from('human_chat_histories')
          .select('*')
          .eq('session_id', currentChat.phone)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao buscar mensagens:', error);
          return;
        }

        this.currentMessages = data.map(msg => {
          const message = typeof msg.message === 'string' ? JSON.parse(msg.message) : msg.message;
          return {
            id: msg.id,
            text: message.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString().slice(0, 5),
            sender: message.type === 'human' ? 'them' : 'me'
          };
        });
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    },

    async sendMessage(text: string) {
      if (!this.currentChatId) return;

      const currentChat = this.chats.find(chat => chat.id === this.currentChatId);
      if (!currentChat) return;

      try {
        // Send message to webhook first
        const webhookResponse = await fetch('https://crea.webhook.israeloriente.me/webhook/send-message-to-client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: currentChat.phone,
            message: text
          })
        });

        if (!webhookResponse.ok) {
          throw new Error('Failed to send message through webhook');
        }

        // Then save to Supabase
        const { data, error } = await supabase
          .from('human_chat_histories')
          .insert({
            session_id: currentChat.phone,
            message: JSON.stringify({
              type: 'ai',
              content: text,
              additional_kwargs: {},
              response_metadata: {}
            })
          })
          .select()
          .single();

        if (error) throw error;

        // Update messages locally
        this.currentMessages.push({
          id: data.id,
          text,
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          sender: 'me'
        });
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    },

    async toggleBotStatus(chatId: number) {
      try {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        const { error } = await supabase
          .from('human_chats')
          .update({ bot_is_disabled: false, status: "closed" })
          .eq('id', chatId);

        if (error) {
          console.error('Erro ao atualizar status do bot:', error);
          return;
        }

        // Update local state
        const chatIndex = this.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          this.chats[chatIndex].bot_is_disabled = false;
        }
      } catch (error) {
        console.error('Erro ao atualizar status do bot:', error);
      }
    },

    setCurrentChat(chatId: number) {
      this.currentChatId = chatId;
      this.fetchMessages(chatId);
    }
  },

  getters: {
    getCurrentChat(): Chat | undefined {
      return this.chats.find(chat => chat.id === this.currentChatId);
    },

    getCurrentMessages(): Message[] {
      return this.currentMessages;
    }
  }
})
