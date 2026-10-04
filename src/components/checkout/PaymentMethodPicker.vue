<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { PaymentMethod, Quote } from '@/types'

defineProps<{ modelValue: PaymentMethod; quote: Quote | null; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: PaymentMethod] }>()

const order: PaymentMethod[] = ['card', 'cod', 'transfer']
</script>

<template>
  <fieldset class="pm" :disabled="disabled">
    <legend class="pm__title"><span>3</span> {{ checkoutCopy.paymentTitle }}</legend>

    <label
      v-for="method in order"
      :key="method"
      class="pm__option"
      :class="{ 'pm__option--active': modelValue === method }"
    >
      <input
        type="radio"
        name="payment-method"
        class="visually-hidden"
        :value="method"
        :checked="modelValue === method"
        @change="emit('update:modelValue', method)"
      />
      <span class="pm__radio" aria-hidden="true"></span>
      <i :class="checkoutCopy.methods[method].icon" class="pm__icon" aria-hidden="true"></i>
      <span class="pm__text">
        <strong>
          {{ checkoutCopy.methods[method].title }}
          <em v-if="checkoutCopy.methods[method].badge" :class="`pm__badge pm__badge--${method}`">
            {{ checkoutCopy.methods[method].badge }}
          </em>
        </strong>
        <small>{{ checkoutCopy.methods[method].text }}</small>
        <small v-if="quote" class="pm__surcharge" :class="{ 'pm__surcharge--none': !quote.surcharges[method] }">
          {{ quote.surcharges[method] ? checkoutCopy.surchargeLabel(formatCents(quote.surcharges[method])) : checkoutCopy.noSurcharge }}
        </small>
      </span>
    </label>
  </fieldset>
</template>

<style scoped lang="scss">
.pm {
  border: none;
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;

  &__title {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    margin-bottom: 0.8rem;

    span {
      @include flex(row, center, center);
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: $accent;
      color: $surface;
      font-size: $text-sm;
    }
  }

  &__option {
    margin: 0;
    @include flex(row, center, flex-start, 0.8rem);
    padding: 1rem;
    min-height: 4.25rem;
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

    &--active {
      border-color: $accent;
      background: $accent-soft;
      box-shadow: 0 0 0 1px $accent;
    }
  }

  &__radio {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    border: 2px solid $silver;
    @include transition;
  }

  &__option--active &__radio {
    border-color: $accent;
    border-width: 6px;
  }

  &__icon {
    font-size: 1.3rem;
    color: $accent;
    width: 1.6rem;
    text-align: center;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;

    strong {
      @include flex(row, center, flex-start, 0.4rem);
      flex-wrap: wrap;
      font-size: $text-base;
    }

    small {
      font-size: $text-xs;
      color: $ink-soft;
      line-height: 1.4;
    }
  }

  &__badge {
    font-style: normal;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.1rem 0.5rem;
    border-radius: $radius-pill;
    background: $success-bg;
    color: darken($success, 8%);

    &--cod {
      background: $cta-soft;
      color: $cta-deep;
    }
  }

  &__surcharge {
    font-weight: 700;
    color: $cta-deep !important;

    &--none {
      color: $success !important;
    }
  }
}
</style>
