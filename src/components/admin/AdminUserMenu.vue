<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePasswordChange } from '@/composables/admin/usePasswordChange'
import { useDismiss } from '@/composables/admin/useDismiss'

// 'card' es la tarjeta del pie de la barra lateral; 'compact', el avatar de la barra móvil.
const props = defineProps<{ variant: 'card' | 'compact' }>()

const router = useRouter()
const userStore = useUserStore()
const { weak, show } = usePasswordChange()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const menuId = `user-menu-${props.variant}`

const name = computed(() => userStore.user?.name || 'Admin')
const initial = computed(() =>
  (userStore.user?.name || userStore.user?.email || 'A').charAt(0).toUpperCase(),
)

useDismiss(open, root)

function changePassword() {
  open.value = false
  show()
}

function logout() {
  open.value = false
  userStore.clear()
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div ref="root" class="umenu" :class="`umenu--${variant}`">
    <button
      type="button"
      class="umenu__trigger"
      :aria-expanded="open"
      :aria-controls="menuId"
      aria-haspopup="menu"
      :aria-label="variant === 'compact' ? 'Menú de usuario' : undefined"
      @click="open = !open"
    >
      <span class="umenu__avatar" aria-hidden="true">
        {{ initial }}
        <span v-if="weak" class="umenu__dot"></span>
      </span>
      <span v-if="variant === 'card'" class="umenu__text">
        <span class="umenu__name">{{ name }}</span>
        <span class="umenu__mail">{{ userStore.user?.email }}</span>
      </span>
      <i
        v-if="variant === 'card'"
        class="fa-solid fa-ellipsis-vertical umenu__more"
        aria-hidden="true"
      ></i>
    </button>

    <Transition name="umenu">
      <div v-if="open" :id="menuId" class="umenu__panel" role="menu">
        <p v-if="variant === 'compact'" class="umenu__who">
          <strong>{{ name }}</strong>
          <span>{{ userStore.user?.email }}</span>
        </p>
        <button type="button" role="menuitem" class="umenu__item" @click="changePassword">
          <i class="fa-solid fa-key"></i> Cambiar contraseña
          <span v-if="weak" class="umenu__flag">Recomendado</span>
        </button>
        <button
          type="button"
          role="menuitem"
          class="umenu__item umenu__item--danger"
          @click="logout"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Salir
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.umenu {
  position: relative;

  &__trigger {
    @include flex(row, center, flex-start, 0.65rem);
    width: 100%;
    text-align: left;
    color: inherit;
  }

  &--card &__trigger {
    padding: 0.7rem;
    border-radius: 14px;
    background: rgba(#fff, 0.06);
    border: 1px solid rgba(#fff, 0.08);
    transition: background-color $dur $ease-out;

    &:hover,
    &[aria-expanded='true'] {
      background: rgba(#fff, 0.11);
    }
  }

  &--compact &__trigger {
    width: 2.6rem;
    height: 2.6rem;
    justify-content: center;
  }

  &__avatar {
    position: relative;
    @include plinth(50%);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.2rem;
    height: 2.2rem;
    font-family: $font-display;
    font-weight: 800;
    color: $accent-deep;
  }

  &--compact &__avatar {
    width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
  }

  &__dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: $warning;
    border: 2px solid $accent-deep;
  }

  &__text {
    @include flex(column, stretch, flex-start);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: $text-sm;
    line-height: 1.3;
  }

  &__mail {
    font-size: 0.7rem;
    color: rgba(#fff, 0.55);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__more {
    flex-shrink: 0;
    width: 1.6rem;
    text-align: center;
    color: rgba(#fff, 0.6);
  }

  &__panel {
    position: absolute;
    z-index: 80;
    @include flex(column, stretch, flex-start, 0.15rem);
    min-width: 16.5rem;
    padding: 0.4rem;
    border-radius: $radius-md;
    background: $surface;
    color: $ink;
    border: 1px solid $line;
    box-shadow: $shadow-lg;
  }

  // La barra lateral recorta lo que se sale (overflow-y): el menú usa el ancho de la tarjeta.
  &--card &__panel {
    min-width: 0;
    left: 0;
    right: 0;
    bottom: calc(100% + 0.5rem);
    transform-origin: bottom center;
  }

  &--compact &__panel {
    right: 0;
    top: calc(100% + 0.5rem);
    transform-origin: top right;
  }

  &__who {
    @include flex(column, stretch, flex-start, 0.1rem);
    padding: 0.55rem 0.7rem 0.65rem;
    margin-bottom: 0.2rem;
    border-bottom: 1px solid $line;
    font-size: $text-sm;

    span {
      font-size: $text-xs;
      color: $ink-muted;
      overflow-wrap: anywhere;
    }
  }

  &__item {
    @include flex(row, center, flex-start, 0.65rem);
    min-height: 2.75rem;
    padding: 0.5rem 0.7rem;
    white-space: nowrap;
    border-radius: 12px;
    font-size: $text-sm;
    font-weight: 500;
    text-align: left;
    transition: background-color $dur-fast $ease-out;

    i {
      width: 1.1rem;
      text-align: center;
      color: $ink-muted;
    }

    &:hover {
      background: $paper;
    }

    &--danger:hover {
      background: $danger-bg;
      color: $danger;

      i {
        color: $danger;
      }
    }
  }

  &__flag {
    margin-left: auto;
    padding: 0.15rem 0.5rem;
    border-radius: $radius-pill;
    font-size: 0.68rem;
    font-weight: 600;
    background: $warning-bg;
    color: darken($warning, 22%);
  }

  // Sin espacio para la etiqueta: queda el punto, como en el avatar.
  &--card &__flag {
    width: 0.55rem;
    height: 0.55rem;
    padding: 0;
    font-size: 0;
    background: $warning;
  }
}

.umenu-enter-active {
  transition:
    opacity 0.18s $ease-out,
    transform 0.22s $ease-out;
}
.umenu-leave-active {
  transition: opacity 0.12s ease;
}
.umenu-enter-from,
.umenu-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@include reduced-motion {
  .umenu-enter-active {
    transition: opacity 0.18s ease;
  }
  .umenu-enter-from {
    transform: none;
  }
}
</style>
