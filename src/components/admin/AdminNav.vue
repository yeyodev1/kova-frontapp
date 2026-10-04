<script setup lang="ts">
import { useRoute } from 'vue-router'
import { adminNav, type AdminNavItem } from './adminNav'

defineProps<{ badge: number; variant: 'side' | 'bottom' }>()

const route = useRoute()

// "Pedidos" sigue activo dentro del detalle de un pedido, igual "Productos".
function isActive(item: AdminNavItem) {
  if (item.to === '/admin') return route.path === '/admin' || route.path === '/admin/'
  return route.path.startsWith(item.to)
}
</script>

<template>
  <nav class="nav" :class="`nav--${variant}`" aria-label="Panel de administración">
    <RouterLink
      v-for="item in adminNav"
      :key="item.to"
      :to="item.to"
      class="nav__link"
      :class="{ 'nav__link--active': isActive(item) }"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      <span class="nav__icon">
        <i :class="item.icon"></i>
        <span v-if="item.badge && badge > 0" class="nav__badge">{{ badge > 99 ? '99+' : badge }}</span>
      </span>
      <span class="nav__label">{{ variant === 'bottom' ? item.short : item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  &__icon {
    position: relative;
    @include flex(row, center, center);
    width: 1.4rem;
  }

  &__badge {
    position: absolute;
    top: -0.55rem;
    right: -0.75rem;
    min-width: 1.1rem;
    height: 1.1rem;
    padding-inline: 0.25rem;
    border-radius: $radius-pill;
    background: $cta;
    color: $surface;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.1rem;
    text-align: center;
  }

  &--bottom {
    @include flex(row, stretch, space-around);
    height: 100%;

    .nav__link {
      flex: 1 1 0;
      min-width: 0;
      @include flex(column, center, center, 0.25rem);
      font-size: 0.64rem;
      font-weight: 600;
      color: $ink-muted;
      padding-top: 0.2rem;

      i {
        font-size: 1.05rem;
      }

      &--active {
        color: $accent-deep;

        .nav__icon i {
          color: $accent;
        }
      }
    }

    .nav__label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &--side {
    @include flex(column, stretch, flex-start, 0.2rem);

    .nav__link {
      @include flex(row, center, flex-start, 0.75rem);
      padding: 0.7rem 0.9rem;
      border-radius: $radius-sm;
      font-size: $text-sm;
      font-weight: 500;
      color: $ink-soft;
      @include transition(background);

      i {
        color: $ink-muted;
      }

      &:hover {
        background: $sand;
      }

      &--active {
        background: $accent-soft;
        color: $accent-deep;
        font-weight: 600;

        i {
          color: $accent;
        }
      }
    }
  }
}
</style>
