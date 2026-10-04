<script setup lang="ts">
import { guarantees } from '@/config/site'
</script>

<template>
  <ul class="strip">
    <li v-for="(item, i) in guarantees" :key="item.title" v-reveal="i * 70" class="strip__item">
      <span class="strip__icon"><i :class="item.icon" aria-hidden="true"></i></span>
      <div class="strip__copy">
        <h3 class="strip__title">{{ item.title }}</h3>
        <p class="strip__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
// Móvil: carril horizontal con snap que sangra hasta el borde de la pantalla.
// Escritorio: cuatro piezas en fila.
.strip {
  list-style: none;
  @include flex(row, stretch, flex-start, 0.6rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1.25rem;
  margin-inline: -1.25rem;
  padding: 0.25rem 1.25rem 0.5rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    margin-inline: 0;
    padding-inline: 0;
    overflow: visible;
    gap: 1rem;
  }

  &__item {
    @include alu-border(18px);
    @include flex(row, center, flex-start, 0.75rem);
    flex: 0 0 auto;
    max-width: 78%;
    scroll-snap-align: start;
    padding: 0.75rem 1rem 0.75rem 0.75rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      flex: 1 1 0;
      max-width: none;
      align-items: flex-start;
      padding: 1.1rem;
    }
  }

  &__icon {
    @include plinth(12px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    color: $accent-deep;
    font-size: 1rem;
  }

  &__copy {
    min-width: 0;
  }

  &__title {
    @include display(0.9rem, 750, 112%);
    white-space: nowrap;
    letter-spacing: -0.01em;

    @include from('md') {
      white-space: normal;
      font-size: $text-base;
      margin-bottom: 0.25rem;
    }
  }

  &__text {
    display: none;

    @include from('md') {
      display: block;
      font-size: $text-sm;
      color: $ink-soft;
      line-height: 1.5;
    }
  }
}
</style>
