<script setup lang="ts">
import { checkoutCopy, orderCopy, paymentMethodLabel } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ order: Order }>()
</script>

<template>
  <section class="oi">
    <h2 class="oi__title">{{ orderCopy.summary }}</h2>
    <ul class="oi__items">
      <li v-for="item in order.items" :key="`${item.product}-${item.variantId}`" class="oi__item">
        <img v-if="item.image" :src="item.image" :alt="item.title" width="52" height="52" loading="lazy" />
        <span class="oi__name">
          {{ item.quantity }} × {{ item.title }}
          <small v-if="item.variantName">{{ item.variantName }}</small>
        </span>
        <strong>{{ formatCents(item.total) }}</strong>
      </li>
    </ul>
    <dl class="oi__totals">
      <div v-if="order.subtotal">
        <dt>{{ checkoutCopy.subtotal }}</dt>
        <dd>{{ formatCents(order.subtotal) }}</dd>
      </div>
      <div v-if="order.subtotal">
        <dt>{{ checkoutCopy.shipping }}</dt>
        <dd>{{ order.shippingFee ? formatCents(order.shippingFee) : checkoutCopy.freeShipping }}</dd>
      </div>
      <div v-if="order.surcharge">
        <dt>{{ checkoutCopy.surcharge }}</dt>
        <dd>{{ formatCents(order.surcharge) }}</dd>
      </div>
      <div v-if="order.paymentMethod">
        <dt>{{ orderCopy.method }}</dt>
        <dd>{{ paymentMethodLabel[order.paymentMethod] }}</dd>
      </div>
      <div class="oi__grand">
        <dt>{{ checkoutCopy.total }}</dt>
        <dd>{{ formatCents(order.total) }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.oi {
  @include card;
  padding: 1.1rem;

  &__title {
    font-size: $text-lg;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
    font-size: $text-sm;

    img {
      width: 3.25rem;
      height: 3.25rem;
      border-radius: $radius-sm;
      object-fit: cover;
      flex-shrink: 0;
    }

    strong {
      white-space: nowrap;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;

    small {
      display: block;
      color: $ink-muted;
    }
  }

  &__totals {
    margin-top: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid $line;
    @include flex(column, stretch, flex-start, 0.4rem);
    font-size: $text-sm;

    div {
      @include flex(row, center, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }
  }

  &__grand {
    font-size: $text-lg;
    font-weight: 600;

    dd {
      font-family: $font-display;
    }
  }
}
</style>
