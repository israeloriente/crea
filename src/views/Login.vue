<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isRegister = ref(false)

async function handleSubmit() {
  if (isRegister.value) {
    await authStore.register(email.value, password.value)
  } else {
    await authStore.login(email.value, password.value)
  }

  if (authStore.user && !authStore.error) {
    router.push('/chat')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isRegister ? 'Criar Conta' : 'Login' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
          >
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Sua senha"
          >
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="submit-button"
        >
          {{ authStore.loading ? 'Carregando...' : (isRegister ? 'Criar Conta' : 'Entrar') }}
        </button>
      </form>

      <p class="toggle-mode">
        {{ isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?' }}
        <a href="#" @click.prevent="isRegister = !isRegister">
          {{ isRegister ? 'Faça login' : 'Crie uma' }}
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    color: #1a1a1a;
    margin-bottom: 30px;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    color: #4a4a4a;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #646cff;
    }
  }
}

.submit-button {
  background-color: #646cff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #535bf2;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.toggle-mode {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;

  a {
    color: #646cff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>