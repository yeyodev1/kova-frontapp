<script setup lang="ts">
import { computed } from 'vue'
import { payOrderCopy as copy } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()

const count = computed(() => props.order.items.reduce((sum, item) => sum + item.quantity, 0))
const place = computed(() => [props.order.address?.city, props.order.address?.province].filter(Boolean).join(', '))
</script>

<template>
  <section class="pos" :aria-label="`${copy.eyebrow} ${order.number}`">
    <header class="pos__head">
      <span class="pos__eyebrow">{{ copy.eyebrow }}</span>
      <strong class="pos__number">{{ order.number }}</strong>
      <span class="pos__count">{{ copy.itemsCount(count) }}</span>
    </header>

    <ul class="pos__items">
      <li v-for="item in order.items" :key="`${item.product}-${item.variantId}`" class="pos__item">
        <span class="pos__media">
          <img v-if="item.image" :src="item.image" :alt="item.title" width="64" height="64" />
          <i v-else class="fa-solid fa-box" aria-hidden="true"></i>
          <span class="pos__qty" aria-hidden="true">{{ item.quantity }}</span>
        </span>
        <span class="pos__name">
          {{ item.title }}
          <small v-if="item.variantName">{{ item.variantName }}</small>
          <small class="visually-hidden">× {{ item.quantity }}</small>
        </span>
        <strong class="pos__line">{{ formatCents(item.total) }}</strong>
      </li>
    </ul>

    <dl class="pos__rows">
      <div class="pos__row">
        <dt>{{ copy.subtotal }}</dt>
        <dd>{{ formatCents(order.subtotal) }}</dd>
      </div>
      <div class="pos__row">
        <dt>{{ copy.shipping }}</dt>
        <dd>{{ order.shippingFee ? formatCents(order.shippingFee) : copy.freeShipping }}</dd>
      </div>
      <div v-if="order.surcharge" class="pos__row">
        <dt>{{ copy.surcharge }}</dt>
        <dd>{{ formatCents(order.surcharge) }}</dd>
      </div>
    </dl>

    <div class="pos__total">
      <span>{{ copy.total }}</span>
      <strong>{{ formatCents(order.total) }}</strong>
    </div>

    <p v-if="place" class="pos__ship">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ copy.shipTo }} <b>{{ place }}</b>
    </p>
  </section>
</template>

<style scoped lang="scss">
.pos {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.1rem 1rem;
  border-radius: 20px;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.4rem;
  }

  &__head {
    @include flex(row, baseline, flex-start, 0.3rem 0.6rem);
    flex-wrap: wrap;
  }

  &__eyebrow {
    @include eyebrow;
    flex-basis: 100%;
  }

  &__number {
    font-family: $font-mono;
    font-size: $text-lg;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: $accent-deep;
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
    font-size: $text-sm;
  }

  &__media {
    @include plinth(14px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    overflow: visible;
    color: $alu-dark;

    img {
      width: 86%;
      height: 86%;
      object-fit: contain;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    min-width: 1.35rem;
    height: 1.35rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1.35rem;
    text-align: center;
    box-shadow: 0 0 0 2px $surface;
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

  &__line {
    @include price($text-base, 700);
    white-space: nowrap;
  }

  &__rows {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding-top: 0.85rem;
    border-top: 1px dashed $line;
  }

  &__row {
    @include flex(row, center, space-between);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      font-variant-numeric: tabular-nums;
    }
  }

  &__total {
    @include moss;
    @include flex(row, baseline, space-between, 0.75rem);
    padding: 0.9rem 1rem;
    border-radius: 14px;

    span {
      @include eyebrow;
      color: rgba(#fff, 0.72);
    }

    strong {
      @include price($display-sm, 850);
      color: #fff;
      line-height: 1.05;
    }
  }

  &__ship {
    @include flex(row, baseline, flex-start, 0.45rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
    }

    b {
      color: $ink;
    }
  }
}
</style>
