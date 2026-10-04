<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'
import type { Product } from '@/types'

withDefaults(defineProps<{ products: Product[]; loading?: boolean; skeletons?: number }>(), {
  loading: false,
  skeletons: 4,
})
</script>

<template>
  <div class="grid">
    <template v-if="loading && !products.length">
      <ProductCardSkeleton v-for="n in skeletons" :key="`sk-${n}`" />
    </template>
    <ProductCard v-for="(product, i) in products" :key="product._id" :product="product" :eager="i < 2" />
  </div>
</template>

<style scoped lang="scss">
// Dos columnas en móvil (lo que esperan los compradores de Meta/TikTok), tres o cuatro en escritorio.
// El max-width evita que la última fila incompleta estire sus tarjetas.
.grid {
  @include flex-cards(calc(50% - 0.4rem), 0.8rem);

  > * {
    max-width: calc(50% - 0.4rem);
  }

  @include from('md') {
    gap: 1.25rem;

    > * {
      flex-basis: calc((100% - 2.5rem) / 3);
      max-width: calc((100% - 2.5rem) / 3);
    }
  }

  @include from('lg') {
    > * {
      flex-basis: calc((100% - 3.75rem) / 4);
      max-width: calc((100% - 3.75rem) / 4);
    }
  }
}
</style>
