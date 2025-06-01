<template>
  <nav class="nav-menu">
    <div class="nav-items">
      <router-link to="/chat" class="nav-item" :class="{ active: $route.path === '/chat' }">
        <i class="fas fa-comments"></i>
        <span>Chat</span>
      </router-link>
      <router-link to="/analytics" class="nav-item" :class="{ active: $route.path === '/analytics' }">
        <i class="fas fa-chart-line"></i>
        <span>Analytics</span>
      </router-link>
      <router-link to="/historico" class="nav-item" :class="{ active: $route.path === '/historico' }">
        <i class="fas fa-history"></i>
        <span>Histórico</span>
      </router-link>
      <router-link to="/denuncias" class="nav-item" :class="{ active: $route.path === '/denuncias' }">
        <i class="fas fa-exclamation-circle"></i>
        <span>Denúncias</span>
      </router-link>
    </div>
    <button @click="handleLogout" class="nav-item logout-button">
      <i class="fas fa-sign-out-alt"></i>
      <span>Sair</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}
</script>

<style scoped lang="scss">
.nav-menu {
  width: 70px;
  background-color: #f0f2f5;
  border-right: 1px solid #e9edef;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 0;
  height: 100vh;

  .nav-items {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    color: #54656f;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;

    i {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }

    span {
      font-size: 0.75rem;
      text-align: center;
    }

    &:hover {
      background-color: #e9edef;
      color: #00a884;
    }

    &.active {
      color: #00a884;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background-color: #00a884;
      }
    }
  }

  .logout-button {
    margin-top: auto;

    &:hover {
      color: #dc3545;
    }
  }
}

@media (max-width: 768px) {
  .nav-menu {
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 8px 0;
    box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);

    .nav-items {
      flex-direction: row;
      flex: 1;
      justify-content: space-around;
    }

    .nav-item {
      padding: 8px 0;

      &.active::after {
        width: 100%;
        height: 3px;
        top: auto;
        bottom: 0;
      }
    }

    .logout-button {
      margin-top: 0;
    }
  }
}
</style>
