<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { checkoutCopy, orderCopy, orderStatusLabel, whatsappLink } from '@/config/site'
import { useOrder } from '@/composables/useOrder'
import { isValidPhone, normalizePhone } from '@/composables/useCheckoutForm'
import FormField from '@/components/checkout/FormField.vue'
import OrderTimeline from '@/components/order/OrderTimeline.vue'
import OrderItemsCard from '@/components/order/OrderItemsCard.vue'
import ShippingInfo from '@/components/order/ShippingInfo.vue'

const route = useRoute()
const { order, loading, error, fetch } = useOrder()
const form = reactive({ number: String(route.query.numero || ''), phone: String(route.query.phone || '') })
const errors = reactive({ number: '', phone: '' })

function check(field: 'number' | 'phone') {
  if (field === 'number') errors.number = form.number.trim() ? '' : orderCopy.trackNumberError
  else errors.phone = !form.phone.trim() ? checkoutCopy.errors.phoneRequired : isValidPhone(form.phone) ? '' : checkoutCopy.errors.phone
}

function submit() {
  if (loading.value) return
  check('number')
  check('phone')
  if (errors.number || errors.phone) return
  fetch(form.number, normalizePhone(form.phone))
}

if (form.number && form.phone) submit()
</script>

<template>
  <div class="track">
    <header class="track__head">
      <span class="track__icon" aria-hidden="true"><i class="fa-solid fa-location-dot"></i></span>
      <h1 class="track__title">{{ orderCopy.trackTitle }}</h1>
      <p class="track__text">{{ orderCopy.trackText }}</p>
    </header>

    <form class="track__form" novalidate @submit.prevent="submit">
      <FormField id="track-number" :label="orderCopy.trackNumber" :error="errors.number">
        <input
          id="track-number"
          v-model="form.number"
          type="text"
          autocapitalize="characters"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="next"
          :placeholder="orderCopy.trackNumberPlaceholder"
          @blur="errors.number && check('number')"
        />
      </FormField>
      <FormField id="track-phone" :label="orderCopy.trackPhone" :error="errors.phone">
        <input
          id="track-phone"
          v-model="form.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          enterkeyhint="search"
          :placeholder="checkoutCopy.fields.phonePlaceholder"
          @blur="errors.phone && check('phone')"
        />
      </FormField>
      <button type="submit" class="btn btn--dark btn--lg btn--block" :aria-busy="loading">
        <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'" aria-hidden="true"></i>
        {{ loading ? orderCopy.trackLoading : orderCopy.trackCta }}
      </button>
    </form>

    <Transition name="rise" mode="out-in">
      <div v-if="error" key="error" class="track__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        <div>
          <p>{{ orderCopy.notFound }}</p>
          <a :href="whatsappLink()" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ orderCopy.trackHelp }}
          </a>
        </div>
      </div>

      <section v-else-if="order" :key="order.number" class="track__result" aria-live="polite">
        <div class="track__card">
          <div class="track__top">
            <span class="track__number">{{ order.number }}</span>
            <span class="track__status">{{ orderStatusLabel[order.status] }}</span>
          </div>
          <p class="track__label">{{ orderCopy.trackStatus }}</p>
          <OrderTimeline :status="order.status" />
          <hr class="track__rule" />
          <ShippingInfo :carrier="order.dropi?.carrier || ''" :guide="order.dropi?.guide || ''" />
        </div>
        <OrderItemsCard :order="order" />
      </section>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.track {
  @include container(580px);
  @include flex(column, stretch, flex-start, 1.25rem);
  padding-block: 2.5rem $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__icon {
    @include plinth(14px);
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    margin-bottom: 0.5rem;
    color: $accent-deep;
    font-size: 1.15rem;
  }

  &__title {
    @include display($display-sm, 800, 118%);
  }

  &__text {
    color: $ink-soft;
  }

  &__form,
  &__card {
    @include alu-border(20px);
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.25rem 1.1rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: 1.5rem;
    }
  }

  &__error {
    @include flex(row, baseline, flex-start, 0.6rem);
    padding: 1rem;
    border-radius: 14px;
    background: $danger-bg;
    color: $ink;
    font-size: $text-sm;

    > i {
      color: $danger;
    }

    a {
      @include flex(row, center, flex-start, 0.4rem);
      margin-top: 0.4rem;
      font-weight: 700;
      color: $accent-deep;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__result {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__top {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__number {
    font-family: $font-mono;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  &__status {
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
    font-size: $text-xs;
    font-weight: 700;
  }

  &__label {
    @include eyebrow;
    margin-top: 0.25rem;
  }

  &__rule {
    border: none;
    border-top: 1px dashed $alu;
  }
}
</style>
