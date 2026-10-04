<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import FormField from './FormField.vue'
import CheckoutSection from './CheckoutSection.vue'
import type { CheckoutField, CheckoutForm } from '@/composables/useCheckoutForm'

// El formulario es el reactive de useCheckoutForm: se edita en sitio.
defineProps<{
  form: CheckoutForm
  errors: Partial<Record<CheckoutField, string>>
  isValid: (field: CheckoutField) => boolean
  done?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ blur: [field: CheckoutField]; input: [field: CheckoutField] }>()

const f = checkoutCopy.fields
</script>

<template>
  <CheckoutSection :step="1" :title="checkoutCopy.contactTitle" :note="checkoutCopy.noAccount" :done="done" :disabled="disabled">
    <div class="cf__row cf__row--pair">
      <FormField id="checkout-firstName" :label="f.firstName" :error="errors.firstName" :valid="isValid('firstName')">
        <input
          id="checkout-firstName"
          v-model="form.firstName"
          type="text"
          name="given-name"
          autocomplete="given-name"
          autocapitalize="words"
          enterkeyhint="next"
          @input="emit('input', 'firstName')"
          @blur="emit('blur', 'firstName')"
        />
      </FormField>
      <FormField id="checkout-lastName" :label="f.lastName" :error="errors.lastName" :valid="isValid('lastName')">
        <input
          id="checkout-lastName"
          v-model="form.lastName"
          type="text"
          name="family-name"
          autocomplete="family-name"
          autocapitalize="words"
          enterkeyhint="next"
          @input="emit('input', 'lastName')"
          @blur="emit('blur', 'lastName')"
        />
      </FormField>
    </div>

    <FormField id="checkout-phone" :label="f.phone" :error="errors.phone" :hint="f.phoneHint" :valid="isValid('phone')">
      <input
        id="checkout-phone"
        v-model="form.phone"
        type="tel"
        name="tel"
        inputmode="tel"
        autocomplete="tel-national"
        maxlength="16"
        enterkeyhint="next"
        :placeholder="f.phonePlaceholder"
        @input="emit('input', 'phone')"
        @blur="emit('blur', 'phone')"
      />
    </FormField>

    <div class="cf__row">
      <FormField id="checkout-email" :label="f.email" :error="errors.email" :hint="f.emailHint" :valid="isValid('email')">
        <input
          id="checkout-email"
          v-model="form.email"
          type="email"
          name="email"
          inputmode="email"
          autocomplete="email"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint="next"
          @input="emit('input', 'email')"
          @blur="emit('blur', 'email')"
        />
      </FormField>
      <FormField id="checkout-idNumber" :label="f.idNumber" :error="errors.idNumber" :valid="isValid('idNumber')">
        <input
          id="checkout-idNumber"
          v-model="form.idNumber"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="13"
          autocomplete="off"
          enterkeyhint="next"
          @input="emit('input', 'idNumber')"
          @blur="emit('blur', 'idNumber')"
        />
      </FormField>
    </div>
  </CheckoutSection>
</template>

<style scoped lang="scss">
.cf__row {
  @include flex-cards(220px, 1rem);

  // Nombre y apellido caben lado a lado incluso a 360px.
  &--pair > * {
    flex-basis: 130px;
  }
}
</style>
