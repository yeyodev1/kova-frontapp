<script setup lang="ts">
import type { Order } from '@/types'
import AdminStatusChip from './AdminStatusChip.vue'
import { methodIcons, methodLabels } from './orderLabels'
import { formatCents } from '@/utils/money'
import { formatDateTime } from '@/composables/admin/format'

defineProps<{ order: Order }>()
</script>

<template>
  <RouterLink :to="`/admin/pedidos/${order._id}`" class="row">
    <div class="row__main">
      <p class="row__number">
        {{ order.number }}
        <span v-if="order.dropi?.error" class="row__alert" :title="order.dropi.error">
          <i class="fa-solid fa-triangle-exclamation"></i> Dropi
        </span>
      </p>
      <p class="row__date">{{ formatDateTime(order.createdAt) }}</p>
    </div>
    <div class="row__customer">
      <p class="row__name">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
      <p class="row__meta">{{ order.customer.phone }} · {{ order.address?.city }}</p>
    </div>
    <div class="row__method">
      <i :class="methodIcons[order.paymentMethod]"></i>
      {{ methodLabels[order.paymentMethod] ?? order.paymentMethod }}
    </div>
    <div class="row__end">
      <strong class="row__total">{{ formatCents(order.total) }}</strong>
      <AdminStatusChip :status="order.status" />
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
// Móvil: tarjeta. Desktop: fila de tabla hecha con flex.
.row {
  @include card;
  @include flex(row, flex-start, space-between, 0.4rem 0.8rem);
  flex-wrap: wrap;
  padding: 0.85rem 1rem;
  @include transition(border-color);

  &:hover {
    border-color: $accent;
  }

  p {
    margin: 0;
  }

  &__main {
    flex: 1 1 0;
    min-width: 0;
  }

  &__number {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 600;
  }

  &__alert {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
    background: $danger-bg;
    padding: 0.15rem 0.45rem;
    border-radius: $radius-pill;
  }

  &__date,
  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__customer {
    order: 3;
    flex: 1 1 100%;
    min-width: 0;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
  }

  &__method {
    order: 4;
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $ink-muted;
      margin-right: 0.2rem;
    }
  }

  &__end {
    order: 2;
    @include flex(column, flex-end, flex-start, 0.35rem);
  }

  @include from('lg') {
    flex-wrap: nowrap;
    align-items: center;
    border-radius: 0;
    border-width: 0 0 1px;

    &__main {
      flex: 0 0 150px;
    }

    &__customer {
      order: 0;
      flex: 1 1 auto;
    }

    &__method {
      order: 0;
      flex: 0 0 140px;
    }

    &__end {
      order: 0;
      flex: 0 0 230px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 0.8rem;
    }
  }
}
</style>
