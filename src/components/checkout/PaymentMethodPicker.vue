<script setup lang="ts">
import { computed } from 'vue'
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import { useStoreSettings } from '@/composables/useStoreSettings'
import CheckoutSection from './CheckoutSection.vue'
import TransferBankChoice from './TransferBankChoice.vue'
import type { PaymentMethod, Quote } from '@/types'

const props = defineProps<{ modelValue: PaymentMethod; quote: Quote | null; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: PaymentMethod] }>()
const bank = defineModel<string>('bank', { default: '' })

const { acceptTransfers, bankAccounts } = useStoreSettings()
// Contra entrega primero: el cliente de anuncios confía más en pagar al recibir.
// Transferencia solo si el panel la tiene encendida (y el quote no dice lo contrario).
const order = computed<PaymentMethod[]>(() =>
  (['cod', 'card', 'transfer'] as PaymentMethod[]).filter(
    (method) => method !== 'transfer' || (acceptTransfers.value && props.quote?.available?.transfer !== false),
  ),
)
const m = checkoutCopy.methods
</script>

<template>
  <CheckoutSection :step="3" :title="checkoutCopy.paymentTitle" :note="checkoutCopy.paymentNote" :disabled="disabled">
    <div class="pm" role="radiogroup" :aria-label="checkoutCopy.paymentTitle">
      <label
        v-for="method in order"
        :key="method"
        class="pm__option"
        :class="[`pm__option--${method}`, { 'pm__option--active': modelValue === method }]"
      >
        <span v-if="method === 'cod'" class="pm__tab">{{ m.cod.badge }}</span>
        <input
          type="radio"
          name="payment-method"
          class="visually-hidden"
          :value="method"
          :checked="modelValue === method"
          @change="emit('update:modelValue', method)"
        />
        <span class="pm__radio" aria-hidden="true">
          <i v-if="modelValue === method" class="fa-solid fa-check"></i>
        </span>
        <span class="pm__text">
          <span class="pm__title">{{ m[method].title }}</span>
          <span class="pm__desc">{{ m[method].text }}</span>
          <span class="pm__logos" aria-hidden="true">
            <i v-for="logo in m[method].logos" :key="logo" :class="logo"></i>
          </span>
        </span>
        <span class="pm__price">
          <Transition name="pm-fade" mode="out-in">
            <span v-if="!quote" key="wait" class="pm__skeleton skeleton"></span>
            <span v-else-if="quote.surcharges[method]" key="extra" class="pm__extra">
              <strong>{{ checkoutCopy.surchargeLabel(formatCents(quote.surcharges[method])) }}</strong>
              <small>{{ checkoutCopy.surchargeHint }}</small>
            </span>
            <span v-else key="none" class="pm__none">{{ checkoutCopy.noSurcharge }}</span>
          </Transition>
        </span>
      </label>
      <TransferBankChoice v-if="modelValue === 'transfer' && bankAccounts.length > 1" v-model="bank" :accounts="bankAccounts" />
    </div>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.pm {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__option {
    position: relative;
    margin: 0;
    @include flex(row, center, flex-start, 0.85rem);
    min-height: 5rem;
    padding: 1rem 0.95rem;
    border: 1px solid $line;
    border-radius: 16px;
    background: $surface;
    color: $ink;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform $dur-fast $ease-out,
      box-shadow $dur $ease-out;

    &:active {
      transform: scale(0.985);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 3px;
    }

    &--cod {
      margin-top: 0.85rem;
    }

    &--active {
      @include alu-border(16px);
      background:
        linear-gradient(180deg, $surface, $alu-light) padding-box,
        linear-gradient(160deg, #ffffff, $alu-dark 45%, #ffffff 70%, $alu 100%) border-box;
      box-shadow:
        0 0 0 2px rgba($accent, 0.5),
        $shadow-md;
    }
  }

  // Pestaña que asoma sobre la tarjeta: el beneficio se ve antes de leer.
  &__tab {
    position: absolute;
    top: -0.8rem;
    left: 0.9rem;
    padding: 0.2rem 0.6rem;
    border-radius: 8px 8px 8px 2px;
    background: $accent-deep;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__radio {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 2px solid $alu-dark;
    background: $surface;
    color: $surface;
    font-size: 0.7rem;
    transition:
      background-color $dur-fast ease,
      border-color $dur-fast ease;

    i {
      animation: pop 0.38s $ease-spring;
    }
  }

  &__option--active &__radio {
    background: $accent;
    border-color: $accent;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 700;
    font-size: $text-base;
    line-height: 1.25;
  }

  &__desc {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.35;
  }

  &__logos {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    margin-top: 0.35rem;
    font-size: 1.35rem;
    color: $ink-muted;
    line-height: 1;
  }

  &__option--active &__logos {
    color: $accent-deep;
  }

  &__chip {
    font-style: normal;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.55rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
  }

  &__price {
    @include flex(column, flex-end, center);
    flex-shrink: 0;
    min-width: 4.5rem;
    text-align: right;
  }

  &__extra {
    @include flex(column, flex-end, flex-start);

    strong {
      @include price($text-lg, 800);
      color: $ink;
      line-height: 1.1;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__none {
    font-size: $text-xs;
    font-weight: 700;
    color: darken($success, 6%);
    padding: 0.3rem 0.55rem;
    border-radius: $radius-pill;
    background: $success-bg;
    white-space: nowrap;
  }

  &__skeleton {
    width: 3.5rem;
    height: 1.2rem;
  }
}

.pm-fade-enter-active,
.pm-fade-leave-active {
  transition:
    opacity $dur-fast ease,
    transform $dur-fast $ease-out;
}
.pm-fade-enter-from,
.pm-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
