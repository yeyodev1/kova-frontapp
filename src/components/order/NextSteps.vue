<script setup lang="ts">
import { orderCopy } from '@/config/site'

// current: índice del paso en curso; los anteriores ya están hechos.
defineProps<{ steps: string[]; current: number }>()
</script>

<template>
  <section class="ns">
    <h2 class="ns__title">{{ orderCopy.nextSteps }}</h2>
    <ol class="ns__list">
      <li
        v-for="(step, i) in steps"
        :key="step"
        v-reveal="i * 90"
        class="ns__step"
        :class="{ 'ns__step--done': i < current, 'ns__step--now': i === current }"
        :aria-current="i === current ? 'step' : undefined"
      >
        <span class="ns__marker" aria-hidden="true">
          <i v-if="i < current" class="fa-solid fa-check"></i>
          <span v-else>{{ String(i + 1).padStart(2, '0') }}</span>
        </span>
        <span class="ns__body">
          <span v-if="i < current" class="ns__tag">{{ orderCopy.stepDone }}</span>
          <span v-else-if="i === current" class="ns__tag ns__tag--now">{{ orderCopy.stepNow }}</span>
          <span class="ns__text">{{ step }}</span>
        </span>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.ns {
  @include card;
  border-radius: $radius-md;
  padding: 1.25rem 1.1rem 0.5rem;

  &__title {
    @include display($text-xl, 760, 112%);
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
  }

  &__step {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding-bottom: 1.25rem;

    // Línea que une los pasos
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 1rem;
      top: 2.25rem;
      bottom: 0.25rem;
      width: 2px;
      margin-left: -1px;
      background: $line;
    }

    &--done:not(:last-child)::after {
      background: $sage;
    }
  }

  &__marker {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1.5px solid $alu-dark;
    background: $surface;
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 700;
    color: $ink-muted;
  }

  &__step--done &__marker {
    border-color: $sage;
    background: $sage;
    color: $surface;
  }

  &__step--now &__marker {
    border-color: $accent-deep;
    background: $accent-deep;
    color: $surface;
    box-shadow: 0 0 0 5px rgba($accent, 0.14);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    padding-top: 0.25rem;
  }

  &__tag {
    @include eyebrow;
    font-size: 0.62rem;
    color: $sage;

    &--now {
      color: $accent;
    }
  }

  &__text {
    color: $ink-soft;
    line-height: 1.45;
  }

  &__step--now &__text {
    color: $ink;
    font-weight: 600;
  }
}
</style>
