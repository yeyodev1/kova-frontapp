<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { orderCopy, whatsappLink } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useOrder } from '@/composables/useOrder'
import { normalizePhone } from '@/composables/useCheckoutForm'
import OrderItemsCard from '@/components/order/OrderItemsCard.vue'
import BankTransfer from '@/components/order/BankTransfer.vue'
import NextSteps from '@/components/order/NextSteps.vue'
import SuccessCheck from '@/components/order/SuccessCheck.vue'
import type { OrderStatus } from '@/types'

const route = useRoute()
const cart = useCartStore()
const { order, loading, error, fetch } = useOrder()

const number = computed(() => String(route.params.number || ''))
const phone = computed(() => normalizePhone(String(route.query.phone || '')))
// Guion no separable: "KV-1001" nunca se parte en dos líneas.
const title = computed(() => orderCopy.received(number.value.replace(/-/g, '\u2011')))
const steps = computed(() => (order.value ? orderCopy.steps[order.value.paymentMethod] : []))
const awaitingTransfer = computed(() => order.value?.status === 'awaiting_transfer')

// Dónde va el pedido dentro de "próximos pasos", según método y estado reales.
const ADVANCED: OrderStatus[] = ['confirmed', 'sent_to_dropi', 'shipped', 'delivered']
const currentStep = computed(() => {
  const value = order.value
  if (!value) return 0
  if (value.paymentMethod === 'card') return 1
  if (value.paymentMethod === 'transfer') {
    if (value.status === 'transfer_review') return 2
    if (ADVANCED.includes(value.status)) return 3
  }
  return ADVANCED.includes(value.status) ? 1 : 0
})

// El pedido ya existe: lo que quede en el carrito es de esta compra.
cart.clear()
if (number.value && phone.value) fetch(number.value, phone.value)
</script>

<template>
  <div class="success">
    <header class="success__head">
      <SuccessCheck />
      <p class="success__eyebrow">{{ orderCopy.thanks }}</p>
      <h1 class="success__title">{{ title }}</h1>
      <p v-if="order" class="success__lead">{{ orderCopy.lead[order.paymentMethod] }}</p>
    </header>

    <div v-if="loading" class="success__loading" :aria-label="orderCopy.loadingOrder" role="status">
      <span class="skeleton"></span>
      <span class="skeleton"></span>
    </div>

    <template v-else-if="order">
      <BankTransfer v-if="awaitingTransfer" :order="order" :phone="phone" @uploaded="order = $event" />
      <NextSteps v-if="steps.length" :steps="steps" :current="currentStep" />
      <OrderItemsCard v-reveal :order="order" />
    </template>

    <p v-else-if="error || !phone" class="success__error" role="status">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ orderCopy.orderError }}
    </p>

    <div class="success__actions">
      <a :href="whatsappLink(orderCopy.whatsappMessage(number))" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ orderCopy.whatsappCta }}
      </a>
      <RouterLink to="/tienda" class="btn btn--ghost btn--lg btn--block">{{ orderCopy.continueShopping }}</RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.success {
  @include container(680px);
  @include flex(column, stretch, flex-start, 1.25rem);
  padding-block: 2.5rem $space-xl;

  &__head {
    @include flex(column, center, center, 0.45rem);
    text-align: center;
    margin-bottom: 0.75rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-top: 1rem;
    animation: rise $dur-slow 0.5s $ease-out both;
  }

  &__title {
    @include display($display-sm, 800, 118%);
    animation: rise $dur-slow 0.6s $ease-out both;
  }

  &__lead {
    max-width: 40ch;
    font-size: $text-lg;
    color: $ink-soft;
    line-height: 1.45;
    animation: rise $dur-slow 0.7s $ease-out both;
  }

  &__loading {
    @include flex(column, stretch, flex-start, 1rem);

    span {
      height: 9rem;
      border-radius: $radius-md;
    }
  }

  &__error {
    @include flex(row, baseline, flex-start, 0.55rem);
    padding: 1rem;
    border-radius: 14px;
    background: $info-bg;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-top: 0.5rem;

    .btn--whatsapp {
      min-height: 3.75rem;
      font-size: 1.05rem;
    }
  }
}
</style>
