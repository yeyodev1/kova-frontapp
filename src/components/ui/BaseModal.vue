<script setup lang="ts">
import { toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

const props = defineProps<{
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}>()

const emit = defineEmits<{ confirm: []; cancel: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="emit('cancel')">
        <div class="modal__box" role="dialog" aria-modal="true" :aria-label="title">
          <span class="modal__icon" :class="{ 'modal__icon--danger': danger }">
            <i
              :class="danger ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question'"
              aria-hidden="true"
            ></i>
          </span>
          <h3 class="modal__title">{{ title }}</h3>
          <p v-if="message" class="modal__message">{{ message }}</p>
          <slot />
          <div class="modal__actions">
            <button class="btn btn--ghost" @click="emit('cancel')">
              {{ cancelLabel || 'Cancelar' }}
            </button>
            <button class="btn" :class="danger ? 'btn--danger' : 'btn--primary'" @click="emit('confirm')">
              {{ confirmLabel || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  background: $overlay;
  backdrop-filter: blur(4px);
  @include flex(column, stretch, flex-end);
  z-index: 200;
  padding: 0.75rem;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));

  @include from('sm') {
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__box {
    @include alu-border(24px);
    @include flex(column, center, flex-start, 0.6rem);
    text-align: center;
    width: 100%;
    max-width: 420px;
    margin-inline: auto;
    padding: 2rem 1.5rem 1.5rem;
    box-shadow: $shadow-lg;
  }

  &__icon {
    @include plinth(50%);
    @include flex(row, center, center);
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.4rem;
    color: $accent;
    margin-bottom: 0.3rem;

    &--danger {
      color: $danger;
    }
  }

  &__title {
    @include display($text-xl, 780, 115%);
  }

  &__message {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 36ch;
  }

  &__actions {
    @include flex(row, stretch, center, 0.6rem);
    width: 100%;
    margin-top: 1rem;

    .btn {
      flex: 1 1 0;
    }
  }
}

.modal-enter-active {
  transition: opacity 0.25s $ease-out;

  .modal__box {
    transition:
      transform 0.45s $ease-spring,
      opacity 0.3s $ease-out;
  }
}

.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal__box {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__box {
    transform: translateY(24px) scale(0.96);
  }
}
</style>
