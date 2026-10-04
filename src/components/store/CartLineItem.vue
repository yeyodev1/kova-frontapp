<script setup lang="ts">
import { formatCents } from '@/utils/format'
import { cartCopy } from '@/config/site'
import QuantityStepper from './QuantityStepper.vue'
import type { OrderItem } from '@/types'

defineProps<{ item?: OrderItem; quantity: number }>()
const emit = defineEmits<{ quantity: [value: number]; remove: [] }>()
</script>

<template>
  <li class="line">
    <div class="line__media">
      <img v-if="item?.image" :src="item.image" :alt="item.title" loading="lazy" width="72" height="72" />
      <span v-else class="skeleton"></span>
    </div>
    <div class="line__info">
      <p class="line__title">{{ item?.title || '...' }}</p>
      <p v-if="item?.variantName" class="line__variant">{{ item.variantName }}</p>
      <div class="line__row">
        <QuantityStepper :model-value="quantity" @update:model-value="emit('quantity', $event)" />
        <strong v-if="item" class="line__total">{{ formatCents(item.total) }}</strong>
      </div>
    </div>
    <button class="line__remove" :aria-label="cartCopy.remove" @click="emit('remove')">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  </li>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 0.8rem);
  padding-block: 0.9rem;
  border-bottom: 1px solid $line;

  &__media {
    flex-shrink: 0;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;

    img,
    span {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.25rem);
  }

  &__title {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.35;
  }

  &__variant {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: 0.3rem;
  }

  &__total {
    font-family: $font-display;
    font-size: $text-sm;
  }

  &__remove {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    color: $ink-muted;
    @include transition(color);

    &:hover {
      color: $danger;
    }
  }
}
</style>
