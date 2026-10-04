<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Tone } from './orderLabels'

defineProps<{ label: string; value: string | number; icon: string; tone?: Tone; to?: string; hint?: string }>()
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to" class="stat" :class="[`stat--${tone || 'accent'}`, { 'stat--link': to }]">
    <span class="stat__top">
      <span class="stat__label">{{ label }}</span>
      <span class="stat__icon"><i :class="icon"></i></span>
    </span>
    <span class="stat__value">{{ value }}</span>
    <span v-if="hint" class="stat__hint">{{ hint }}</span>
    <i v-if="to" class="fa-solid fa-arrow-right stat__go" aria-hidden="true"></i>
  </component>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  position: relative;
  @include flex(column, stretch, flex-start, 0.45rem);
  padding: 0.85rem 0.95rem 0.9rem;
  min-width: 0;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  transition:
    transform $dur $ease-out,
    box-shadow $dur $ease-out,
    border-color $dur $ease-out;

  &--link:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: $alu-dark;

    .stat__go {
      opacity: 1;
      transform: none;
    }
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.5rem);
  }

  &__label {
    @include eyebrow;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: $ink-muted;
    line-height: 1.35;
  }

  &__icon {
    flex-shrink: 0;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 10px;
    @include flex(row, center, center);
    font-size: 0.8rem;
    background: $accent-soft;
    color: $accent;
  }

  &__value {
    @include price(clamp(1.45rem, 1.2rem + 1vw, 1.9rem));
    line-height: 1.05;
    color: $ink;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__go {
    position: absolute;
    right: 0.95rem;
    bottom: 1rem;
    font-size: 0.75rem;
    color: $accent;
    opacity: 0;
    transform: translateX(-4px);
    transition:
      opacity $dur $ease-out,
      transform $dur $ease-out;
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

  @include reduced-motion {
    &--link:hover {
      transform: none;
    }
  }
}
</style>
