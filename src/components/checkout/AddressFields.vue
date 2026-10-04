<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import FormField from './FormField.vue'
import CheckoutSection from './CheckoutSection.vue'
import type { CheckoutField, CheckoutForm } from '@/composables/useCheckoutForm'
import type { City, Province } from '@/types'

defineProps<{
  form: CheckoutForm
  errors: Partial<Record<CheckoutField, string>>
  isValid: (field: CheckoutField) => boolean
  provinces: Province[]
  cities: City[]
  loadingCities: boolean
  done?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ blur: [field: CheckoutField]; input: [field: CheckoutField] }>()

const f = checkoutCopy.fields
</script>

<template>
  <CheckoutSection :step="2" :title="checkoutCopy.addressTitle" :note="checkoutCopy.addressNote" :done="done" :disabled="disabled">
    <div class="af__row">
      <FormField id="checkout-provinceId" :label="f.province" :error="errors.provinceId" :valid="isValid('provinceId')" select>
        <select
          id="checkout-provinceId"
          v-model.number="form.provinceId"
          autocomplete="address-level1"
          :class="{ 'af__empty': !form.provinceId }"
          @change="emit('blur', 'provinceId')"
        >
          <option :value="0" disabled>{{ provinces.length ? f.selectProvince : f.loadingProvinces }}</option>
          <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </FormField>
      <FormField id="checkout-cityId" :label="f.city" :error="errors.cityId" :valid="isValid('cityId')" select>
        <select
          id="checkout-cityId"
          v-model.number="form.cityId"
          autocomplete="address-level2"
          :class="{ 'af__empty': !form.cityId }"
          :disabled="!form.provinceId || loadingCities"
          @change="emit('blur', 'cityId')"
        >
          <option :value="0" disabled>{{ loadingCities ? f.loadingCities : f.selectCity }}</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </FormField>
    </div>

    <FormField id="checkout-street" :label="f.street" :error="errors.street" :valid="isValid('street')">
      <input
        id="checkout-street"
        v-model="form.street"
        type="text"
        name="street-address"
        autocomplete="street-address"
        enterkeyhint="next"
        :placeholder="f.streetPlaceholder"
        @input="emit('input', 'street')"
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
  </CheckoutSection>
</template>

<style scoped lang="scss">
.af__row {
  @include flex-cards(220px, 1rem);
}

// El placeholder de un select es una opción más: lo pintamos como placeholder.
.af__empty {
  color: $ink-muted;
}
</style>
