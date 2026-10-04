<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { orderCopy, whatsappLink } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useOrder } from '@/composables/useOrder'
import { normalizePhone } from '@/composables/useCheckoutForm'
import OrderItemsCard from '@/components/order/OrderItemsCard.vue'
import OrderTimeline from '@/components/order/OrderTimeline.vue'
import BankTransfer from '@/components/order/BankTransfer.vue'

const route = useRoute()
const cart = useCartStore()
const { order, loading, fetch } = useOrder()

const number = computed(() => String(route.params.number || ''))
const phone = computed(() => normalizePhone(String(route.query.phone || '')))
const steps = computed(() => (order.value ? orderCopy.steps[order.value.paymentMethod] : []))
const awaitingTransfer = computed(() => order.value?.status === 'awaiting_transfer')

// El pedido ya existe: lo que quede en el carrito es de esta compra.
cart.clear()
if (number.value && phone.value) fetch(number.value, phone.value)
</script>

<template>
  <div class="success">
    <header class="success__head">
      <span class="success__icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
      <h1 class="success__title">{{ orderCopy.thanks }}</h1>
      <p class="success__text">{{ orderCopy.received(number) }}</p>
    </header>

    <div v-if="loading" class="success__loading skeleton"></div>

    <template v-else-if="order">
      <OrderTimeline :status="order.status" />

      <BankTransfer v-if="awaitingTransfer" :order="order" :phone="phone" @uploaded="order = $event" />

      <section v-if="steps.length" class="success__steps">
        <h2>{{ orderCopy.nextSteps }}</h2>
        <ol>
          <li v-for="step in steps" :key="step">{{ step }}</li>
        </ol>
      </section>

      <OrderItemsCard :order="order" />
    </template>

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
  @include container(640px);
  @include flex(column, stretch, flex-start, 1.5rem);
  padding-block: 2rem $space-xl;

  &__head {
    @include flex(column, center, center, 0.5rem);
    text-align: center;
  }

  &__icon {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: $success;
    color: $surface;
    font-size: 1.6rem;
    box-shadow: 0 0 0 8px $success-bg;
    margin-bottom: 0.5rem;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__loading {
    height: 12rem;
  }

  &__steps {
    @include card;
    padding: 1.1rem;

    h2 {
      font-size: $text-lg;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }

    ol {
      padding-left: 1.2rem;
      @include flex(column, stretch, flex-start, 0.4rem);
      color: $ink-soft;
    }
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
  }
}
</style>
