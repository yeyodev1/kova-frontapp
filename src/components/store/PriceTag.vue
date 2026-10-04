<script setup lang="ts">
import { computed } from 'vue'
import { productCopy } from '@/config/site'
import { formatCents, savingsPercent } from '@/utils/format'

const props = withDefaults(
  defineProps<{ price: number; compareAt?: number; size?: 'sm' | 'lg'; hideOff?: boolean }>(),
  { compareAt: 0, size: 'sm', hideOff: false },
)

const percent = computed(() => savingsPercent(props.price, props.compareAt))
</script>

<template>
  <div class="price" :class="`price--${size}`">
    <span class="price__now">{{ formatCents(price) }}</span>
    <template v-if="percent > 0">
      <s class="price__before">{{ formatCents(compareAt) }}</s>
      <span v-if="!hideOff" class="price__off">{{ productCopy.off(percent) }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(row, baseline, flex-start, 0.2rem 0.5rem);
  flex-wrap: wrap;
  line-height: 1.1;

  &__now {
    @include price(1.08rem, 800);
    color: $ink;
  }

  &__before {
    font-family: $font-display;
    font-variant-numeric: tabular-nums;
    color: $ink-muted;
    font-size: $text-xs;
    text-decoration-thickness: 1px;
  }

  &__off {
    align-self: center;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: $cta-deep;
    background: $cta-soft;
    padding: 0.18rem 0.45rem;
    border-radius: $radius-pill;
  }

  &--lg &__now {
    @include price(clamp(2.1rem, 1.7rem + 1.6vw, 2.9rem), 850);
    line-height: 1;
  }

  &--lg &__before {
    font-size: $text-lg;
  }

  &--lg &__off {
    font-size: 0.76rem;
    padding: 0.25rem 0.6rem;
  }
}
</style>
