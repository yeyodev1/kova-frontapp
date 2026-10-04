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
      :class="{ 'offer--active': model === offer.quantity, 'offer--tagged': offer.label }"
    >
      <input
        v-model="model"
        type="radio"
        name="offer"
        :value="offer.quantity"
        class="visually-hidden"
      />
      <span v-if="offer.label" class="offer__tab">{{ offer.label }}</span>
      <span class="offer__radio" aria-hidden="true">
        <i v-if="model === offer.quantity" class="fa-solid fa-check"></i>
      </span>
      <span class="offer__main">
        <span class="offer__qty">{{ productCopy.unit(offer.quantity) }}</span>
        <span v-if="offer.quantity > 1" class="offer__unit">
          {{ productCopy.perUnit(formatCents(offer.unitPrice)) }}
        </span>
        <span v-if="offer.savings > 0" class="offer__save">
          {{ productCopy.youSave(formatCents(offer.savings)) }}
        </span>
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
  @include flex(column, stretch, flex-start, 0.6rem);

  &__legend {
    @include eyebrow;
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }
}

.offer {
  position: relative;
  margin: 0;
  @include flex(row, center, flex-start, 0.85rem);
  padding: 0.9rem 1rem;
  min-height: 4.4rem;
  border: 1px solid $line;
  border-radius: 16px;
  background: $surface;
  color: $ink;
  cursor: pointer;
  transition: transform $dur-fast $ease-out;
  -webkit-tap-highlight-color: transparent;

  &--tagged {
    margin-top: 0.7rem;
  }

  &:active {
    transform: scale(0.985);
  }

  &:has(input:focus-visible) {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  // Elegida: borde de aluminio y una sombra que aparece por opacity.
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow:
      0 0 0 2px rgba($accent, 0.9),
      0 14px 30px -12px rgba($accent-deep, 0.35);
    opacity: 0;
    transition: opacity $dur $ease-out;
    pointer-events: none;
  }

  &--active {
    @include alu-border(16px);
    background:
      linear-gradient(180deg, #fbfcfb, $alu-light) padding-box,
      linear-gradient(160deg, #ffffff, $alu-dark 45%, #ffffff 70%, $alu 100%) border-box;

    &::after {
      opacity: 1;
    }
  }

  &__tab {
    position: absolute;
    top: 0;
    left: 1rem;
    transform: translateY(-62%);
    font-family: $font-mono;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    line-height: 1;
    padding: 0.38rem 0.6rem;
    border-radius: 6px;
    background: $accent-deep;
    color: $surface;
    z-index: 1;
  }

  &__radio {
    flex-shrink: 0;
    @include flex(row, center, center);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px $alu;
    color: $surface;
    font-size: 0.7rem;
    transition: background-color $dur $ease-out;

    i {
      animation: pop 0.45s $ease-spring;
    }
  }

  &--active &__radio {
    background: $accent;
    box-shadow: none;
  }

  &__main {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;
  }

  &__qty {
    font-weight: 700;
    font-size: $text-base;
    line-height: 1.2;
  }

  &__unit {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__save {
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: $cta-deep;
    background: $cta-soft;
    padding: 0.15rem 0.45rem;
    border-radius: $radius-pill;
    margin-top: 0.2rem;
  }

  &__price {
    @include flex(column, flex-end, center, 0.1rem);
    text-align: right;

    strong {
      @include price($text-lg, 800);
    }

    s {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }
}
</style>
