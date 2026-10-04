<script setup lang="ts">
import { paymentMethodsInfo } from '@/config/site'

defineProps<{ compact?: boolean }>()
</script>

<template>
  <section class="pay" :class="{ 'pay--compact': compact }">
    <h2 class="pay__title">{{ paymentMethodsInfo.title }}</h2>
    <p class="pay__text">{{ paymentMethodsInfo.text }}</p>
    <ul class="pay__list">
      <li v-for="item in paymentMethodsInfo.items" :key="item.title" class="pay__item">
        <i :class="item.icon" aria-hidden="true"></i>
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.pay {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__title {
    @include display($display-sm, 600);
  }

  &__text {
    color: $ink-soft;
    max-width: 60ch;
  }

  &__list {
    list-style: none;
    @include flex-cards(240px, 0.75rem);
    margin-top: 0.6rem;
  }

  &__item {
    @include card;
    @include flex(row, flex-start, flex-start, 0.8rem);
    padding: 1rem;

    i {
      color: $accent;
      font-size: 1.25rem;
      margin-top: 0.15rem;
      width: 1.5rem;
      text-align: center;
    }

    strong {
      display: block;
      font-size: $text-sm;
    }

    span {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &--compact &__title {
    font-size: $text-xl;
  }
}
</style>
