<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { productCopy } from '@/config/site'
import PriceTag from './PriceTag.vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; eager?: boolean }>()

const cart = useCartStore()
const router = useRouter()

const link = computed(() => `/producto/${props.product.slug}`)
const soldOut = computed(() => props.product.stock <= 0)

// Prioridad: agotado > pocas unidades > más vendido. Todo viene de datos reales.
const badge = computed(() => {
  const p = props.product
  if (soldOut.value) return { label: productCopy.soldOut, tone: 'muted' }
  if (p.stock <= productCopy.lowStockThreshold) return { label: productCopy.lowStock, tone: 'warn' }
  if (p.soldCount >= productCopy.bestSellerFrom) return { label: productCopy.bestSeller, tone: 'accent' }
  return null
})

function quickAdd() {
  // Con variantes hay que elegir talla/color: se lleva a la ficha.
  if (props.product.type === 'VARIABLE' && props.product.variants.length) {
    router.push(link.value)
    return
  }
  cart.add(props.product, null, 1)
}
</script>

<template>
  <article class="card" :class="{ 'card--soldout': soldOut }">
    <RouterLink :to="link" class="card__media">
      <img
        v-if="product.images[0]"
        :src="product.images[0]"
        :alt="product.title"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        width="400"
        height="400"
      />
      <span v-else class="card__placeholder"><i class="fa-solid fa-image"></i></span>
      <span v-if="badge" class="card__badge" :class="`card__badge--${badge.tone}`">{{ badge.label }}</span>
    </RouterLink>

    <div class="card__body">
      <RouterLink :to="link" class="card__title">{{ product.title }}</RouterLink>
      <PriceTag :price="product.price" :compare-at="product.compareAtPrice" />
      <p v-if="product.soldCount > 0" class="card__sold">{{ productCopy.sold(product.soldCount) }}</p>
      <button
        class="btn btn--outline btn--block card__add"
        :disabled="soldOut"
        :aria-label="`${productCopy.quickAdd}: ${product.title}`"
        @click="quickAdd"
      >
        <i class="fa-solid fa-cart-plus"></i> {{ productCopy.quickAdd }}
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: hidden;
  @include transition(box-shadow);

  &:hover {
    box-shadow: $shadow-md;
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 1 / 1;
    background: $sand;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      @include transition(transform);
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &--soldout img {
    opacity: 0.55;
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $ink-muted;
    font-size: 2rem;
  }

  &__badge {
    position: absolute;
    top: 0.55rem;
    left: 0.55rem;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;

    &--warn {
      background: $cta;
    }

    &--muted {
      background: $ink-soft;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 0.75rem 0.75rem 0.85rem;
    flex: 1;

    @include from('md') {
      padding: 1rem;
    }
  }

  &__title {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.35;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.7em;
  }

  &__sold {
    font-size: $text-xs;
    color: $accent-deep;
    font-weight: 600;
  }

  &__add {
    margin-top: auto;
    min-height: 2.75rem;
    padding: 0.55rem 0.8rem;
    font-size: $text-sm;
    letter-spacing: 0;
  }
}
</style>
