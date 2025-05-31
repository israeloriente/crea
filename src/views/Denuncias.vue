<template>
  <div class="denuncias">
    <h1>Denúncias</h1>
    <div class="denuncias-list">
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

<style scoped>
.denuncias {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.denuncias-list {
  margin-top: 2rem;
}

.denuncia-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.denuncia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.denuncia-header h3 {
  margin: 0;
  color: #2c3e50;
}

.denuncia-data {
  color: #6c757d;
  font-size: 0.9rem;
}

.denuncia-resumo {
  margin-bottom: 1rem;
  color: #495057;
}

.denuncia-detalhes {
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  margin: 1rem 0;
}

.ver-mais-btn {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ver-mais-btn:hover {
  background-color: #535bf2;
}
</style>
