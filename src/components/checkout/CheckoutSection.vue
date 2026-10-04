<script setup lang="ts">
import { checkoutCopy } from '@/config/site'

// Bloque numerado del formulario: los números son una secuencia real (1 → 2 → 3).
defineProps<{ step: number; title: string; note?: string; done?: boolean; disabled?: boolean }>()
</script>

<template>
  <fieldset class="cs" :class="{ 'cs--done': done }" :disabled="disabled">
    <legend class="visually-hidden">{{ title }}</legend>
    <div class="cs__head" aria-hidden="true">
      <span class="cs__badge">
        <Transition name="cs-swap" mode="out-in">
          <i v-if="done" key="done" class="fa-solid fa-check"></i>
          <span v-else key="n">{{ step }}</span>
        </Transition>
      </span>
      <span class="cs__titles">
        <span class="cs__title">{{ title }}</span>
        <span v-if="note" class="cs__note">{{ note }}</span>
      </span>
    </div>
    <span v-if="done" class="visually-hidden">{{ checkoutCopy.stepDone }}</span>
    <div class="cs__body">
      <slot />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.cs {
  min-width: 0;
  border: 1px solid $line;
  border-radius: $radius-md;
  background: $surface;
  padding: 1.15rem 1rem 1.25rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.5rem 1.5rem 1.6rem;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 0.75rem);
    margin-bottom: 1.1rem;
  }

  &__badge {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $accent-deep;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.85rem;
    font-weight: 700;
    transition: background-color $dur $ease-out;
  }

  &--done &__badge {
    background: $success;

    i {
      animation: pop 0.4s $ease-spring;
    }
  }

  &__titles {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;
    padding-top: 0.1rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
    line-height: 1.15;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-muted;
    line-height: 1.4;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &:disabled {
    opacity: 0.7;
  }
}

.cs-swap-enter-active,
.cs-swap-leave-active {
  transition:
    opacity $dur-fast ease,
    transform $dur-fast $ease-out;
}
.cs-swap-enter-from,
.cs-swap-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
