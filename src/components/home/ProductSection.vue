<script setup lang="ts">
import SectionHeading from '@/components/store/SectionHeading.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import type { Product } from '@/types'

defineProps<{ eyebrow: string; title: string; products: Product[]; loading: boolean; link?: string }>()
</script>

<template>
  <section v-if="loading || products.length" class="section">
    <SectionHeading :eyebrow="eyebrow" :title="title" />
    <ProductGrid :products="products" :loading="loading" />
    <RouterLink v-if="link && products.length" :to="link" class="btn btn--ghost section__more">
      Ver todos <i class="fa-solid fa-arrow-right"></i>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.section {
  @include flex(column, stretch, flex-start);

  &__more {
    align-self: center;
    margin-top: 1.5rem;
    min-height: 3rem;
  }
}
</style>
