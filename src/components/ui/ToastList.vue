<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const icons: Record<string, string> = {
  success: 'fa-solid fa-circle-check',
  error: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
}
</script>

<template>
  <Teleport to="body">
    <div class="toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toasts__item"
          :class="`toasts__item--${toast.type}`"
          @click="toastStore.dismiss(toast.id)"
        >
          <i :class="icons[toast.type]" aria-hidden="true"></i>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toasts {
  position: fixed;
  // Arriba en móvil: abajo quedan las barras fijas de compra.
  top: calc(0.75rem + env(safe-area-inset-top));
  left: 0.75rem;
  right: 0.75rem;
  z-index: 300;
  @include flex(column, stretch, flex-start, 0.5rem);
  max-width: 380px;
  margin-inline: auto;
  pointer-events: none;

  @include from('md') {
    top: auto;
    left: auto;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    pointer-events: auto;
    background: rgba($accent-deep, 0.94);
    backdrop-filter: blur(12px);
    color: $surface;
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.8rem 1rem 0.8rem 0.8rem;
    border-radius: 16px;
    border: 1px solid rgba($alu, 0.18);
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.08),
      0 18px 40px -12px rgba($ink, 0.45);
    cursor: pointer;

    i {
      @include flex(row, center, center);
      flex-shrink: 0;
      width: 1.9rem;
      height: 1.9rem;
      border-radius: 50%;
      background: rgba($surface, 0.1);
      color: $sage;
      font-size: 0.95rem;
    }

    &--success i {
      background: rgba($success, 0.22);
      color: #7fd6a3;
      animation: pop 0.5s $ease-spring 0.15s;
    }

    &--error {
      background: rgba(darken($danger, 6%), 0.96);

      i {
        background: rgba($surface, 0.18);
        color: $surface;
      }
    }
  }
}

.toast-enter-active {
  transition:
    opacity 0.3s $ease-out,
    transform 0.5s $ease-spring;
}
.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.toast-move {
  transition: transform $dur $ease-out;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.94);

  @include from('md') {
    transform: translateY(16px) scale(0.94);
  }
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
