<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import FormField from './FormField.vue'
import type { CheckoutField, CheckoutForm } from '@/composables/useCheckoutForm'

// El formulario es el reactive de useCheckoutForm: se edita en sitio.
defineProps<{ form: CheckoutForm; errors: Partial<Record<CheckoutField, string>>; disabled?: boolean }>()
const emit = defineEmits<{ blur: [field: CheckoutField] }>()

const f = checkoutCopy.fields
</script>

<template>
  <fieldset class="group" :disabled="disabled">
    <legend class="group__title"><span>1</span> {{ checkoutCopy.contactTitle }}</legend>
    <p class="group__note">{{ checkoutCopy.noAccount }}</p>

    <div class="group__row group__row--pair">
      <FormField id="checkout-firstName" :label="f.firstName" :error="errors.firstName">
        <input
          id="checkout-firstName"
          v-model="form.firstName"
          type="text"
          autocomplete="given-name"
          autocapitalize="words"
          enterkeyhint="next"
          :aria-invalid="!!errors.firstName"
          @blur="emit('blur', 'firstName')"
        />
      </FormField>
      <FormField id="checkout-lastName" :label="f.lastName" :error="errors.lastName">
        <input
          id="checkout-lastName"
          v-model="form.lastName"
          type="text"
          autocomplete="family-name"
          autocapitalize="words"
          enterkeyhint="next"
          :aria-invalid="!!errors.lastName"
          @blur="emit('blur', 'lastName')"
        />
      </FormField>
    </div>

    <FormField id="checkout-phone" :label="f.phone" :error="errors.phone" :hint="f.phoneHint">
      <input
        id="checkout-phone"
        v-model="form.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        maxlength="16"
        enterkeyhint="next"
        :placeholder="f.phonePlaceholder"
        :aria-invalid="!!errors.phone"
        aria-describedby="checkout-phone-hint"
        @blur="emit('blur', 'phone')"
      />
    </FormField>

    <div class="group__row">
      <FormField id="checkout-idNumber" :label="f.idNumber" :error="errors.idNumber">
        <input
          id="checkout-idNumber"
          v-model="form.idNumber"
          type="text"
          inputmode="numeric"
          maxlength="13"
          autocomplete="off"
          :aria-invalid="!!errors.idNumber"
          @blur="emit('blur', 'idNumber')"
        />
      </FormField>
      <FormField id="checkout-email" :label="f.email" :error="errors.email" :hint="f.emailHint">
        <input
          id="checkout-email"
          v-model="form.email"
          type="email"
          inputmode="email"
          autocomplete="email"
          autocapitalize="off"
          :aria-invalid="!!errors.email"
          @blur="emit('blur', 'email')"
        />
      </FormField>
    </div>
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

  &__note {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: -0.5rem;
  }

  &__row {
    @include flex-cards(220px, 0.9rem);

    // Nombre y apellido caben lado a lado incluso a 360px.
    &--pair > * {
      flex-basis: 130px;
    }
  }
}
</style>
