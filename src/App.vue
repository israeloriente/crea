<script setup lang="ts">
import NavMenu from './components/NavMenu.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { computed } from 'vue';

const route = useRoute();
const authStore = useAuthStore();

const showNav = computed(() => {
  return authStore.user && route.meta.requiresAuth;
});
</script>

<template>
  <div class="app-container">
    <NavMenu v-if="showNav" />
    <main class="main-content" :class="{ 'with-nav': showNav }">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;

  &.with-nav {
    width: calc(100% - 70px);
  }
}

@media (max-width: 768px) {
  .main-content {
    &.with-nav {
      width: 100%;
      padding-bottom: 60px; // Space for bottom navigation
    }
  }
}
</style>
