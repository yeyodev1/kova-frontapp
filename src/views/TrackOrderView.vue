<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { checkoutCopy, orderCopy, whatsappLink } from '@/config/site'
import { useOrder } from '@/composables/useOrder'
import { isValidPhone, normalizePhone } from '@/composables/useCheckoutForm'
import FormField from '@/components/checkout/FormField.vue'
import OrderTimeline from '@/components/order/OrderTimeline.vue'
import OrderItemsCard from '@/components/order/OrderItemsCard.vue'

const route = useRoute()
const { order, loading, error, fetch } = useOrder()
const form = reactive({ number: String(route.query.numero || ''), phone: String(route.query.phone || '') })
const errors = reactive({ number: '', phone: '' })

function submit() {
  errors.number = form.number.trim() ? '' : checkoutCopy.errors.required
  errors.phone = isValidPhone(form.phone) ? '' : checkoutCopy.errors.phone
  if (errors.number || errors.phone) return
  fetch(form.number, normalizePhone(form.phone))
}

if (form.number && form.phone) submit()
</script>

<template>
  <div class="track">
    <header class="track__head">
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
          :placeholder="orderCopy.trackNumberPlaceholder"
        />
      </FormField>
      <FormField id="track-phone" :label="orderCopy.trackPhone" :error="errors.phone">
        <input
          id="track-phone"
          v-model="form.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          :placeholder="checkoutCopy.fields.phonePlaceholder"
        />
      </FormField>
      <button type="submit" class="btn btn--primary btn--lg btn--block" :disabled="loading">
        <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'" aria-hidden="true"></i>
        {{ orderCopy.trackCta }}
      </button>
    </form>

    <p v-if="error" class="track__error" role="alert">
      {{ orderCopy.notFound }}
      <a :href="whatsappLink()" target="_blank" rel="noopener">WhatsApp</a>
    </p>

    <section v-if="order" class="track__result">
      <h2 class="track__number">{{ order.number }}</h2>
      <OrderTimeline :status="order.status" />
      <dl v-if="order.dropi?.guide || order.dropi?.carrier" class="track__ship">
        <div v-if="order.dropi.carrier">
          <dt>{{ orderCopy.carrier }}</dt>
          <dd>{{ order.dropi.carrier }}</dd>
        </div>
        <div v-if="order.dropi.guide">
          <dt>{{ orderCopy.guide }}</dt>
          <dd>{{ order.dropi.guide }}</dd>
        </div>
      </dl>
      <OrderItemsCard :order="order" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.track {
  @include container(560px);
  @include flex(column, stretch, flex-start, 1.5rem);
  padding-block: 2rem $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.3rem);
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__text {
    color: $ink-soft;
  }

  &__form {
    @include card;
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: 1.1rem;
  }

  &__error {
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;

    a {
      font-weight: 700;
      text-decoration: underline;
    }
  }

  &__result {
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__number {
    @include display($text-xl, 700);
  }

  &__ship {
    @include card;
    @include flex(column, stretch, flex-start, 0.4rem);
    padding: 1rem;
    font-size: $text-sm;

    div {
      @include flex(row, center, space-between, 1rem);
    }

    dt {
      color: $ink-soft;
    }

    dd {
      font-weight: 600;
      text-align: right;
      overflow-wrap: anywhere;
    }
  }
}
</style>
