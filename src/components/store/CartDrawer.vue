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
import type { PaymentMethod } from '@/types'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const open = toRef(cart, 'isOpen')
const method = ref<PaymentMethod>('card')
const { quote, loading, itemFor } = useQuote(method, open)

useBodyScroll(open)

const subtotal = computed(() => quote.value?.subtotal || 0)

function close() {
  cart.isOpen = false
}

function goCheckout() {
  close()
  router.push('/checkout')
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(() => route.fullPath, close)
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="cart.isOpen" class="drawer" @click.self="close">
        <aside class="drawer__panel" role="dialog" aria-modal="true" :aria-label="cartCopy.title">
          <header class="drawer__head">
            <h2 class="drawer__title">{{ cartCopy.title }} ({{ cart.count }})</h2>
            <button class="drawer__close" aria-label="Cerrar carrito" @click="close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <EmptyState v-if="cart.isEmpty" icon="fa-solid fa-cart-shopping" :title="cartCopy.empty" :text="cartCopy.emptyText">
            <RouterLink to="/tienda" class="btn btn--primary" @click="close">{{ cartCopy.goShopping }}</RouterLink>
          </EmptyState>

          <template v-else>
            <ul class="drawer__lines">
              <CartLineItem
                v-for="(line, index) in cart.lines"
                :key="`${line.productId}-${line.variantId}`"
                :item="itemFor(line.productId, line.variantId)"
                :quantity="line.quantity"
                @quantity="cart.setQuantity(index, $event)"
                @remove="cart.remove(index)"
              />
            </ul>

            <footer class="drawer__foot">
              <div class="drawer__subtotal">
                <span>{{ cartCopy.subtotal }}</span>
                <strong :class="{ 'drawer__loading': loading }">{{ formatCents(subtotal) }}</strong>
              </div>
              <p class="drawer__note">{{ cartCopy.note }}</p>
              <button class="btn btn--cta btn--lg btn--block" @click="goCheckout">
                {{ cartCopy.checkout }} <i class="fa-solid fa-arrow-right"></i>
              </button>
              <TrustSeals class="drawer__seals" />
            </footer>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: $overlay;
  @include flex(row, stretch, flex-end);

  &__panel {
    width: min(420px, 100%);
    height: 100%;
    background: $paper;
    @include flex(column, stretch, flex-start);
    box-shadow: $shadow-lg;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $line;
    background: $surface;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.2rem;
  }

  &__lines {
    list-style: none;
    flex: 1;
    overflow-y: auto;
    padding: 0 1.25rem;
    overscroll-behavior: contain;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    background: $surface;
  }

  &__subtotal {
    @include flex(row, center, space-between);
    font-size: $text-lg;

    strong {
      font-family: $font-display;
    }
  }

  &__loading {
    opacity: 0.5;
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__seals {
    justify-content: center;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .drawer__panel {
    transition: transform 0.35s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateX(100%);
  }
}
</style>
