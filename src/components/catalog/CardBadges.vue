<script setup lang="ts">
import { computed } from 'vue'
import { productCopy } from '@/config/site'
import { savingsPercent } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const soldOut = computed(() => props.product.stock <= 0)
const percent = computed(() => savingsPercent(props.product.price, props.product.compareAtPrice))

// Solo datos reales: agotado, stock bajo (con la cifra) y más vendido por soldCount.
const badges = computed(() => {
  const p = props.product
  if (soldOut.value) return [{ label: productCopy.soldOut, tone: 'out' }]
  const list: { label: string; tone: string }[] = []
  if (p.soldCount >= productCopy.bestSellerFrom) {
    list.push({ label: productCopy.bestSeller, tone: 'best' })
  }
  if (p.stock <= productCopy.lowStockThreshold) {
    list.push({ label: productCopy.lowStockBadge(p.stock), tone: 'low' })
  }
  return list
})
</script>

<template>
  <div v-if="badges.length" class="badges">
    <span v-for="b in badges" :key="b.tone" class="badges__item" :class="`badges__item--${b.tone}`">
      {{ b.label }}
    </span>
  </div>
  <span v-if="percent > 0 && !soldOut" class="off">{{ productCopy.off(percent) }}</span>
</template>

<style scoped lang="scss">
%tag {
  font-family: $font-mono;
  font-weight: 600;
  line-height: 1;
  padding: 0.32rem 0.45rem;
  border-radius: 6px;
}

.badges {
  position: absolute;
  top: 0.45rem;
  left: 0.45rem;
  right: 3.4rem;
  @include flex(column, flex-start, flex-start, 0.25rem);
  pointer-events: none;

  &__item {
    @extend %tag;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: $accent-deep;
    color: $surface;

    &--low {
      background: rgba($surface, 0.92);
      color: $cta-deep;
      box-shadow: inset 0 0 0 1px rgba($cta, 0.3);
    }

    &--out {
      background: $ink;
    }
  }
}

.off {
  @extend %tag;
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  font-size: 0.64rem;
  background: $cta-soft;
  color: $cta-deep;
  pointer-events: none;
}
</style>
