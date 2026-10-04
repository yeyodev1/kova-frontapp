<script setup lang="ts">
import { paymentsCopy as copy } from '@/config/paymentsAdmin'

defineProps<{ on: boolean; busy?: boolean; activeCount: number }>()
const emit = defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <section class="tsw" :class="{ 'tsw--on': on }">
    <button
      type="button"
      role="switch"
      class="tsw__switch"
      :aria-checked="on"
      :disabled="busy"
      aria-describedby="tsw-state"
      @click="emit('change', !on)"
    >
      <span class="tsw__icon" aria-hidden="true"><i class="fa-solid fa-building-columns"></i></span>
      <span class="tsw__text">
        <strong class="tsw__label">{{ copy.switchLabel }}</strong>
        <span id="tsw-state" class="tsw__state">
          <i :class="on ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-minus'" aria-hidden="true"></i>
          {{ on ? copy.switchOn : copy.switchOff }}
        </span>
        <span v-if="activeCount" class="tsw__count">{{ copy.activeCount(activeCount) }}</span>
      </span>
      <span class="tsw__track" aria-hidden="true">
        <span class="tsw__thumb">
          <i v-if="busy" class="fa-solid fa-spinner fa-spin"></i>
        </span>
      </span>
    </button>
  </section>
</template>

<style scoped lang="scss">
.tsw {
  @include card;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1px solid $line;
  @include transition(border-color);

  &--on {
    border-color: rgba($accent, 0.45);
    box-shadow:
      0 0 0 3px rgba($accent, 0.1),
      $shadow-sm;
  }

  &__switch {
    @include flex(row, center, flex-start, 0.85rem);
    width: 100%;
    padding: 1rem;
    text-align: left;
    cursor: pointer;

    @include from('md') {
      padding: 1.25rem 1.4rem;
    }

    &:disabled {
      cursor: progress;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 12px;
    background: $paper;
    color: $ink-muted;
    @include transition(background);
  }

  &--on &__icon {
    background: $accent-soft;
    color: $accent;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.25rem);
    flex: 1 1 auto;
    min-width: 0;
  }

  &__label {
    @include display(1.02rem, 760, 108%);
  }

  &__state {
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $ink-muted;
      margin-right: 0.2rem;
    }
  }

  &--on &__state i {
    color: $success;
  }

  &__count {
    font-family: $font-mono;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__track {
    position: relative;
    flex-shrink: 0;
    width: 3.6rem;
    height: 2rem;
    border-radius: $radius-pill;
    background: $line;
    @include transition(background);
  }

  &__thumb {
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    @include flex(row, center, center);
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    color: $accent;
    font-size: 0.7rem;
    transition: transform $dur $ease-spring;

    @include reduced-motion {
      transition: none;
    }
  }

  &--on &__track {
    background: $accent;
  }

  &--on &__thumb {
    transform: translateX(1.6rem);
  }
}
</style>
