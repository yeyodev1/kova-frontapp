<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paymentResponseCopy as copy, site, whatsappLink } from '@/config/site'
import { storeService } from '@/services/store.service'
import { trackPurchase } from '@/composables/usePurchaseTracking'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const status = ref<'loading' | 'approved' | 'rejected'>('loading')

// Payphone reversa el cobro si no se confirma en 5 minutos: se confirma apenas carga.
async function confirm() {
  const id = String(route.query.id || '')
  const clientTransactionId = String(route.query.clientTransactionId || '')
  if (!id || id === '0' || !clientTransactionId) {
    status.value = 'rejected'
    return
  }
  try {
    const { order, approved } = await storeService.confirmPayment(id, clientTransactionId)
    if (!approved) {
      status.value = 'rejected'
      return
    }
    status.value = 'approved'
    trackPurchase(order)
    cart.clear()
    router.replace({ name: 'OrderSuccess', params: { number: order.number }, query: { phone: order.customer.phone } })
  } catch {
    status.value = 'rejected'
  }
}

confirm()
</script>

<template>
  <div class="pr">
    <img :src="site.logo" alt="" width="56" height="56" class="pr__logo" />

    <template v-if="status === 'loading'">
      <i class="fa-solid fa-spinner fa-spin pr__icon" aria-hidden="true"></i>
      <h1 class="pr__title">{{ copy.loadingTitle }}</h1>
      <p class="pr__text">{{ copy.loadingText }}</p>
    </template>

    <template v-else-if="status === 'approved'">
      <i class="fa-solid fa-circle-check pr__icon pr__icon--ok" aria-hidden="true"></i>
      <h1 class="pr__title">{{ copy.approvedTitle }}</h1>
      <p class="pr__text">{{ copy.approvedText }}</p>
    </template>

    <template v-else>
      <i class="fa-solid fa-circle-xmark pr__icon pr__icon--bad" aria-hidden="true"></i>
      <h1 class="pr__title">{{ copy.rejectedTitle }}</h1>
      <p class="pr__text">{{ copy.rejectedText }}</p>
      <div class="pr__actions">
        <RouterLink to="/checkout" class="btn btn--cta btn--lg btn--block">{{ copy.retry }}</RouterLink>
        <a :href="whatsappLink(copy.whatsappMessage)" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.help }}
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pr {
  @include container(480px);
  @include flex(column, center, center, 0.7rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl;

  &__logo {
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  &__icon {
    font-size: 2.6rem;
    color: $accent;

    &--ok {
      color: $success;
    }

    &--bad {
      color: $danger;
    }
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__text {
    color: $ink-soft;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
