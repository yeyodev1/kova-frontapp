<script setup lang="ts">
import { ref } from 'vue'
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { Quote } from '@/types'

defineProps<{ quote: Quote | null; loading: boolean }>()

const open = ref(false)
</script>

<template>
  <section class="sum" :class="{ 'sum--open': open }">
    <button class="sum__toggle" type="button" :aria-expanded="open" aria-controls="order-summary" @click="open = !open">
      <span>
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        {{ open ? checkoutCopy.hideSummary : checkoutCopy.showSummary }}
        <i class="fa-solid fa-chevron-down sum__chevron" aria-hidden="true"></i>
      </span>
      <strong>{{ quote ? formatCents(quote.total) : '...' }}</strong>
    </button>

    <div id="order-summary" class="sum__body" :class="{ 'sum__body--loading': loading }">
      <h2 class="sum__title">{{ checkoutCopy.summary }}</h2>
      <ul v-if="quote" class="sum__items">
        <li v-for="item in quote.items" :key="`${item.product}-${item.variantId}`" class="sum__item">
          <span class="sum__media">
            <img v-if="item.image" :src="item.image" :alt="item.title" width="56" height="56" />
            <span class="sum__qty">{{ item.quantity }}</span>
          </span>
          <span class="sum__name">
            {{ item.title }}
            <small v-if="item.variantName">{{ item.variantName }}</small>
          </span>
          <strong>{{ formatCents(item.total) }}</strong>
        </li>
      </ul>
      <div v-else class="sum__placeholder skeleton"></div>

      <dl v-if="quote" class="sum__totals">
        <div>
          <dt>{{ checkoutCopy.subtotal }}</dt>
          <dd>{{ formatCents(quote.subtotal) }}</dd>
        </div>
        <div>
          <dt>{{ checkoutCopy.shipping }}</dt>
          <dd :class="{ 'sum__free': !quote.shippingFee }">
            {{ quote.shippingFee ? formatCents(quote.shippingFee) : checkoutCopy.freeShipping }}
          </dd>
        </div>
        <div v-if="quote.surcharge">
          <dt>{{ checkoutCopy.surcharge }}</dt>
          <dd>{{ formatCents(quote.surcharge) }}</dd>
        </div>
        <div class="sum__grand">
          <dt>{{ checkoutCopy.total }}</dt>
          <dd>{{ formatCents(quote.total) }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sum {
  @include card;
  overflow: hidden;

  &__toggle {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    min-height: 3.25rem;
    padding: 0.75rem 1rem;
    background: $sand;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    span {
      @include flex(row, center, flex-start, 0.45rem);
    }

    strong {
      font-family: $font-display;
      font-size: $text-lg;
      color: $ink;
    }

    @include from('md') {
      display: none;
    }
  }

  &__chevron {
    @include transition(transform);
  }

  &--open &__chevron {
    transform: rotate(180deg);
  }

  // Colapsado en móvil (el total ya se ve en el botón); siempre abierto en escritorio.
  &__body {
    display: none;
    padding: 1rem;
    @include transition(opacity);

    &--loading {
      opacity: 0.55;
    }

    @include from('md') {
      display: block;
      padding: 1.25rem;
    }
  }

  &--open &__body {
    display: block;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
    margin-bottom: 0.8rem;
    display: none;

    @include from('md') {
      display: block;
    }
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    font-size: $text-sm;

    strong {
      white-space: nowrap;
    }
  }

  &__media {
    position: relative;
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: $radius-sm;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $radius-sm;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    min-width: 1.3rem;
    height: 1.3rem;
    border-radius: $radius-pill;
    background: $ink-soft;
    color: $surface;
    font-size: 0.7rem;
    font-weight: 700;
    text-align: center;
    line-height: 1.3rem;
  }

  &__name {
    flex: 1;
    min-width: 0;
    line-height: 1.35;

    small {
      display: block;
      color: $ink-muted;
    }
  }

  &__placeholder {
    height: 3.5rem;
  }

  &__totals {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid $line;
    @include flex(column, stretch, flex-start, 0.45rem);
    font-size: $text-sm;

    div {
      @include flex(row, center, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }
  }

  &__free {
    color: $success;
    font-weight: 600;
  }

  &__grand {
    margin-top: 0.35rem;
    padding-top: 0.6rem;
    border-top: 1px solid $line;
    font-size: $text-lg;

    dt {
      color: $ink !important;
      font-weight: 600;
    }

    dd {
      font-family: $font-display;
      font-weight: 700;
    }
  }
}
</style>
