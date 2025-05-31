import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import confetti from 'canvas-confetti';

interface MessageContent {
  type: 'human' | 'ai'
  content: string
  additional_kwargs: Record<string, unknown>
  response_metadata: Record<string, unknown>
}

function isValidMessageContent(message: unknown): message is MessageContent {
  if (!message || typeof message !== 'object') return false;
  const msg = message as MessageContent;
  return (
    (msg.type === 'human' || msg.type === 'ai') &&
    typeof msg.content === 'string' &&
    typeof msg.additional_kwargs === 'object' &&
    typeof msg.response_metadata === 'object'
  );
}

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
  isNew?: boolean
}

interface ChatState {
  chats: Chat[]
  currentChatId: number | null
  currentMessages: Message[]
  isLoadingMore: boolean
  hasMoreChats: boolean
  currentPage: number
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chats: [],
    currentChatId: null,
    currentMessages: [],
    isLoadingMore: false,
    hasMoreChats: true,
    currentPage: 0
  }),

  actions: {
    async fetchChats(loadMore = false) {
      try {
        if (this.isLoadingMore) return;

        this.isLoadingMore = true;
        console.log('Buscando chats...');
        const authStore = useAuthStore();
        const limit = 20;
        const offset = loadMore ? this.currentPage * limit : 0;

        if (!loadMore) {
          this.chats = [];
          this.currentPage = 0;
        }

        // Primeiro buscar os chats
        const { data: chatsData, error: chatsError } = await supabase
          .from('human_chats')
          .select('*')
          .eq('user', authStore.user?.id)
          .eq('bot_is_disabled', true)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (chatsError) {
          console.error('Erro ao buscar chats:', chatsError);
          return;
        }

        // Para cada chat, buscar a última mensagem
        const chatsWithMessages = await Promise.all((chatsData || []).map(async (chat) => {
          const { data: messages } = await supabase
            .from('human_chat_histories')
            .select('*')
            .eq('session_id', chat.phone)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let lastMessage = 'Nenhuma mensagem';
          if (messages) {
            const messageContent = typeof messages.message === 'string'
              ? JSON.parse(messages.message)
              : messages.message;
            lastMessage = messageContent.content;
          }

          return {
            ...chat,
            lastMessage,
            isNew: !this.chats.some(c => c.id === chat.id)
          };
        }));

        if (loadMore) {
          this.chats = [...this.chats, ...chatsWithMessages];
          this.currentPage++;
        } else {
          this.chats = chatsWithMessages;
          this.currentPage = 1;
        }

        this.hasMoreChats = chatsWithMessages.length === limit;
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      } finally {
        this.isLoadingMore = false;
      }
    },

    async fetchMessages(chatId: number, appendNew = false) {
      try {
        const currentChat = this.chats.find(chat => chat.id === chatId);
        if (!currentChat) {
          console.error('Chat não encontrado:', chatId);
          return;
        }

        const { data, error } = await supabase
          .from('human_chat_histories')
          .select('*')
          .eq('session_id', currentChat.phone)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao buscar mensagens:', error);
          return;
        }

        if (!data) {
          console.warn('Nenhuma mensagem encontrada');
          return;
        }

        const newMessages = data.reduce<Message[]>((acc, msg) => {
          try {
            const parsedMessage = typeof msg.message === 'string' 
              ? JSON.parse(msg.message) 
              : msg.message;

            if (!isValidMessageContent(parsedMessage)) {
              console.warn('Formato de mensagem inválido:', msg.id);
              return acc;
            }

            acc.push({
              id: msg.id,
              text: parsedMessage.content,
              timestamp: new Date(msg.created_at).toLocaleTimeString().slice(0, 5),
              sender: parsedMessage.type === 'human' ? 'them' : 'me'
            });
            return acc;
          } catch (parseError) {
            console.error('Erro ao processar mensagem:', msg.id, parseError);
            return acc;
          }
        }, []);

        if (appendNew) {
          const lastExistingId = this.currentMessages.length > 0
            ? this.currentMessages[this.currentMessages.length - 1].id
            : 0;

          const newMessageItems = newMessages.filter(msg => msg.id > lastExistingId);
          this.currentMessages = [...this.currentMessages, ...newMessageItems];
        } else {
          this.currentMessages = newMessages;
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        throw error; // Re-throw to handle in the UI
      }
    },

    async sendMessage(text: string) {
      // Input validation
      if (!text.trim()) {
        console.warn('Mensagem vazia não pode ser enviada');
        return;
      }

      if (!this.currentChatId) {
        console.warn('Nenhum chat selecionado');
        return;
      }

      const currentChat = this.chats.find(chat => chat.id === this.currentChatId);
      if (!currentChat) {
        console.warn('Chat selecionado não encontrado');
        return;
      }

      try {
        const now = new Date().toISOString();
        
        // Send message to webhook with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
          const webhookResponse = await fetch('https://crea.webhook.israeloriente.me/webhook/send-message-to-client', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone: currentChat.phone,
              message: text,
              created_at: now,
            }),
            signal: controller.signal
          });

          clearTimeout(timeout);

          if (!webhookResponse.ok) {
            throw new Error(`Erro no webhook: ${webhookResponse.status} ${webhookResponse.statusText}`);
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Timeout ao enviar mensagem para o webhook');
          }
          throw error;
        }

        // Save to Supabase
        const { data, error } = await supabase
          .from('human_chat_histories')
          .insert({
            session_id: currentChat.phone,
            message: JSON.stringify({
              type: 'ai',
              content: text,
              additional_kwargs: {},
              response_metadata: {}
            }),
            created_at: now
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Erro ao salvar mensagem: ${error.message}`);
        }

        if (!data) {
          throw new Error('Nenhum dado retornado ao salvar mensagem');
        }

        // Update messages locally
        this.currentMessages.push({
          id: data.id,
          text,
          timestamp: new Date(now).toLocaleTimeString().slice(0, 5),
          sender: 'me'
        });

        return data.id; // Return message ID for confirmation
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error; // Re-throw to handle in the UI
      }
    },

    async toggleBotStatus(chatId: number) {
      try {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        const response = await fetch('https://crea.webhook.israeloriente.me/webhook/finish-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId
          })
        });

        if (!response.ok) {
          console.error('Erro ao finalizar conversa:', await response.text());
          return;
        }

        // Trigger confetti effect on success
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Remove from local state
        this.chats = this.chats.filter(c => c.id !== chatId);

        // If the deleted chat was the current chat
        if (this.currentChatId === chatId) {
          // If there are other chats available, select the first one
          if (this.chats.length > 0) {
            this.setCurrentChat(this.chats[0].id);
          } else {
            // If no chats remain, clear the current chat
            this.currentChatId = null;
            this.currentMessages = [];
          }
        }
      } catch (error) {
        console.error('Erro ao finalizar conversa:', error);
      }
    },

    setCurrentChat(chatId: number) {
      this.currentChatId = chatId;
      // Marca o chat como não novo quando selecionado
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.isNew = false;
      }
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
