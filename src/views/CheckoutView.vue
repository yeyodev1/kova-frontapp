<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutHeader from '@/components/checkout/CheckoutHeader.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import CustomerFields from '@/components/checkout/CustomerFields.vue'
import AddressFields from '@/components/checkout/AddressFields.vue'
import PaymentMethodPicker from '@/components/checkout/PaymentMethodPicker.vue'
import PayphonePanel from '@/components/checkout/PayphonePanel.vue'
import CheckoutSubmit from '@/components/checkout/CheckoutSubmit.vue'
import EmptyState from '@/components/store/EmptyState.vue'

const {
  cart,
  form,
  errors,
  validateField,
  liveValidate,
  isValid,
  stepsDone,
  currentStep,
  provinces,
  cities,
  loadingCities,
  method,
  selectMethod,
  quote,
  quoting,
  total,
  processing,
  payphone,
  pendingOrder,
  submit,
  cancelCard,
} = useCheckout()
</script>

<template>
  <div class="checkout">
    <CheckoutHeader :done="stepsDone" :current="currentStep" />

    <div v-if="cart.isEmpty && !payphone" class="checkout__empty">
      <EmptyState icon="fa-solid fa-cart-shopping" :title="checkoutCopy.emptyTitle" :text="checkoutCopy.emptyText">
        <RouterLink to="/tienda" class="btn btn--primary btn--lg">
          {{ checkoutCopy.emptyCta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </EmptyState>
    </div>

    <div v-else class="checkout__layout">
      <aside class="checkout__aside">
        <OrderSummary :quote="quote" :loading="quoting" />
      </aside>

      <form class="checkout__form" novalidate @submit.prevent="submit">
        <CustomerFields
          :form="form"
          :errors="errors"
          :is-valid="isValid"
          :done="stepsDone[0]"
          :disabled="!!payphone"
          @blur="validateField"
          @input="liveValidate"
        />
        <AddressFields
          :form="form"
          :errors="errors"
          :is-valid="isValid"
          :provinces="provinces"
          :cities="cities"
          :loading-cities="loadingCities"
          :done="stepsDone[1]"
          :disabled="!!payphone"
          @blur="validateField"
          @input="liveValidate"
        />
        <PaymentMethodPicker
          :model-value="method"
          :quote="quote"
          :disabled="!!payphone || processing"
          @update:model-value="selectMethod"
        />

        <PayphonePanel
          v-if="payphone && pendingOrder"
          :config="payphone"
          :order-number="pendingOrder.number"
          @cancel="cancelCard"
        />
        <CheckoutSubmit v-else :total="total" :processing="processing" :disabled="!quote" />
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  flex: 1;
  background:
    radial-gradient(80% 40% at 100% 0%, rgba($sage, 0.18), transparent 70%),
    $paper;

  &__empty {
    @include container(640px);
    padding-block: $space-lg;
  }

  &__layout {
    @include container(1160px);
    @include flex(column, stretch, flex-start, 1rem);
    // Espacio para la barra fija de confirmar en móvil.
    padding-block: 1rem 8rem;

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 2.5rem;
      padding-block: 2.25rem $space-xl;
    }
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 380px;
      position: sticky;
      top: 1.5rem;
    }
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1;
    min-width: 0;

    @include from('lg') {
      gap: 1.25rem;
    }
  }
}
</style>
