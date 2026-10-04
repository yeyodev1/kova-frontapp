<script setup lang="ts">
import { home, paymentMethodsInfo } from '@/config/site'

defineProps<{ compact?: boolean }>()
</script>

<template>
  <section class="pay" :class="{ 'pay--compact': compact }">
    <div v-reveal class="pay__head">
      <p v-if="!compact" class="pay__eyebrow">{{ home.payments.eyebrow }}</p>
      <h2 class="pay__title">{{ paymentMethodsInfo.title }}</h2>
      <p class="pay__text">{{ paymentMethodsInfo.text }}</p>
    </div>
    <ul class="pay__list">
      <li v-for="(item, i) in paymentMethodsInfo.items" :key="item.title" v-reveal="i * 80" class="pay__item">
        <span class="pay__icon"><i :class="item.icon" aria-hidden="true"></i></span>
        <div class="pay__copy">
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.pay {
  @include flex(column, stretch, flex-start, 1.25rem);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.55rem);

    @include from('lg') {
      flex: 0 0 34%;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 780, 118%);
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    max-width: 52ch;
  }

  &__list {
    list-style: none;
    @include flex-cards(220px, 0.75rem);
    flex: 1;
  }

  &__item {
    @include alu-border(18px);
    @include flex(row, flex-start, flex-start, 0.85rem);
    padding: 1rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      flex-direction: column;
      padding: 1.25rem;
    }
  }

  &__icon {
    @include plinth(14px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    color: $accent-deep;
    font-size: 1.05rem;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.2rem);

    strong {
      @include display($text-base, 750, 112%);
      line-height: 1.2;
    }

    span {
      font-size: $text-sm;
      color: $ink-soft;
      line-height: 1.5;
    }
  }

  &--compact {
    @include from('lg') {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &--compact &__head {
    flex-basis: auto;
  }

  &--compact &__title {
    font-size: $text-xl;
  }

  &--compact &__item {
    @include from('md') {
      flex-direction: row;
      padding: 1rem;
    }
  }
}
</style>
