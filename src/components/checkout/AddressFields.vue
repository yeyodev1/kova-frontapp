<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import FormField from './FormField.vue'
import type { CheckoutField, CheckoutForm } from '@/composables/useCheckoutForm'
import type { City, Province } from '@/types'

defineProps<{
  form: CheckoutForm
  errors: Partial<Record<CheckoutField, string>>
  provinces: Province[]
  cities: City[]
  loadingCities: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ blur: [field: CheckoutField] }>()

const f = checkoutCopy.fields
</script>

<template>
  <fieldset class="group" :disabled="disabled">
    <legend class="group__title"><span>2</span> {{ checkoutCopy.addressTitle }}</legend>

    <div class="group__row">
      <FormField id="checkout-provinceId" :label="f.province" :error="errors.provinceId">
        <select
          id="checkout-provinceId"
          v-model.number="form.provinceId"
          autocomplete="address-level1"
          :aria-invalid="!!errors.provinceId"
          @change="emit('blur', 'provinceId')"
        >
          <option :value="0" disabled>{{ f.selectProvince }}</option>
          <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </FormField>
      <FormField id="checkout-cityId" :label="f.city" :error="errors.cityId">
        <select
          id="checkout-cityId"
          v-model.number="form.cityId"
          autocomplete="address-level2"
          :disabled="!form.provinceId || loadingCities"
          :aria-invalid="!!errors.cityId"
          @change="emit('blur', 'cityId')"
        >
          <option :value="0" disabled>{{ loadingCities ? f.loadingCities : f.selectCity }}</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </FormField>
    </div>

    <FormField id="checkout-street" :label="f.street" :error="errors.street">
      <input
        id="checkout-street"
        v-model="form.street"
        type="text"
        autocomplete="street-address"
        enterkeyhint="next"
        :placeholder="f.streetPlaceholder"
        :aria-invalid="!!errors.street"
        @blur="emit('blur', 'street')"
      />
    </FormField>

    <FormField id="checkout-reference" :label="f.reference">
      <input
        id="checkout-reference"
        v-model="form.reference"
        type="text"
        autocomplete="off"
        enterkeyhint="done"
        :placeholder="f.referencePlaceholder"
      />
    </FormField>
  </fieldset>
</template>

<style scoped lang="scss">
.group {
  border: none;
  @include flex(column, stretch, flex-start, 0.9rem);
  min-width: 0;

  &__title {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    margin-bottom: 0.2rem;

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

  &__row {
    @include flex-cards(130px, 0.9rem);
  }
}
</style>
