<template>
  <nav class="nav-menu">
    <router-link to="/chat" class="nav-item" :class="{ active: $route.path === '/chat' }">
      <i class="fas fa-comments"></i>
      <span>Chat</span>
    </router-link>
    <router-link to="/denuncias" class="nav-item" :class="{ active: $route.path === '/denuncias' }">
      <i class="fas fa-exclamation-circle"></i>
      <span>Denúncias</span>
    </router-link>
  </nav>
</template>

<style scoped lang="scss">
.nav-menu {
  width: 70px;
  background-color: #f0f2f5;
  border-right: 1px solid #e9edef;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  height: 100vh;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    color: #54656f;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;

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

    .nav-item {
      padding: 8px 0;

      &.active::after {
        width: 100%;
        height: 3px;
        top: auto;
        bottom: 0;
      }
    }
  }
}
</style>