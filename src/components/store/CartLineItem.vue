<script setup lang="ts">
import { formatCents } from '@/utils/format'
import { cartCopy } from '@/config/site'
import QuantityStepper from './QuantityStepper.vue'
import type { OrderItem } from '@/types'

defineProps<{ item?: OrderItem; quantity: number; fresh?: boolean }>()
const emit = defineEmits<{ quantity: [value: number]; remove: [] }>()
</script>

<template>
  <li class="line" :class="{ 'line--fresh': fresh }">
    <div class="line__media">
      <img v-if="item?.image" :src="item.image" :alt="item.title" loading="lazy" width="80" height="80" />
      <span v-else class="line__placeholder skeleton"></span>
    </div>
    <div class="line__info">
      <div class="line__top">
        <p class="line__title">{{ item?.title || '...' }}</p>
        <button class="line__remove" :aria-label="`${cartCopy.remove}: ${item?.title || ''}`" @click="emit('remove')">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
      <p v-if="item?.variantName" class="line__variant">{{ item.variantName }}</p>
      <div class="line__row">
        <QuantityStepper :model-value="quantity" @update:model-value="emit('quantity', $event)" />
        <strong v-if="item" class="line__total">{{ formatCents(item.total) }}</strong>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.line {
  position: relative;
  @include flex(row, flex-start, flex-start, 0.9rem);
  padding: 0.9rem;
  border-radius: $radius-md;
  background: $surface;
  border: 1px solid $line;

  // Resalte breve de la línea recién agregada: un velo salvia que se apaga.
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1.5px solid $accent;
    background: rgba($accent-soft, 0.55);
    opacity: 0;
    pointer-events: none;
  }

  &--fresh::after {
    animation: fresh 1.6s $ease-out;
  }

  &__media {
    @include plinth(14px);
    flex-shrink: 0;
    width: 5rem;
    height: 5rem;
    padding: 0.4rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__placeholder {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__info {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.2rem);
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.5rem);
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__variant {
    @include eyebrow;
    font-size: 0.62rem;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: 0.45rem;
  }

  &__total {
    @include price($text-base);
  }

  &__remove {
    @include tap-target;
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    margin: -0.2rem -0.3rem 0 0;
    border-radius: 50%;
    color: $ink-muted;
    font-size: 0.85rem;
    transition:
      color $dur-fast $ease-out,
      background-color $dur-fast $ease-out;

    &:hover {
      color: $danger;
      background: $danger-bg;
    }
  }
}

@keyframes fresh {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
