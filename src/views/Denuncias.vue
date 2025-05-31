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
          <button
            class="ver-mais-btn"
            @click="openModal(denuncia)"
          >
            Ver mais
          </button>
        </div>
      </div>
      <div v-else class="no-denuncias">
        <i class="fas fa-exclamation-circle"></i>
        <p>Nenhuma denúncia disponível</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedDenuncia" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <h2>{{ selectedDenuncia.title }}</h2>
        <div class="modal-body">
          <p>{{ selectedDenuncia.content }}</p>
          <div class="modal-footer">
            <span class="modal-date">{{ formatDate(selectedDenuncia.created_at) }}</span>
          </div>
        </div>
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
}

const denuncias = ref<Denuncia[]>([])
const selectedDenuncia = ref<Denuncia | null>(null)

const fetchDenuncias = async () => {
  try {
    const { data, error } = await supabase
      .from('denuncias')
      .select('created_at, title, content')

    if (error) throw error

    if (data) {
      denuncias.value = data
    }
  } catch (error) {
    console.error('Error fetching denuncias:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getContentPreview = (content: string): string => {
  const maxLength = 150
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const openModal = (denuncia: Denuncia) => {
  selectedDenuncia.value = denuncia
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedDenuncia.value = null
  document.body.style.overflow = 'auto'
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

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background-color: white;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 24px;
    border-radius: 8px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 1.5rem;
      color: #111b21;
      margin-bottom: 16px;
      padding-right: 40px;
    }
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #54656f;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f2f5;
      color: #111b21;
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    line-height: 1.6;
    color: #111b21;
  }

  .modal-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e9edef;
  }

  .modal-date {
    color: #667781;
    font-size: 0.9rem;
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
