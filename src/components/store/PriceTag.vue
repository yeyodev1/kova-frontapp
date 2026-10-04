<script setup lang="ts">
import { computed } from 'vue'
import { formatCents, savingsPercent } from '@/utils/format'

const props = withDefaults(
  defineProps<{ price: number; compareAt?: number; size?: 'sm' | 'lg' }>(),
  { compareAt: 0, size: 'sm' },
)

const percent = computed(() => savingsPercent(props.price, props.compareAt))
</script>

<template>
  <div class="price" :class="`price--${size}`">
    <span class="price__now">{{ formatCents(price) }}</span>
    <template v-if="percent > 0">
      <s class="price__before">{{ formatCents(compareAt) }}</s>
      <span class="price__off">-{{ percent }}%</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(row, baseline, flex-start, 0.45rem);
  flex-wrap: wrap;

  &__now {
    font-family: $font-display;
    font-weight: 700;
    color: $ink;
    font-size: 1.05rem;
  }

  &__before {
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__off {
    font-size: $text-xs;
    font-weight: 700;
    color: $cta-deep;
    background: $cta-soft;
    padding: 0.1rem 0.45rem;
    border-radius: $radius-pill;
  }

  &--lg &__now {
    font-size: clamp(1.8rem, 1.5rem + 1.2vw, 2.3rem);
    line-height: 1.1;
  }

  &--lg &__before {
    font-size: $text-lg;
  }

  &--lg &__off {
    font-size: $text-sm;
  }
}
</style>
