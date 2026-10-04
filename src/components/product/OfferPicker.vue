<script setup lang="ts">
import { productCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { OfferOption } from '@/composables/useProduct'

defineProps<{ offers: OfferOption[] }>()
const model = defineModel<number>({ required: true })
</script>

<template>
  <fieldset class="offers">
    <legend class="offers__legend">{{ productCopy.offersTitle }}</legend>
    <label
      v-for="offer in offers"
      :key="offer.quantity"
      class="offer"
      :class="{ 'offer--active': model === offer.quantity }"
    >
      <input v-model="model" type="radio" name="offer" :value="offer.quantity" class="visually-hidden" />
      <span class="offer__radio" aria-hidden="true"></span>
      <span class="offer__main">
        <span class="offer__qty">
          {{ productCopy.unit(offer.quantity) }}
          <span v-if="offer.label" class="offer__label">{{ offer.label }}</span>
        </span>
        <span v-if="offer.quantity > 1" class="offer__unit">{{ productCopy.perUnit(formatCents(offer.unitPrice)) }}</span>
        <span v-if="offer.savings > 0" class="offer__save">{{ productCopy.youSave(formatCents(offer.savings)) }}</span>
      </span>
      <span class="offer__price">
        <strong>{{ formatCents(offer.total) }}</strong>
        <s v-if="offer.savings > 0">{{ formatCents(offer.compareTotal) }}</s>
      </span>
    </label>
  </fieldset>
</template>

<style scoped lang="scss">
.offers {
  border: none;
  @include flex(column, stretch, flex-start, 0.55rem);

  &__legend {
    font-weight: 600;
    font-size: $text-sm;
    margin-bottom: 0.5rem;
  }
}

.offer {
  margin: 0;
  @include flex(row, center, flex-start, 0.8rem);
  padding: 0.85rem 1rem;
  min-height: 4rem;
  border: 1.5px solid $line;
  border-radius: $radius-sm;
  background: $surface;
  color: $ink;
  cursor: pointer;
  @include transition;

  &:has(input:focus-visible) {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &__radio {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    border: 2px solid $silver;
    @include transition;
  }

  &--active {
    border-color: $accent;
    background: $accent-soft;
    box-shadow: 0 0 0 1px $accent;
  }

  &--active &__radio {
    border-color: $accent;
    border-width: 6px;
  }

  &__main {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;
  }

  &__qty {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-weight: 600;
    font-size: $text-base;
  }

  &__label {
    font-size: 0.7rem;
    font-weight: 700;
    background: $cta;
    color: $surface;
    padding: 0.12rem 0.5rem;
    border-radius: $radius-pill;
  }

  &__unit {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__save {
    font-size: $text-xs;
    font-weight: 700;
    color: $success;
  }

  &__price {
    @include flex(column, flex-end, center);
    text-align: right;

    strong {
      font-family: $font-display;
      font-size: $text-lg;
    }

    s {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }
}
</style>
