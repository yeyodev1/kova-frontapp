<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import AdminStatusChip from './AdminStatusChip.vue'
import {
  channelIcons,
  channelLabels,
  methodIcons,
  methodLabels,
  todoIcons,
  todoTones,
  todoLabels,
} from './orderLabels'
import { formatCents } from '@/utils/money'
import { formatDateTime } from '@/composables/admin/format'

const props = defineProps<{ order: Order }>()
const channel = computed(() => props.order.channel ?? 'web')
// "1 × Almohada… +1 más": se reconoce el pedido sin abrirlo.
const itemsSummary = computed(() => {
  const items = props.order.items || []
  const [head] = items
  if (!head) return ''
  const first = `${head.quantity} × ${head.title}`
  return items.length > 1 ? `${first} +${items.length - 1} más` : first
})
</script>

<template>
  <RouterLink :to="`/admin/pedidos/${order._id}`" class="row">
    <div class="row__main">
      <p class="row__number">
        <i
          class="row__channel"
          :class="[channelIcons[channel], `row__channel--${channel}`]"
          :title="channelLabels[channel]"
          aria-hidden="true"
        ></i>
        <span class="visually-hidden">{{ channelLabels[channel] }}:</span>
        {{ order.number }}
        <span v-if="order.dropi?.error" class="row__alert" :title="order.dropi.error">
          <i class="fa-solid fa-triangle-exclamation"></i> Dropi
        </span>
      </p>
      <p class="row__date">{{ formatDateTime(order.createdAt) }}</p>
    </div>
    <div class="row__customer">
      <p class="row__name">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
      <p class="row__meta">
        <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ order.customer.phone }}
        <span v-if="order.address?.city"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ order.address.city }}</span>
      </p>
      <p v-if="itemsSummary" class="row__items"><i class="fa-solid fa-box" aria-hidden="true"></i> {{ itemsSummary }}</p>
      <AdminStatusChip
        v-if="order.todo"
        class="row__todo"
        :tone="todoTones[order.todo]"
        :icon="todoIcons[order.todo]"
        :label="todoLabels[order.todo]"
      />
    </div>
    <div class="row__method" :class="`row__method--${order.paymentMethod}`">
      <i :class="methodIcons[order.paymentMethod]" aria-hidden="true"></i>
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
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  transition:
    border-color $dur $ease-out,
    background-color $dur $ease-out,
    transform $dur-fast $ease-out;

  &:hover {
    border-color: $alu-dark;
  }

  &:active {
    transform: scale(0.99);
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
    font-family: $font-mono;
    font-size: $text-sm;
    font-weight: 700;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  &__channel {
    font-size: 0.85rem;
    color: $ink-muted;

    &--whatsapp_bot {
      color: #1f9d55;
    }
  }

  &__todo {
    margin-top: 0.4rem;
  }

  &__total {
    @include price(1.05rem, 800);
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
    box-shadow: none;

    &:hover {
      background: $alu-light;
    }

    &:active {
      transform: none;
    }

    &__main {
      flex: 0 0 185px;
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
.row__meta {
  @include flex(row, center, flex-start, 0.3rem 0.75rem);
  flex-wrap: wrap;

  i {
    color: $ink-muted;
    font-size: 0.75em;
    margin-right: 0.15rem;
  }
}

.row__items {
  font-size: 0.8rem;
  color: $ink-soft;
  margin-top: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  i {
    color: $accent;
    margin-right: 0.25rem;
  }
}

// Método de pago como chip de color: se distingue de un vistazo.
.row__method {
  @include flex(row, center, flex-start, 0.4rem);
  align-self: center;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  white-space: nowrap;

  i {
    color: inherit;
    margin-right: 0;
  }

  &--card {
    background: $success-bg;
    color: $success;
  }

  &--transfer {
    background: $info-bg;
    color: $info;
  }

  &--cod {
    background: $cta-soft;
    color: $cta-deep;
  }
}
</style>
