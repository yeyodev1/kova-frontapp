<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Tone } from './orderLabels'

defineProps<{ label: string; value: string | number; icon: string; tone?: Tone; to?: string; hint?: string }>()
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to" class="stat" :class="`stat--${tone || 'accent'}`">
    <span class="stat__icon"><i :class="icon"></i></span>
    <span class="stat__body">
      <span class="stat__label">{{ label }}</span>
      <span class="stat__value">{{ value }}</span>
      <span v-if="hint" class="stat__hint">{{ hint }}</span>
    </span>
  </component>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  @include flex(row, center, flex-start, 0.8rem);
  padding: 0.9rem 1rem;
  min-width: 0;

  &__icon {
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $accent-soft;
    color: $accent;
  }

  &__body {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
  }

  &__label {
    font-size: $text-xs;
    color: $ink-muted;
    font-weight: 500;
  }

  &__value {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    line-height: 1.2;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &--warning .stat__icon {
    background: $warning-bg;
    color: darken($warning, 15%);
  }
  &--danger .stat__icon {
    background: $danger-bg;
    color: $danger;
  }
  &--success .stat__icon {
    background: $success-bg;
    color: $success;
  }
  &--info .stat__icon {
    background: $info-bg;
    color: $info;
  }
}
</style>
