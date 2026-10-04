<script setup lang="ts">
import { paymentMethodLabel, trackingCopy } from '@/config/site'
import type { TrackedOrder } from '@/composables/useTracking'
import { formatCents } from '@/utils/format'

defineProps<{ order: TrackedOrder }>()
</script>

<template>
  <section class="it">
    <h2 class="it__title">{{ trackingCopy.itemsTitle }}</h2>
    <ul class="it__list">
      <li v-for="(item, i) in order.items" :key="`${item.title}-${item.variantName}-${i}`" class="it__item">
        <span class="it__media">
          <img v-if="item.image" :src="item.image" :alt="item.title" width="64" height="64" loading="lazy" />
          <i v-else class="fa-solid fa-box" aria-hidden="true"></i>
          <span v-if="item.quantity > 1" class="it__qty">×{{ item.quantity }}</span>
        </span>
        <span class="it__name">
          {{ item.title }}
          <small v-if="item.variantName">{{ item.variantName }}</small>
        </span>
        <strong class="it__price">{{ formatCents(item.total) }}</strong>
      </li>
    </ul>
    <div class="it__foot">
      <p class="it__method">
        <span>{{ trackingCopy.method }}</span>
        <strong>{{ paymentMethodLabel[order.paymentMethod] }}</strong>
      </p>
      <p class="it__total">
        <span>{{ trackingCopy.total }}</span>
        <strong>{{ formatCents(order.total) }}</strong>
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.it {
  @include card;
  border-radius: 22px;
  padding: 1.35rem 1.15rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.6rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.9rem);
  }

  &__media {
    @include plinth(14px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    color: $alu-dark;
    overflow: visible;

    img {
      width: 84%;
      height: 84%;
      object-fit: contain;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    min-width: 1.5rem;
    padding: 0.1rem 0.35rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: #fff;
    font-family: $font-mono;
    font-size: 0.68rem;
    font-weight: 700;
    text-align: center;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
    font-weight: 650;
    line-height: 1.35;

    small {
      display: block;
      margin-top: 0.15rem;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__price {
    @include price($text-base, 750);
    white-space: nowrap;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.55rem);
    margin-top: 1.1rem;
    padding-top: 1rem;
    border-top: 1px dashed $alu;

    p {
      @include flex(row, baseline, space-between, 1rem);
    }
  }

  &__method {
    font-size: $text-sm;

    span {
      color: $ink-muted;
    }
  }

  &__total {
    span {
      font-weight: 700;
    }

    strong {
      @include price($text-xl, 850);
    }
  }
}
</style>
