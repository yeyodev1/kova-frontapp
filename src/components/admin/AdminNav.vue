<script setup lang="ts">
import { useRoute } from 'vue-router'
import { adminNav, type AdminNavItem } from './adminNav'

defineProps<{ badges: Partial<Record<NonNullable<AdminNavItem['badge']>, number>>; variant: 'side' | 'bottom' }>()

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
      <span class="nav__pill" aria-hidden="true"></span>
      <span class="nav__icon">
        <i :class="item.icon"></i>
        <span v-if="item.badge && (badges[item.badge] ?? 0) > 0" class="nav__badge">
          {{ (badges[item.badge] ?? 0) > 99 ? '99+' : badges[item.badge] }}
        </span>
      </span>
      <span class="nav__label">{{ variant === 'bottom' ? item.short : item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  &__link {
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  &__icon {
    position: relative;
    z-index: 1;
    @include flex(row, center, center);
    width: 1.4rem;
    transition: transform $dur $ease-spring;
  }

  &__label {
    position: relative;
    z-index: 1;
  }

  &__badge {
    position: absolute;
    top: -0.55rem;
    right: -0.8rem;
    min-width: 1.1rem;
    height: 1.1rem;
    padding-inline: 0.25rem;
    border-radius: $radius-pill;
    background: $cta;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.6rem;
    font-weight: 700;
    line-height: 1.1rem;
    text-align: center;
    box-shadow: 0 0 0 2px $surface;
  }

  &__pill {
    position: absolute;
    opacity: 0;
    transition:
      opacity $dur $ease-out,
      transform $dur $ease-out;
  }

  // Móvil: el ícono activo sube un poco y se asienta sobre una píldora de aluminio.
  &--bottom {
    @include flex(row, stretch, space-around);
    height: 100%;
    padding-inline: 0.25rem;

    .nav__link {
      flex: 1 1 0;
      min-width: 0;
      @include flex(column, center, center, 0.3rem);
      font-size: 0.62rem;
      font-weight: 600;
      color: $ink-muted;

      i {
        font-size: 1.02rem;
      }

      &:active .nav__icon {
        transform: scale(0.88);
      }

      &--active {
        color: $accent-deep;

        .nav__icon {
          transform: translateY(-1px);
          color: $accent-deep;
        }

        .nav__pill {
          opacity: 1;
          transform: translateX(-50%) scaleX(1);
        }
      }
    }

    .nav__pill {
      top: 0.45rem;
      left: 50%;
      width: 3.1rem;
      height: 1.85rem;
      border-radius: $radius-pill;
      background: linear-gradient(180deg, $accent-soft, darken($accent-soft, 4%));
      box-shadow: inset 0 1px 0 rgba(#fff, 0.8);
      transform: translateX(-50%) scaleX(0.4);
    }

    .nav__label {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // Desktop: lista sobre musgo; el activo lleva una franja de aluminio a la izquierda.
  &--side {
    @include flex(column, stretch, flex-start, 0.15rem);

    .nav__link {
      @include flex(row, center, flex-start, 0.8rem);
      padding: 0.68rem 0.9rem;
      border-radius: 12px;
      font-size: $text-sm;
      font-weight: 500;
      color: rgba(#fff, 0.68);
      transition:
        color $dur $ease-out,
        background-color $dur $ease-out;

      i {
        color: rgba(#fff, 0.5);
        transition: color $dur $ease-out;
      }

      &:hover {
        color: #fff;
        background: rgba(#fff, 0.05);
      }

      &--active {
        color: #fff;
        font-weight: 600;
        background: rgba(#fff, 0.09);

        i {
          color: $alu;
        }

        .nav__pill {
          opacity: 1;
          transform: scaleY(1);
        }
      }
    }

    .nav__pill {
      left: 0;
      top: 22%;
      bottom: 22%;
      width: 3px;
      border-radius: $radius-pill;
      background: linear-gradient(180deg, #fff, $alu-dark);
      transform: scaleY(0);
    }

    .nav__badge {
      box-shadow: 0 0 0 2px $accent-deep;
    }
  }

  @include reduced-motion {
    &__icon,
    &__pill {
      transition: none;
    }
  }
}
</style>
