<script setup lang="ts">
import { computed } from 'vue'
import { productCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import PriceTag from '@/components/store/PriceTag.vue'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
  price: number
  compareAt: number
  inStock: boolean
  lowStock: boolean
  stock?: number
}>()

const savings = computed(() => (props.compareAt > props.price ? props.compareAt - props.price : 0))
</script>

<template>
  <div class="summary">
    <p v-if="product.category" class="summary__category">{{ product.category }}</p>
    <h1 class="summary__title">{{ product.title }}</h1>

    <div class="summary__price">
      <PriceTag :price="price" :compare-at="compareAt" size="lg" hide-off />
      <span v-if="savings" class="summary__save">
        <i class="fa-solid fa-tag" aria-hidden="true"></i>
        {{ productCopy.youSave(formatCents(savings)) }}
      </span>
    </div>

    <ul v-if="product.soldCount > 0 || !inStock || lowStock" class="summary__meta">
      <li v-if="product.soldCount > 0">{{ productCopy.sold(product.soldCount) }}</li>
      <li v-if="!inStock" class="summary__stock summary__stock--out">
        <span class="summary__pulse" aria-hidden="true"></span>{{ productCopy.soldOut }}
      </li>
      <li v-else-if="lowStock" class="summary__stock">
        <span class="summary__pulse" aria-hidden="true"></span>
        {{ stock ? productCopy.lowStockLine(stock) : productCopy.lowStock }}
      </li>
    </ul>

    <p v-if="product.shortDescription" class="summary__short">{{ product.shortDescription }}</p>
  </div>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, flex-start, flex-start, 0.65rem);

  &__category {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(1.75rem, 1.35rem + 1.9vw, 2.75rem), 800, 122%);
    line-height: 1.04;
  }

  &__price {
    @include flex(row, center, flex-start, 0.5rem 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.35rem;
  }

  &__save {
    @include flex(row, center, flex-start, 0.35rem);
    font-size: $text-sm;
    font-weight: 700;
    color: $cta-deep;
    background: $cta-soft;
    padding: 0.32rem 0.75rem;
    border-radius: $radius-pill;

    i {
      font-size: 0.75rem;
    }
  }

  &__meta {
    list-style: none;
    @include flex(row, center, flex-start, 0.45rem 1.1rem);
    flex-wrap: wrap;
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $ink-soft;
  }

  &__stock {
    @include flex(row, center, flex-start, 0.45rem);
    color: $cta-deep;

    &--out {
      color: $danger;
    }
  }

  // Punto pulsante: el halo crece y se desvanece (transform + opacity).
  &__pulse {
    position: relative;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: currentColor;
      animation: summary-pulse 1.8s $ease-out infinite;
    }
  }

  &__stock--out &__pulse::after {
    animation: none;
  }

  &__short {
    color: $ink-soft;
    font-size: $text-base;
    max-width: 52ch;
  }

  @include reduced-motion {
    &__pulse::after {
      animation: none;
    }
  }
}

@keyframes summary-pulse {
  from {
    transform: scale(1);
    opacity: 0.6;
  }
  to {
    transform: scale(3.2);
    opacity: 0;
  }
}
</style>
