<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useQuote } from '@/composables/useQuote'
import { formatCents } from '@/utils/format'
import { cartCopy } from '@/config/site'
import CartLineItem from './CartLineItem.vue'
import EmptyState from './EmptyState.vue'
import TrustSeals from './TrustSeals.vue'
import type { CartLine, PaymentMethod } from '@/types'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const open = toRef(cart, 'isOpen')
const method = ref<PaymentMethod>('cod')
const { quote, loading, itemFor } = useQuote(method, open)

useBodyScroll(open)

const subtotal = computed(() => quote.value?.subtotal || 0)
const keyOf = (line: CartLine) => `${line.productId}-${line.variantId}`

// Resalta la línea que se agregó mientras el carrito estaba cerrado.
const fresh = ref('')
let snapshot = new Map(cart.lines.map((l) => [keyOf(l), l.quantity]))
let freshTimer: ReturnType<typeof setTimeout> | undefined

watch(open, (isOpen) => {
  if (!isOpen) {
    snapshot = new Map(cart.lines.map((l) => [keyOf(l), l.quantity]))
    return
  }
  const added = cart.lines.find((l) => l.quantity > (snapshot.get(keyOf(l)) || 0))
  fresh.value = added ? keyOf(added) : ''
  clearTimeout(freshTimer)
  freshTimer = setTimeout(() => (fresh.value = ''), 1800)
})

function close() {
  cart.isOpen = false
}

function goCheckout() {
  close()
  router.push('/checkout')
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && cart.isOpen) close()
}

watch(() => route.fullPath, close)
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(freshTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="cart.isOpen" class="drawer-overlay" @click="close"></div>
    </Transition>
    <Transition name="slide-right">
      <aside v-if="cart.isOpen" class="drawer" role="dialog" aria-modal="true" :aria-label="cartCopy.title">
        <header class="drawer__head">
          <div>
            <h2 class="drawer__title">{{ cartCopy.title }}</h2>
            <p v-if="cart.count" class="drawer__count">{{ cartCopy.items(cart.count) }}</p>
          </div>
          <button class="drawer__close" :aria-label="cartCopy.close" @click="close">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>

        <div v-if="cart.isEmpty" class="drawer__empty">
          <EmptyState icon="fa-solid fa-bag-shopping" :title="cartCopy.empty" :text="cartCopy.emptyText">
            <RouterLink to="/tienda" class="btn btn--primary btn--lg" @click="close">
              {{ cartCopy.goShopping }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </EmptyState>
        </div>

        <template v-else>
          <TransitionGroup tag="ul" name="line" class="drawer__lines">
            <CartLineItem
              v-for="(line, index) in cart.lines"
              :key="keyOf(line)"
              :item="itemFor(line.productId, line.variantId)"
              :quantity="line.quantity"
              :fresh="fresh === keyOf(line)"
              @quantity="cart.setQuantity(index, $event)"
              @remove="cart.remove(index)"
            />
          </TransitionGroup>

          <footer class="drawer__foot">
            <div class="drawer__subtotal">
              <span>{{ cartCopy.subtotal }}</span>
              <strong :class="{ 'is-loading': loading }">{{ formatCents(subtotal) }}</strong>
            </div>
            <p class="drawer__note">{{ cartCopy.note }}</p>
            <button class="btn btn--cta btn--lg btn--block drawer__cta" @click="goCheckout">
              {{ cartCopy.checkout }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
            <TrustSeals class="drawer__seals" />
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 249;
  background: $overlay;
  backdrop-filter: blur(2px);
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 250;
  width: min(440px, 100%);
  background: $paper;
  @include flex(column, stretch, flex-start);
  box-shadow: $shadow-lg;

  @include from('sm') {
    width: min(440px, 92%);
    border-radius: 24px 0 0 24px;
    overflow: hidden;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: calc(0.9rem + env(safe-area-inset-top)) 1.25rem 0.9rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display($text-xl, 800, 118%);
  }

  &__count {
    @include eyebrow;
    color: $ink-muted;
    margin-top: 0.2rem;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 1.15rem;
    background: $surface;
    border: 1px solid $line;
    transition: transform $dur-fast $ease-out;

    &:active {
      transform: scale(0.9);
    }
  }

  &__empty {
    flex: 1;
    @include flex(column, center, center);
  }

  &__lines {
    position: relative;
    list-style: none;
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1rem 1.25rem;
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 1.1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
    background: $surface;
    border-top: 1px solid $line;
    box-shadow: 0 -12px 30px -20px rgba($ink, 0.25);
  }

  &__subtotal {
    @include flex(row, baseline, space-between);

    span {
      @include eyebrow;
      color: $ink-soft;
    }

    strong {
      @include price($display-sm);
      transition: opacity $dur $ease-out;

      &.is-loading {
        opacity: 0.45;
      }
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: -0.3rem;
  }

  &__cta::after {
    animation: glint 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
  }

  &__seals {
    justify-content: center;
  }
}

.line-move,
.line-enter-active,
.line-leave-active {
  transition:
    opacity $dur $ease-out,
    transform $dur $ease-out;
}
.line-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.line-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.line-leave-active {
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
}
</style>
