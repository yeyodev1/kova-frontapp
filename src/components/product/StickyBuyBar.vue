<script setup lang="ts">
import { productCopy } from '@/config/site'
import { formatCents } from '@/utils/format'

defineProps<{ visible: boolean; total: number; title: string; image?: string; inStock: boolean }>()
const emit = defineEmits<{ buy: [] }>()
</script>

<template>
  <Transition name="bar">
    <div v-if="visible" class="bar">
      <div class="bar__info">
        <img v-if="image" :src="image" alt="" width="44" height="44" loading="lazy" />
        <div>
          <p class="bar__title">{{ title }}</p>
          <strong class="bar__total">{{ formatCents(total) }}</strong>
        </div>
      </div>
      <button class="btn btn--cta btn--lg bar__btn" :disabled="!inStock" @click="emit('buy')">
        {{ inStock ? productCopy.buyNow : productCopy.soldOut }}
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  @include flex(row, center, space-between, 0.75rem);
  padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-bottom));
  background: rgba($surface, 0.97);
  backdrop-filter: blur(8px);
  border-top: 1px solid $line;
  box-shadow: 0 -10px 30px rgba($ink, 0.08);

  // En escritorio el CTA principal siempre queda a la vista en la columna fija.
  @include from('md') {
    display: none;
  }

  &__info {
    @include flex(row, center, flex-start, 0.6rem);
    min-width: 0;
    flex: 1;

    img {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }

    > div {
      min-width: 0;
    }
  }

  &__title {
    font-size: $text-xs;
    color: $ink-soft;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__total {
    font-family: $font-display;
    font-size: $text-lg;
  }

  &__btn {
    flex-shrink: 0;
    padding-inline: 1.3rem;
  }
}

.bar-enter-active,
.bar-leave-active {
  transition: transform 0.3s $ease;
}

.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
}
</style>
