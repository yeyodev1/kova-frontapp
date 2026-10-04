<script setup lang="ts">
import { productCopy } from '@/config/site'
import PriceRoll from './PriceRoll.vue'

defineProps<{ visible: boolean; total: number; title: string; image?: string; inStock: boolean }>()
const emit = defineEmits<{ buy: [] }>()
</script>

<template>
  <Transition name="slide-up">
    <div v-if="visible" class="bar">
      <div class="bar__info">
        <span v-if="image" class="bar__thumb">
          <img :src="image" alt="" width="48" height="48" loading="lazy" />
        </span>
        <div class="bar__text">
          <p class="bar__title">{{ title }}</p>
          <PriceRoll :cents="total" class="bar__total" />
        </div>
      </div>
      <button class="btn btn--cta btn--lg bar__btn" :disabled="!inStock" @click="emit('buy')">
        {{ inStock ? productCopy.buyNow : productCopy.soldOut }}
        <i v-if="inStock" class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bar {
  position: fixed;
  left: 0.5rem;
  right: 0.5rem;
  bottom: calc(0.5rem + env(safe-area-inset-bottom));
  z-index: 90;
  @include flex(row, center, space-between, 0.65rem);
  padding: 0.5rem 0.5rem 0.5rem 0.55rem;
  border-radius: 22px;
  background: rgba($surface, 0.94);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow:
    inset 0 0 0 1px rgba($line, 0.9),
    0 18px 40px -10px rgba($ink, 0.28);

  // En escritorio la columna de compra ya tiene el CTA a la vista.
  @include from('lg') {
    display: none;
  }

  &__info {
    @include flex(row, center, flex-start, 0.6rem);
    min-width: 0;
    flex: 1;
  }

  &__thumb {
    @include plinth(14px);
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10%;
    }
  }

  &__text {
    min-width: 0;
    @include flex(column, flex-start, center);
  }

  &__title {
    font-size: 0.72rem;
    color: $ink-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    line-height: 1.3;
  }

  &__total {
    @include price(1.2rem, 850);
    line-height: 1.15;
  }

  &__btn {
    flex-shrink: 0;
    min-height: 3.1rem;
    padding-inline: 1.15rem;
    font-size: 0.95rem;
    border-radius: 16px;
  }
}
</style>
