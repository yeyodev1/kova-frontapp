<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paymentResponseCopy as copy, site, whatsappLink } from '@/config/site'
import { storeService } from '@/services/store.service'
import { trackPurchase } from '@/composables/usePurchaseTracking'
import { useCartStore } from '@/stores/cart'
import SuccessCheck from '@/components/order/SuccessCheck.vue'

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
    <Transition name="pr-swap" mode="out-in">
      <section v-if="status === 'loading'" key="loading" class="pr__state" role="status" aria-live="polite">
        <span class="pr__plinth" aria-hidden="true"><img :src="site.logo" alt="" width="64" height="64" /></span>
        <h1 class="pr__title">{{ copy.loadingTitle }}</h1>
        <p class="pr__text">{{ copy.loadingText }}</p>
        <span class="pr__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      </section>

      <section v-else-if="status === 'approved'" key="ok" class="pr__state" role="status">
        <SuccessCheck />
        <h1 class="pr__title">{{ copy.approvedTitle }}</h1>
        <p class="pr__text">{{ copy.approvedText }}</p>
      </section>

      <section v-else key="bad" class="pr__state" role="alert">
        <span class="pr__bad" aria-hidden="true"><i class="fa-solid fa-xmark"></i></span>
        <h1 class="pr__title">{{ copy.rejectedTitle }}</h1>
        <p class="pr__text">{{ copy.rejectedText }}</p>
        <p class="pr__note"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> {{ copy.rejectedNote }}</p>
        <div class="pr__actions">
          <RouterLink to="/checkout" class="btn btn--cta btn--lg btn--block">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
          </RouterLink>
          <RouterLink to="/checkout" class="btn btn--outline btn--lg btn--block">{{ copy.otherMethod }}</RouterLink>
          <a :href="whatsappLink(copy.whatsappMessage)" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.help }}
          </a>
          <RouterLink to="/tienda" class="pr__home">{{ copy.backHome }}</RouterLink>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.pr {
  @include container(480px);
  @include flex(column, stretch, center);
  flex: 1;
  min-height: 100svh;
  padding-block: $space-lg;

  &__state {
    @include flex(column, center, center, 0.75rem);
    text-align: center;
  }

  // Peana con destello lento en bucle: algo pasa, sin la ansiedad de un spinner.
  &__plinth {
    @include plinth(26px);
    @include flex(row, center, center);
    width: 6.5rem;
    height: 6.5rem;
    margin-bottom: 0.75rem;

    img {
      width: 4rem;
      height: 4rem;
      border-radius: 14px;
      mix-blend-mode: normal;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -20% auto -20% -60%;
      width: 45%;
      background: linear-gradient(100deg, transparent, rgba(#fff, 0.75), transparent);
      transform: skewX(-18deg);
      animation: pr-sweep 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }

  &__title {
    @include display($display-sm, 800, 116%);
  }

  &__text {
    color: $ink-soft;
    max-width: 36ch;
    line-height: 1.5;
  }

  &__dots {
    @include flex(row, center, center, 0.35rem);
    margin-top: 0.5rem;

    i {
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: $accent;
      animation: pr-dot 1.2s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.15s;
      }

      &:nth-child(3) {
        animation-delay: 0.3s;
      }
    }
  }

  &__bad {
    @include flex(row, center, center);
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: $danger-bg;
    color: $danger;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    animation: pop 0.45s $ease-spring;
  }

  &__note {
    @include flex(row, baseline, center, 0.5rem);
    padding: 0.7rem 1rem;
    border-radius: 12px;
    background: $accent-soft;
    color: $accent-deep;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.65rem);
    width: 100%;
    margin-top: 0.75rem;
  }

  &__home {
    align-self: center;
    padding: 0.75rem 1rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

@keyframes pr-sweep {
  0% {
    transform: translateX(0) skewX(-18deg);
  }
  55%,
  100% {
    transform: translateX(480%) skewX(-18deg);
  }
}

@keyframes pr-dot {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@include reduced-motion {
  .pr__plinth::after {
    display: none;
  }
}

.pr-swap-enter-active,
.pr-swap-leave-active {
  transition:
    opacity $dur ease,
    transform $dur $ease-out;
}
.pr-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.pr-swap-leave-to {
  opacity: 0;
}
</style>
