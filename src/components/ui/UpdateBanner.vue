<script setup lang="ts">
import { reloadApp, updateAvailable } from '@/composables/useAppVersion'
import { updateCopy as copy } from '@/config/site'
</script>

<template>
  <Transition name="slide-up">
    <div v-if="updateAvailable" class="update" role="status" aria-live="polite">
      <span class="update__icon" aria-hidden="true"><i class="fa-solid fa-arrows-rotate"></i></span>
      <p class="update__text">
        <strong>{{ copy.title }}</strong>
        <span>{{ copy.text }}</span>
      </p>
      <button type="button" class="update__btn" @click="reloadApp">{{ copy.action }}</button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
// Arriba de todo (también sobre la barra fija de compra y el menú del panel), sin bloquear la página.
.update {
  @include flex(row, center, flex-start, 0.75rem);
  position: fixed;
  left: 0.75rem;
  right: 0.75rem;
  bottom: calc(0.75rem + env(safe-area-inset-bottom));
  z-index: 200;
  @include moss;
  border-radius: 16px;
  padding: 0.75rem 0.75rem 0.75rem 0.9rem;
  box-shadow: $shadow-lg;

  @include from('md') {
    left: auto;
    right: 1.5rem;
    bottom: 1.5rem;
    max-width: 420px;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: rgba($surface, 0.12);
    color: $sage;
  }

  &__text {
    @include flex(column, flex-start, center, 0.1rem);
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
    line-height: 1.35;

    span {
      color: rgba($surface, 0.75);
    }
  }

  &__btn {
    flex: 0 0 auto;
    min-height: 2.75rem;
    padding: 0 1rem;
    border-radius: 12px;
    background: $surface;
    color: $accent-deep;
    font-weight: 700;
    @include transition(transform);

    &:active {
      transform: scale(0.96);
    }
  }
}
</style>
