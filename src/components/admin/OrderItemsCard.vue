<script setup lang="ts">
import type { Order } from '@/types'
import AdminPanel from './AdminPanel.vue'
import { formatCents } from '@/utils/money'

defineProps<{ order: Order }>()
</script>

<template>
  <AdminPanel title="Productos" icon="fa-solid fa-box">
    <ul class="items">
      <li v-for="(item, i) in order.items" :key="i" class="items__row">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="items__img" loading="lazy" />
        <span v-else class="items__img items__img--empty"><i class="fa-regular fa-image"></i></span>
        <div class="items__info">
          <p class="items__title">{{ item.title }}</p>
          <p v-if="item.variantName" class="items__variant">{{ item.variantName }}</p>
          <p class="items__qty">{{ item.quantity }} x {{ formatCents(item.unitPrice) }}</p>
        </div>
        <strong class="items__total">{{ formatCents(item.total) }}</strong>
      </li>
    </ul>
    <dl class="totals">
      <div><dt>Subtotal</dt><dd>{{ formatCents(order.subtotal) }}</dd></div>
      <div><dt>Envío</dt><dd>{{ order.shippingFee ? formatCents(order.shippingFee) : 'Gratis' }}</dd></div>
      <div v-if="order.surcharge"><dt>Recargo</dt><dd>{{ formatCents(order.surcharge) }}</dd></div>
      <div class="totals__grand"><dt>Total</dt><dd>{{ formatCents(order.total) }}</dd></div>
    </dl>
  </AdminPanel>
</template>

<style scoped lang="scss">
.items {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.7rem);

  &__row {
    @include flex(row, flex-start, flex-start, 0.75rem);
  }

  &__img {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $paper;

    &--empty {
      @include flex(row, center, center);
      color: $silver;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
  }

  &__title {
    font-weight: 500;
    line-height: 1.3;
  }

  &__variant,
  &__qty {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__total {
    font-size: $text-sm;
  }
}

.totals {
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid $line;
  font-size: $text-sm;

  div {
    @include flex(row, center, space-between);
    padding-block: 0.15rem;
  }

  dt {
    color: $ink-soft;
  }

  &__grand {
    font-weight: 700;
    font-size: $text-base;

    dt {
      color: $ink;
    }
  }
}
</style>
