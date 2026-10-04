<script setup lang="ts">
import {
  productCopy,
  whatsappLink,
  trustSeals,
  checkoutCopy,
  paymentMethodLabel,
} from '@/config/site'
import { computed } from 'vue'
import PriceRoll from './PriceRoll.vue'
import type { PaymentMethod } from '@/types'
import { useStoreSettings } from '@/composables/useStoreSettings'
import { formatCents } from '@/utils/format'

const props = defineProps<{ total: number; inStock: boolean; title: string }>()
const emit = defineEmits<{ buy: []; add: [] }>()

const methods: PaymentMethod[] = ['card', 'transfer', 'cod']
const { settings } = useStoreSettings()

// Precio final por forma de pago: la tarjeta queda como la opción que más conviene,
// con lo que se ahorra frente a contra entrega bien visible.
function surcharge(m: PaymentMethod): number {
  if (m === 'cod') return settings.value?.codSurcharge ?? 0
  if (m === 'transfer') return settings.value?.transferSurcharge ?? 0
  return 0
}
const savings = computed(() => Math.max(surcharge('cod'), surcharge('transfer')))
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
      <ul class="actions__prices">
        <li v-for="m in methods" :key="m" class="actions__price" :class="{ 'actions__price--best': m === 'card' }">
          <i :class="checkoutCopy.methods[m].icon" aria-hidden="true"></i>
          <span class="actions__price-name">{{ paymentMethodLabel[m] }}</span>
          <span v-if="m === 'card' && savings" class="actions__best">{{ productCopy.cardBest }}</span>
          <strong>{{ formatCents(props.total + surcharge(m)) }}</strong>
        </li>
      </ul>
      <p v-if="savings" class="actions__save">
        <i class="fa-solid fa-tag" aria-hidden="true"></i> {{ productCopy.cardSaves(formatCents(savings)) }}
      </p>
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
.actions__prices {
  list-style: none;
  width: 100%;
  @include flex(column, stretch, flex-start, 0.4rem);
}

.actions__price {
  @include flex(row, center, flex-start, 0.55rem);
  padding: 0.6rem 0.8rem;
  border: 1px solid $line;
  border-radius: 12px;
  background: $surface;
  font-size: $text-sm;
  color: $ink-soft;

  i {
    width: 1.1rem;
    color: $ink-muted;
  }

  strong {
    margin-left: auto;
    @include price($text-base, 700);
    color: $ink-soft;
  }

  &--best {
    border-color: $success;
    background: $success-bg;
    color: $ink;

    i,
    strong {
      color: $success;
    }

    strong {
      font-weight: 800;
    }
  }
}

.actions__price-name {
  font-weight: 600;
}

.actions__best {
  font-family: $font-mono;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $surface;
  background: $success;
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
}

.actions__save {
  font-size: $text-sm;
  font-weight: 600;
  color: $success;
}
</style>
