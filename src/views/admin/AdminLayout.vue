<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminNav from '@/components/admin/AdminNav.vue'
import AdminUserMenu from '@/components/admin/AdminUserMenu.vue'
import AdminPasswordModal from '@/components/admin/AdminPasswordModal.vue'
import AdminWeakPasswordBanner from '@/components/admin/AdminWeakPasswordBanner.vue'
import { useAdminBadges } from '@/composables/admin/useAdminBadges'

const route = useRoute()
const { ordersBadge, refresh } = useAdminBadges()

onMounted(refresh)
// El badge de pedidos se refresca al moverse por el panel, sin polling.
watch(() => route.name, refresh)
</script>

<template>
  <div class="admin">
    <aside class="admin__side">
      <RouterLink to="/admin" class="admin__brand">
        <span class="admin__logo"><img src="/logo.jpg" alt="Kova" width="40" height="40" /></span>
        <span class="admin__brand-text">Kova <small>Panel</small></span>
      </RouterLink>
      <AdminNav variant="side" :badge="ordersBadge" />
      <a href="/" target="_blank" rel="noopener" class="admin__store">
        <i class="fa-solid fa-store"></i> Ver tienda
        <i class="fa-solid fa-arrow-up-right-from-square admin__store-ext"></i>
      </a>
      <AdminUserMenu variant="card" />
    </aside>

    <header class="admin__top">
      <RouterLink to="/admin" class="admin__brand">
        <span class="admin__logo"><img src="/logo.jpg" alt="Kova" width="32" height="32" /></span>
        <span class="admin__brand-text">Kova <small>Panel</small></span>
      </RouterLink>
      <div class="admin__top-actions">
        <a href="/" target="_blank" rel="noopener" class="admin__icon-btn" aria-label="Ver tienda">
          <i class="fa-solid fa-store"></i>
        </a>
        <AdminUserMenu variant="compact" />
      </div>
    </header>

    <main class="admin__main">
      <AdminWeakPasswordBanner />
      <RouterView v-slot="{ Component, route: view }">
        <Transition name="admin-view" mode="out-in">
          <component :is="Component" :key="view.path" />
        </Transition>
      </RouterView>
    </main>

    <div class="admin__bottom">
      <AdminNav variant="bottom" :badge="ordersBadge" />
    </div>

    <AdminPasswordModal />
  </div>
</template>

<style scoped lang="scss">
$side-w: 256px;
$bottom-h: 64px;

.admin {
  min-height: 100vh;
  background: $paper;

  &__brand {
    @include flex(row, center, flex-start, 0.65rem);
  }

  &__logo {
    @include plinth(11px);
    padding: 2px;
    flex-shrink: 0;

    img {
      border-radius: 9px;
      object-fit: cover;
      mix-blend-mode: normal;
    }
  }

  &__brand-text {
    @include display(1.1rem, 800, 120%);
    @include flex(row, baseline, flex-start, 0.45rem);

    small {
      @include eyebrow;
      font-size: 0.6rem;
      color: inherit;
      opacity: 0.6;
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
    height: 58px;
    padding-inline: 1rem;
    @include moss;
    box-shadow: 0 6px 20px -12px rgba($ink, 0.5);
  }

  &__top-actions {
    @include flex(row, center, flex-end, 0.2rem);
  }

  &__icon-btn {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    @include flex(row, center, center);
    color: rgba(#fff, 0.78);
    transition: background-color $dur $ease-out;

    &:hover {
      background: rgba(#fff, 0.08);
    }
  }

  &__main {
    padding: 1.1rem 1rem calc(#{$bottom-h} + 1.5rem + env(safe-area-inset-bottom));
    max-width: 1180px;
  }

  &__bottom {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 60;
    height: calc(#{$bottom-h} + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: rgba($surface, 0.92);
    backdrop-filter: blur(14px) saturate(1.4);
    border-top: 1px solid $line;
    box-shadow: 0 -8px 24px -16px rgba($ink, 0.25);
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
      @include flex(column, stretch, flex-start, 1.8rem);
      padding: 1.4rem 0.9rem 1rem;
      @include moss;
      overflow-y: auto;
    }

    &__brand {
      padding-inline: 0.5rem;
    }

    &__store {
      margin-top: auto;
      @include flex(row, center, flex-start, 0.7rem);
      padding: 0.6rem 0.9rem;
      border-radius: 12px;
      font-size: $text-sm;
      color: rgba(#fff, 0.7);
      transition: background-color $dur $ease-out;

      &:hover {
        background: rgba(#fff, 0.06);
        color: #fff;
      }
    }

    &__store-ext {
      margin-left: auto;
      font-size: 0.65rem;
      opacity: 0.6;
    }

    &__main {
      margin-left: $side-w;
      padding: 2rem 2.4rem 3rem;
    }
  }
}

.admin-view-enter-active {
  transition:
    opacity 0.26s $ease-out,
    transform 0.26s $ease-out;
}
.admin-view-leave-active {
  transition: opacity 0.12s ease;
}
.admin-view-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.admin-view-leave-to {
  opacity: 0;
}

@include reduced-motion {
  .admin-view-enter-active,
  .admin-view-leave-active {
    transition: none;
  }
}
</style>
