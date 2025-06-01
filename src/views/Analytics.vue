<template>
  <div class="analytics">
    <div class="analytics-header">
      <h1>Analytics</h1>
    </div>

    <div class="analytics-container">
      <div class="analytics-content">
        <div v-if="reports.length > 0" class="reports-table">
          <table>
            <thead>
              <tr>
                <th>Problema</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in reports" :key="index">
                <td>{{ report.problema }}</td>
                <td>{{ formatDate(report.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="no-data">
          <i class="fas fa-chart-line"></i>
          <p>Nenhum relatório encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

interface Report {
  problema: string
  created_at: string
}

const reports = ref<Report[]>([])

const fetchReports = async () => {
  try {
    const { data, error } = await supabase
      .from('relatorio')
      .select('problema, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    reports.value = data || []
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
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
  fetchReports()
})
</script>

<style scoped lang="scss">
.analytics {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;

  .analytics-header {
    padding: 16px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #e9edef;

    h1 {
      font-size: 1.2rem;
      color: #111b21;
      margin: 0;
    }
  }

  .analytics-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .analytics-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  }

  .reports-table {
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

  .no-data {
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
  .analytics {
    .analytics-container {
      padding: 12px;
    }

    .reports-table {
      overflow-x: auto;
    }
  }
}
</style>
