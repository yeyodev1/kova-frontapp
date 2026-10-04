<script setup lang="ts">
import { computed } from 'vue'
import { productCopy } from '@/config/site'
import type { ProductVariant } from '@/types'

const props = defineProps<{ variants: ProductVariant[] }>()
const model = defineModel<string | null>({ required: true })

const selected = computed(() => props.variants.find((v) => v._id === model.value))
</script>

<template>
  <fieldset class="variants">
    <legend class="variants__legend">
      {{ productCopy.variantTitle }}
      <Transition name="fade" mode="out-in">
        <strong v-if="selected" :key="selected._id">{{ selected.name }}</strong>
      </Transition>
    </legend>
    <div class="variants__list">
      <label
        v-for="variant in variants"
        :key="variant._id"
        class="variants__option"
        :class="{
          'variants__option--active': model === variant._id,
          'variants__option--out': variant.stock <= 0,
        }"
      >
        <input
          v-model="model"
          type="radio"
          name="variant"
          :value="variant._id"
          :disabled="variant.stock <= 0"
          class="visually-hidden"
        />
        <i v-if="model === variant._id" class="fa-solid fa-check" aria-hidden="true"></i>
        <span>{{ variant.name }}</span>
        <span v-if="variant.stock <= 0" class="visually-hidden">({{ productCopy.soldOut }})</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.variants {
  border: none;

  &__legend {
    @include eyebrow;
    color: $ink-soft;
    margin-bottom: 0.6rem;

    strong {
      display: inline-block;
      margin-left: 0.4rem;
      color: $ink;
      font-weight: 600;
    }
  }

  &__list {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__option {
    position: relative;
    margin: 0;
    @include flex(row, center, center, 0.45rem);
    min-height: 2.9rem;
    min-width: 2.9rem;
    padding: 0.45rem 1.1rem;
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: inset 0 0 0 1px $line;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    cursor: pointer;
    isolation: isolate;
    transition:
      color $dur $ease-out,
      transform $dur-fast $ease-out;
    -webkit-tap-highlight-color: transparent;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      background: $accent-deep;
      opacity: 0;
      transform: scale(0.7);
      transition:
        opacity $dur $ease-out,
        transform $dur $ease-spring;
    }

    &:active {
      transform: scale(0.95);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    i {
      font-size: 0.7rem;
      animation: pop 0.45s $ease-spring;
    }

    &--active {
      color: $surface;

      &::before {
        opacity: 1;
        transform: none;
      }
    }

    &--out {
      color: $ink-muted;
      text-decoration: line-through;
      cursor: not-allowed;
      background: transparent;
      box-shadow: none;
      border: 1px dashed $alu-dark;
      opacity: 0.6;
    }
  }
}
</style>
