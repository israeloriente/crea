import { defineStore } from 'pinia'

interface Message {
  id: number
  text: string
  timestamp: string
  sender: 'me' | 'them'
}

interface Chat {
  id: number
  messages: Message[]
}

interface ChatState {
  chats: Chat[]
  currentChatId: number | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chats: [
      {
        id: 1,
        messages: [
          {
            id: 1,
            text: 'Olá, tudo bem?',
            timestamp: '10:30',
            sender: 'them'
          },
          {
            id: 2,
            text: 'Oi! Tudo bem, e você?',
            timestamp: '10:31',
            sender: 'me'
          },
          {
            id: 3,
            text: 'Estou bem também! Precisava de uma ajuda com um projeto.',
            timestamp: '10:32',
            sender: 'them'
          }
        ]
      },
      {
        id: 2,
        messages: [
          {
            id: 1,
            text: 'Podemos marcar uma reunião?',
            timestamp: '09:45',
            sender: 'them'
          }
        ]
      },
      {
        id: 3,
        messages: [
          {
            id: 1,
            text: 'Obrigado pela ajuda!',
            timestamp: '15:20',
            sender: 'them'
          }
        ]
      }
    ],
    currentChatId: null
  }),

  actions: {
    sendMessage(text: string) {
      if (!this.currentChatId) return

      const currentChat = this.chats.find(chat => chat.id === this.currentChatId)
      if (!currentChat) return

      const message: Message = {
        id: currentChat.messages.length + 1,
        text,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        sender: 'me'
      }
      currentChat.messages.push(message)
    },

    setCurrentChat(chatId: number) {
      this.currentChatId = chatId
    }
  },

  getters: {
    getCurrentMessages(): Message[] {
      const currentChat = this.chats.find(chat => chat.id === this.currentChatId)
      return currentChat?.messages || []
    }
  }
})
