<script setup lang="ts">
import SectionHeading from '@/components/store/SectionHeading.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import type { Product } from '@/types'

defineProps<{ eyebrow: string; title: string; products: Product[]; loading: boolean; link?: string; linkLabel?: string }>()
</script>

<template>
  <section v-if="loading || products.length" class="section">
    <div class="section__head">
      <SectionHeading :eyebrow="eyebrow" :title="title" />
      <RouterLink v-if="link && products.length" :to="link" class="section__top-link">
        {{ linkLabel || 'Ver todos' }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
    <div v-reveal class="section__grid">
      <ProductGrid :products="products" :loading="loading" />
    </div>
    <RouterLink v-if="link && products.length" :to="link" class="btn btn--ghost section__more">
      {{ linkLabel || 'Ver todos' }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.section {
  @include flex(column, stretch, flex-start);

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
  }

  &__top-link {
    display: none;

    @include from('md') {
      @include flex(row, center, flex-start, 0.5rem);
      @include eyebrow;
      color: $accent-deep;
      margin-bottom: 2.4rem;
      white-space: nowrap;

      i {
        transition: transform $dur $ease-out;
      }

      &:hover i {
        transform: translateX(4px);
      }
    }
  }

  // Las tarjetas entran escalonadas. ProductGrid no se toca: el escalonado se
  // hace desde acá con una animación de relleno "backwards", que al terminar
  // no pisa los transform de hover de la tarjeta.
  &__grid.reveal {
    opacity: 1;
    transform: none;
  }

  &__grid.reveal:not(.is-visible) :deep(.grid > *) {
    opacity: 0;
  }

  &__grid.is-visible :deep(.grid > *) {
    animation: rise 0.6s $ease-out backwards;
    animation-delay: 420ms;
  }

  @for $i from 1 through 6 {
    &__grid.is-visible :deep(.grid > :nth-child(#{$i})) {
      animation-delay: #{($i - 1) * 70}ms;
    }
  }

  &__more {
    align-self: center;
    margin-top: 1.75rem;
    background: $surface;
    border: 1px solid $line;

    @include from('md') {
      display: none;
    }
  }
}
</style>
