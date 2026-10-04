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
}>()

const savings = computed(() => (props.compareAt > props.price ? props.compareAt - props.price : 0))
</script>

<template>
  <div class="summary">
    <p v-if="product.category" class="summary__category">{{ product.category }}</p>
    <h1 class="summary__title">{{ product.title }}</h1>

    <p v-if="product.soldCount > 0" class="summary__sold">
      <i class="fa-solid fa-fire" aria-hidden="true"></i> {{ productCopy.sold(product.soldCount) }}
    </p>

    <PriceTag :price="price" :compare-at="compareAt" size="lg" />
    <p v-if="savings" class="summary__save">{{ productCopy.youSave(formatCents(savings)) }}</p>

    <p v-if="!inStock" class="summary__stock summary__stock--out">
      <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> {{ productCopy.soldOut }}
    </p>
    <p v-else-if="lowStock" class="summary__stock">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ productCopy.lowStock }}
    </p>

    <p v-if="product.shortDescription" class="summary__short">{{ product.shortDescription }}</p>
  </div>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, flex-start, flex-start, 0.45rem);

  &__category {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(1.4rem, 1.15rem + 1.2vw, 2.1rem), 600);
    line-height: 1.2;
  }

  &__sold {
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    i {
      color: $cta;
    }
  }

  &__save {
    font-size: $text-sm;
    font-weight: 700;
    color: $success;
  }

  &__stock {
    font-size: $text-sm;
    font-weight: 600;
    color: $cta-deep;

    &--out {
      color: $danger;
    }
  }

  &__short {
    color: $ink-soft;
    font-size: $text-base;
    margin-top: 0.2rem;
  }
}
</style>
