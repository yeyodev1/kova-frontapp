<script setup lang="ts">
import { productCopy } from '@/config/site'
import type { ProductVariant } from '@/types'

defineProps<{ variants: ProductVariant[] }>()
const model = defineModel<string | null>({ required: true })
</script>

<template>
  <fieldset class="variants">
    <legend class="variants__legend">{{ productCopy.variantTitle }}</legend>
    <div class="variants__list">
      <label
        v-for="variant in variants"
        :key="variant._id"
        class="variants__option"
        :class="{ 'variants__option--active': model === variant._id, 'variants__option--out': variant.stock <= 0 }"
      >
        <input v-model="model" type="radio" name="variant" :value="variant._id" :disabled="variant.stock <= 0" class="visually-hidden" />
        {{ variant.name }}
        <span v-if="variant.stock <= 0" class="visually-hidden">({{ productCopy.soldOut }})</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.variants {
  border: none;

  &__legend {
    font-weight: 600;
    font-size: $text-sm;
    margin-bottom: 0.5rem;
  }

  &__list {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__option {
    margin: 0;
    @include flex(row, center, center);
    min-height: 2.75rem;
    min-width: 2.75rem;
    padding: 0.45rem 1rem;
    border: 1.5px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink;
    cursor: pointer;
    @include transition;

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--active {
      border-color: $accent;
      background: $accent-soft;
      color: $accent-deep;
    }

    &--out {
      color: $ink-muted;
      text-decoration: line-through;
      cursor: not-allowed;
      background: $paper;
    }
  }
}
</style>
