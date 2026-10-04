<script setup lang="ts">
import { ref } from 'vue'
import { trackingCopy } from '@/config/site'
import { useTracking } from '@/composables/useTracking'
import FormField from '@/components/checkout/FormField.vue'

const { form, errors, loading, check, tidyNumber, search } = useTracking()
const numberInput = ref<HTMLInputElement | null>(null)

function focus() {
  numberInput.value?.focus({ preventScroll: false })
  numberInput.value?.select()
}

defineExpose({ focus })
</script>

<template>
  <form class="tf" novalidate @submit.prevent="search">
    <FormField id="track-number" :label="trackingCopy.number" :error="errors.number" :hint="trackingCopy.numberHint">
      <input
        id="track-number"
        ref="numberInput"
        v-model="form.number"
        class="tf__mono"
        type="text"
        autocapitalize="characters"
        autocomplete="off"
        spellcheck="false"
        enterkeyhint="next"
        :placeholder="trackingCopy.numberPlaceholder"
        @blur="tidyNumber"
      />
    </FormField>
    <FormField id="track-phone" :label="trackingCopy.phone" :error="errors.phone">
      <input
        id="track-phone"
        v-model="form.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        enterkeyhint="search"
        maxlength="14"
        :placeholder="trackingCopy.phonePlaceholder"
        @blur="errors.phone && check('phone')"
      />
    </FormField>

    <button type="submit" class="btn btn--dark btn--lg btn--block tf__submit" :aria-busy="loading">
      <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass-location'" aria-hidden="true"></i>
      {{ loading ? trackingCopy.loading : trackingCopy.cta }}
    </button>

    <p class="tf__secure">
      <i class="fa-solid fa-lock" aria-hidden="true"></i>
      {{ trackingCopy.secure }}
    </p>
  </form>
</template>

<style scoped lang="scss">
.tf {
  @include alu-border(22px);
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.35rem 1.15rem 1.15rem;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 1.75rem 1.6rem 1.4rem;
  }

  &__mono {
    font-family: $font-mono;
    font-weight: 600;
    letter-spacing: 0.06em;

    &::placeholder {
      letter-spacing: 0.06em;
    }
  }

  &__submit {
    margin-top: 0.2rem;
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.14),
      0 12px 24px -12px rgba($accent-deep, 0.8);
  }

  &__secure {
    @include flex(row, baseline, center, 0.45rem);
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.4;

    i {
      color: $accent;
      font-size: 0.7rem;
    }
  }
}
</style>
