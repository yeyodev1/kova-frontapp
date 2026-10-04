<script setup lang="ts">
import {
  productCopy,
  whatsappLink,
  trustSeals,
  checkoutCopy,
  paymentMethodLabel,
} from '@/config/site'
import PriceRoll from './PriceRoll.vue'
import type { PaymentMethod } from '@/types'

defineProps<{ total: number; inStock: boolean; title: string }>()
const emit = defineEmits<{ buy: []; add: [] }>()

const methods: PaymentMethod[] = ['card', 'transfer', 'cod']
</script>

<template>
  <div class="actions">
    <button
      class="btn btn--cta btn--lg btn--block actions__buy"
      :disabled="!inStock"
      @click="emit('buy')"
    >
      <template v-if="inStock">
        <span>{{ productCopy.buyNow }}</span>
        <span class="actions__sep" aria-hidden="true"></span>
        <PriceRoll :cents="total" class="actions__total" />
      </template>
      <span v-else>{{ productCopy.soldOut }}</span>
    </button>
    <button
      class="btn btn--outline btn--lg btn--block actions__add"
      :disabled="!inStock"
      @click="emit('add')"
    >
      <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> {{ productCopy.addToCart }}
    </button>

    <ul class="actions__seals">
      <li v-for="seal in trustSeals" :key="seal.label">
        <i :class="seal.icon" aria-hidden="true"></i>
        <span>{{ seal.label }}</span>
      </li>
    </ul>

    <div class="actions__pay">
      <span class="actions__pay-label">{{ productCopy.paymentsTitle }}</span>
      <span v-for="m in methods" :key="m" class="actions__chip">
        <i :class="checkoutCopy.methods[m].icon" aria-hidden="true"></i>
        {{ paymentMethodLabel[m] }}
      </span>
    </div>

    <a
      :href="whatsappLink(productCopy.whatsappMessage(title))"
      class="actions__wa"
      target="_blank"
      rel="noopener"
    >
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ productCopy.needHelp }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.actions {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__buy {
    min-height: 3.85rem;
    font-size: 1.06rem;
    gap: 0.7rem;
  }

  &__sep {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(#fff, 0.7);
  }

  &__total {
    @include price(1.15rem, 800);
  }

  &__add {
    border-color: rgba($ink, 0.85);
  }

  &__seals {
    list-style: none;
    @include flex(row, center, space-between, 0.4rem);
    padding: 0.7rem 0.2rem 0.3rem;
    border-bottom: 1px dashed $line;

    li {
      @include flex(column, center, flex-start, 0.3rem);
      flex: 1;
      text-align: center;
      font-size: 0.72rem;
      font-weight: 600;
      line-height: 1.25;
      color: $ink-soft;
      padding-bottom: 0.7rem;
    }

    i {
      color: $accent;
      font-size: 1rem;
    }
  }

  &__pay {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    padding-top: 0.2rem;
  }

  &__pay-label {
    @include eyebrow;
    color: $ink-muted;
    margin-right: 0.2rem;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.35rem);
    font-size: 0.74rem;
    font-weight: 600;
    color: $ink-soft;
    padding: 0.3rem 0.6rem;
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: inset 0 0 0 1px $line;

    i {
      color: $accent;
      font-size: 0.75rem;
    }
  }

  &__wa {
    align-self: center;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    padding: 0.6rem;
    text-decoration: underline;
    text-decoration-color: rgba($accent, 0.4);
    text-underline-offset: 4px;

    i {
      color: #1f9d55;
    }
  }
}
</style>
