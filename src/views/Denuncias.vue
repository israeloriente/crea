<template>
  <div class="denuncias">
    <div class="denuncias-header">
      <h1>Denúncias</h1>
    </div>
    
    <div class="denuncias-container">
      <div class="denuncias-list" v-if="denuncias.length > 0">
        <div
          v-for="(denuncia, index) in denuncias"
          :key="index"
          class="denuncia-item"
        >
          <div class="denuncia-header">
            <h3>{{ denuncia.title }}</h3>
            <span class="denuncia-data">{{ formatDate(denuncia.created_at) }}</span>
          </div>
          <p class="denuncia-resumo">{{ getContentPreview(denuncia.content) }}</p>
          <div class="denuncia-detalhes" v-if="denuncia.mostrarMais">
            <p>{{ denuncia.content }}</p>
          </div>
          <button
            class="ver-mais-btn"
            @click="toggleMostrarMais(index)"
          >
            {{ denuncia.mostrarMais ? 'Ver menos' : 'Ver mais' }}
          </button>
        </div>
      </div>
      <div v-else class="no-denuncias">
        <i class="fas fa-exclamation-circle"></i>
        <p>Nenhuma denúncia disponível</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

interface Denuncia {
  created_at: string
  title: string
  content: string
  mostrarMais?: boolean
}

const denuncias = ref<Denuncia[]>([])

const fetchDenuncias = async () => {
  try {
    const { data, error } = await supabase
      .from('denuncias')
      .select('created_at, title, content')

    if (error) throw error

    if (data) {
      denuncias.value = data.map(item => ({
        ...item,
        mostrarMais: false
      }))
    }
  } catch (error) {
    console.error('Error fetching denuncias:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const toggleMostrarMais = (index: number) => {
  denuncias.value[index].mostrarMais = !denuncias.value[index].mostrarMais
}

const getContentPreview = (content: string): string => {
  const maxLength = 150
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

onMounted(() => {
  fetchDenuncias()
})
</script>

<style scoped lang="scss">
.denuncias {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;

  .denuncias-header {
    padding: 16px;
    background-color: #f0f2f5;
    border-bottom: 1px solid #e9edef;
    
    h1 {
      font-size: 1.2rem;
      color: #111b21;
      margin: 0;
    }
  }

  .denuncias-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .denuncias-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .denuncia-item {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .denuncia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      color: #111b21;
      font-size: 1rem;
    }
  }

  .denuncia-data {
    color: #667781;
    font-size: 0.8rem;
  }

  .denuncia-resumo {
    margin-bottom: 12px;
    color: #111b21;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .denuncia-detalhes {
    padding: 12px;
    background-color: #f0f2f5;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 0.9rem;
    color: #111b21;
  }

  .ver-mais-btn {
    background-color: #00a884;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: darken(#00a884, 5%);
    }
  }

  .no-denuncias {
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
  .denuncias {
    .denuncias-container {
      padding: 12px;
    }

    .denuncia-item {
      padding: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
