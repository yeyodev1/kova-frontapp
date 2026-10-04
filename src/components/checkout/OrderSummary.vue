<script setup lang="ts">
import { computed, ref } from 'vue'
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import PriceTicker from './PriceTicker.vue'
import SummaryItems from './SummaryItems.vue'
import type { Quote } from '@/types'

const props = defineProps<{ quote: Quote | null; loading: boolean }>()

const open = ref(false)
const count = computed(() => props.quote?.items.reduce((sum, item) => sum + item.quantity, 0) || 0)

// Altura animada del panel en móvil. Es la única propiedad de layout que se
// anima en el checkout: un bloque pequeño, una vez, a pedido del usuario.
function setHeight(el: Element, value: string) {
  const node = el as HTMLElement
  node.style.height = value
}
function onEnter(el: Element) {
  setHeight(el, '0px')
  void (el as HTMLElement).offsetHeight
  setHeight(el, `${el.scrollHeight}px`)
}
function onLeave(el: Element) {
  setHeight(el, `${el.scrollHeight}px`)
  void (el as HTMLElement).offsetHeight
  setHeight(el, '0px')
}
function onAfter(el: Element) {
  setHeight(el, '')
}
</script>

<template>
  <section class="sum" :class="{ 'sum--open': open }" :aria-label="checkoutCopy.summary">
    <button class="sum__toggle" type="button" :aria-expanded="open" aria-controls="order-summary" @click="open = !open">
      <span class="sum__toggle-label">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        {{ open ? checkoutCopy.hideSummary : checkoutCopy.showSummary }}
        <i class="fa-solid fa-chevron-down sum__chevron" aria-hidden="true"></i>
      </span>
      <strong class="sum__toggle-total"><PriceTicker :cents="quote?.total" placeholder="..." /></strong>
    </button>

    <Transition name="sum-collapse" @enter="onEnter" @after-enter="onAfter" @leave="onLeave" @after-leave="onAfter">
      <div v-show="open" id="order-summary" class="sum__collapse">
        <div class="sum__body" :class="{ 'sum__body--loading': loading }">
          <header class="sum__head">
            <h2 class="sum__title">{{ checkoutCopy.summary }}</h2>
            <span v-if="count" class="sum__count">{{ checkoutCopy.itemsCount(count) }}</span>
          </header>

          <SummaryItems :items="quote?.items || null" />

          <dl v-if="quote" class="sum__totals">
            <div>
              <dt>{{ checkoutCopy.subtotal }}</dt>
              <dd>{{ formatCents(quote.subtotal) }}</dd>
            </div>
            <div>
              <dt>{{ checkoutCopy.shipping }}</dt>
              <dd :class="{ sum__free: !quote.shippingFee }">
                {{ quote.shippingFee ? formatCents(quote.shippingFee) : checkoutCopy.freeShipping }}
              </dd>
            </div>
            <Transition name="sum-row">
              <div v-if="quote.surcharge">
                <dt>{{ checkoutCopy.surcharge }}</dt>
                <dd><PriceTicker :cents="quote.surcharge" /></dd>
              </div>
            </Transition>
            <div class="sum__grand">
              <dt>{{ checkoutCopy.total }}</dt>
              <dd><PriceTicker :cents="quote.total" /></dd>
            </div>
          </dl>
          <p class="sum__note"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> {{ checkoutCopy.totalNote }}</p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.sum {
  @include alu-border(18px);
  box-shadow: $shadow-sm;
  overflow: hidden;

  @include from('lg') {
    box-shadow: $shadow-md;
  }

  &__toggle {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    min-height: 3.5rem;
    padding: 0.75rem 1rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    @include from('lg') {
      display: none;
    }
  }

  &__toggle-label {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__toggle-total {
    @include price($text-lg, 800);
    color: $ink;
  }

  &__chevron {
    font-size: 0.75rem;
    transition: transform $dur $ease-out;
  }

  &--open &__chevron {
    transform: rotate(180deg);
  }

  &__collapse {
    overflow: hidden;
    transition: height 0.38s $ease-out;

    // En escritorio el resumen siempre está a la vista.
    @include from('lg') {
      display: block !important;
      height: auto !important;
    }
  }

  &__body {
    padding: 0.25rem 1rem 1.1rem;
    border-top: 1px solid $line;
    transition:
      opacity $dur $ease-out,
      transform $dur $ease-out;

    &--loading {
      opacity: 0.6;
    }

    @include from('lg') {
      padding: 1.4rem 1.4rem 1.3rem;
      border-top: none;
    }
  }

  &__head {
    display: none;

    @include from('lg') {
      @include flex(row, baseline, space-between, 1rem);
      margin-bottom: 1.1rem;
    }
  }

  &__title {
    @include display($text-xl, 760, 112%);
  }

  &__count {
    @include eyebrow;
    color: $ink-muted;
  }

  &__totals {
    margin-top: 1.1rem;
    padding-top: 1rem;
    border-top: 1px dashed $alu;
    @include flex(column, stretch, flex-start, 0.5rem);
    font-size: $text-sm;

    > div {
      @include flex(row, center, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }

    dd {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
  }

  &__free {
    color: darken($success, 4%);
  }

  &__grand {
    margin-top: 0.4rem;
    padding-top: 0.75rem;
    border-top: 1px solid $line;

    dt {
      color: $ink !important;
      font-weight: 700;
      font-size: $text-base;
    }

    dd {
      @include price($text-xl, 850);
    }
  }

  &__note {
    @include flex(row, center, flex-start, 0.45rem);
    margin-top: 0.9rem;
    font-size: $text-xs;
    color: $ink-muted;

    i {
      color: $accent;
    }
  }
}

.sum-collapse-enter-from .sum__body,
.sum-collapse-leave-to .sum__body {
  opacity: 0;
  transform: translateY(-6px);
}

.sum-row-enter-active,
.sum-row-leave-active {
  transition:
    opacity $dur ease,
    transform $dur $ease-out;
}
.sum-row-enter-from,
.sum-row-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>
