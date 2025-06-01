<template>
  <div class="historico">
    <div class="historico-header">
      <h1>Histórico de Atendimentos Humano</h1>
    </div>

    <div class="historico-container">
      <div v-if="atendimentos.length > 0" class="historico-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Telefone</th>
              <th>Avaliação</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(atendimento, index) in atendimentos" :key="index">
              <td>{{ atendimento.id }}</td>
              <td>{{ atendimento.phone }}</td>
              <td>
                <div class="rating">
                  <i v-for="star in 5" :key="star" class="fas fa-star"
                    :class="{ active: star <= atendimento.rate }">
                  </i>
                </div>
              </td>
              <td>{{ formatDate(atendimento.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-historico">
        <i class="fas fa-history"></i>
        <p>Nenhum atendimento finalizado</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

interface Atendimento {
  id: string
  phone: string
  rate: number
  created_at: string
}

const atendimentos = ref<Atendimento[]>([])
const authStore = useAuthStore()

const fetchAtendimentos = async () => {
  try {
    const { data, error } = await supabase
      .from('human_chats')
      .select('id, phone, rate, created_at')
      .eq('status', 'closed')
      .eq('user', authStore.user?.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    atendimentos.value = data || []
  } catch (error) {
    console.error('Error fetching atendimentos:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchAtendimentos()
})
</script>

<style scoped lang="scss">
.historico {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;

  .historico-header {
    padding: 16px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #e9edef;

    h1 {
      font-size: 1.2rem;
      color: #111b21;
      margin: 0;
    }
  }

  .historico-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .historico-table {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #e9edef;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #111b21;
        font-size: 0.9rem;
      }

      td {
        color: #111b21;
        font-size: 0.9rem;
      }
    }
  }

  .rating {
    display: flex;
    gap: 4px;

    i {
      color: #ddd;
      font-size: 0.9rem;

      &.active {
        color: #ffd700;
      }
    }
  }

  .no-historico {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #667781;

    i {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    p {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 768px) {
  .historico {
    .historico-container {
      padding: 12px;
    }

    .historico-table {
      overflow-x: auto;
    }
  }
}
</style>
