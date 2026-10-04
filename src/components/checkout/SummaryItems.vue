<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { OrderItem } from '@/types'

// null mientras llega la cotización: se muestran bloques de carga del mismo alto.
defineProps<{ items: OrderItem[] | null }>()
</script>

<template>
  <ul v-if="items" class="si" :aria-label="checkoutCopy.summary">
    <li v-for="item in items" :key="`${item.product}-${item.variantId}`" class="si__item">
      <span class="si__media">
        <img v-if="item.image" :src="item.image" :alt="item.title" width="64" height="64" />
        <i v-else class="fa-solid fa-box" aria-hidden="true"></i>
      </span>
      <span class="si__qty" aria-hidden="true">{{ item.quantity }}</span>
      <span class="si__name">
        {{ item.title }}
        <small v-if="item.variantName">{{ item.variantName }}</small>
        <small class="visually-hidden">× {{ item.quantity }}</small>
      </span>
      <strong class="si__line">{{ formatCents(item.total) }}</strong>
    </li>
  </ul>
  <div v-else class="si si--loading">
    <span class="skeleton"></span>
    <span class="skeleton"></span>
  </div>
</template>

<style scoped lang="scss">
.si {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding-top: 0.9rem;

  @include from('lg') {
    padding-top: 0;
  }

  &--loading span {
    height: 4rem;
  }

  &__item {
    position: relative;
    @include flex(row, center, flex-start, 0.85rem);
    font-size: $text-sm;
  }

  &__media {
    @include plinth(14px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    color: $alu-dark;

    img {
      width: 86%;
      height: 86%;
      object-fit: contain;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    left: 3.25rem;
    min-width: 1.35rem;
    height: 1.35rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.68rem;
    font-weight: 700;
    text-align: center;
    line-height: 1.35rem;
    box-shadow: 0 0 0 2px $surface;
  }

  &__name {
    flex: 1;
    min-width: 0;
    line-height: 1.35;
    font-weight: 600;

    small {
      display: block;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__line {
    @include price($text-base, 700);
    white-space: nowrap;
  }
}
</style>
