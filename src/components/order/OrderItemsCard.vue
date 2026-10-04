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
        <span class="oi__media">
          <img v-if="item.image" :src="item.image" :alt="item.title" width="56" height="56" loading="lazy" />
          <i v-else class="fa-solid fa-box" aria-hidden="true"></i>
        </span>
        <span class="oi__name">
          <span class="oi__qty">{{ item.quantity }} ×</span> {{ item.title }}
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
  border-radius: $radius-md;
  padding: 1.25rem 1.1rem;

  &__title {
    @include display($text-xl, 760, 112%);
    margin-bottom: 1rem;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
    font-size: $text-sm;

    strong {
      @include price($text-base, 700);
      white-space: nowrap;
    }
  }

  &__media {
    @include plinth(12px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    color: $alu-dark;

    img {
      width: 86%;
      height: 86%;
      object-fit: contain;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    line-height: 1.35;

    small {
      display: block;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__qty {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $accent;
  }

  &__totals {
    margin-top: 1.1rem;
    padding-top: 1rem;
    border-top: 1px dashed $alu;
    @include flex(column, stretch, flex-start, 0.45rem);
    font-size: $text-sm;

    div {
      @include flex(row, center, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }

    dd {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }

  &__grand {
    margin-top: 0.35rem;
    padding-top: 0.7rem;
    border-top: 1px solid $line;

    dt {
      color: $ink !important;
      font-weight: 700;
      font-size: $text-base;
    }

    dd {
      @include price($text-xl, 850);
    }
  }
}
</style>
