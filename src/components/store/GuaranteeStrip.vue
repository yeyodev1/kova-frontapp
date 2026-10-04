<script setup lang="ts">
import { guarantees } from '@/config/site'
</script>

<template>
  <ul class="strip">
    <li v-for="item in guarantees" :key="item.title" class="strip__item">
      <span class="strip__icon"><i :class="item.icon" aria-hidden="true"></i></span>
      <div>
        <h3 class="strip__title">{{ item.title }}</h3>
        <p class="strip__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.strip {
  list-style: none;
  @include flex-cards(240px, 0.75rem);

  &__item {
    @include card;
    @include flex(row, flex-start, flex-start, 0.85rem);
    padding: 1rem;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.1rem;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-base;
    font-weight: 600;
    margin-bottom: 0.15rem;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
  }
}
</style>
