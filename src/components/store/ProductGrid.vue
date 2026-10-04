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
    <!-- Escalonado por fila (módulo 4) para que "Cargar más" no herede retrasos largos. -->
    <ProductCard
      v-for="(product, i) in products"
      :key="product._id"
      v-reveal="(i % 4) * 70"
      :product="product"
      :eager="i < 2"
    />
  </div>
</template>

<style scoped lang="scss">
// Dos columnas en móvil (lo que esperan los compradores de Meta/TikTok), tres o cuatro en escritorio.
// El max-width evita que la última fila incompleta estire sus tarjetas.
.grid {
  @include flex-cards(150px, 0.75rem);

  > * {
    max-width: calc(50% - 0.375rem);
  }

  @include from('md') {
    @include flex-cards(200px, 1.25rem);

    > * {
      max-width: calc((100% - 2.5rem) / 3);
    }
  }

  @include from('lg') {
    > * {
      flex-basis: 210px;
      max-width: calc((100% - 3.75rem) / 4);
    }
  }
}
</style>
