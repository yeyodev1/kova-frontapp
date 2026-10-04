<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AdminNav from '@/components/admin/AdminNav.vue'
import { useAdminBadges } from '@/composables/admin/useAdminBadges'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { ordersBadge, refresh } = useAdminBadges()

onMounted(refresh)
// El badge de pedidos se refresca al moverse por el panel, sin polling.
watch(() => route.name, refresh)

function logout() {
  userStore.clear()
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div class="admin">
    <aside class="admin__side">
      <RouterLink to="/admin" class="admin__brand">
        <img src="/logo.jpg" alt="Kova" width="36" height="36" />
        <span>Kova <small>admin</small></span>
      </RouterLink>
      <AdminNav variant="side" :badge="ordersBadge" />
      <div class="admin__user">
        <p class="admin__user-name">{{ userStore.user?.name || 'Admin' }}</p>
        <p class="admin__user-mail">{{ userStore.user?.email }}</p>
        <button class="admin__logout" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Salir
        </button>
      </div>
    </aside>

    <header class="admin__top">
      <RouterLink to="/admin" class="admin__brand">
        <img src="/logo.jpg" alt="Kova" width="32" height="32" />
        <span>Kova <small>admin</small></span>
      </RouterLink>
      <div class="admin__top-actions">
        <a href="/" target="_blank" rel="noopener" class="admin__icon-btn" aria-label="Ver tienda">
          <i class="fa-solid fa-store"></i>
        </a>
        <button class="admin__icon-btn" aria-label="Salir" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </header>

    <main class="admin__main">
      <RouterView />
    </main>

    <div class="admin__bottom">
      <AdminNav variant="bottom" :badge="ordersBadge" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$side-w: 248px;
$bottom-h: 62px;

.admin {
  min-height: 100vh;
  background: $paper;

  &__brand {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.05rem;

    img {
      border-radius: 8px;
      object-fit: cover;
    }

    small {
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 500;
      color: $ink-muted;
      margin-left: 0.15rem;
    }
  }

  &__side {
    display: none;
  }

  &__top {
    position: sticky;
    top: 0;
    z-index: 50;
    @include flex(row, center, space-between);
    height: 56px;
    padding-inline: 1rem;
    background: rgba($surface, 0.94);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid $line;
  }

  &__top-actions {
    @include flex(row, center, flex-end, 0.3rem);
  }

  &__icon-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink-soft;
  }

  &__main {
    padding: 1rem 1rem calc(#{$bottom-h} + 1.5rem + env(safe-area-inset-bottom));
    max-width: 1180px;
  }

  &__bottom {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 60;
    height: calc(#{$bottom-h} + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: $surface;
    border-top: 1px solid $line;
  }

  @include from('md') {
    &__top,
    &__bottom {
      display: none;
    }

    &__side {
      position: fixed;
      inset: 0 auto 0 0;
      width: $side-w;
      @include flex(column, stretch, flex-start, 1.6rem);
      padding: 1.4rem 1rem;
      background: $surface;
      border-right: 1px solid $line;
      overflow-y: auto;
    }

    &__brand {
      padding-inline: 0.5rem;
    }

    &__user {
      margin-top: auto;
      padding: 0.9rem;
      border-radius: $radius-sm;
      background: $paper;
    }

    &__user-name {
      font-weight: 600;
      font-size: $text-sm;
    }

    &__user-mail {
      font-size: $text-xs;
      color: $ink-muted;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__logout {
      margin-top: 0.6rem;
      font-size: $text-sm;
      color: $danger;
      @include flex(row, center, flex-start, 0.4rem);
    }

    &__main {
      margin-left: $side-w;
      padding: 2rem 2.2rem 3rem;
    }
  }
}
</style>
