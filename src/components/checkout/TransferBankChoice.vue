<script setup lang="ts">
import BankLogo from '@/components/ui/BankLogo.vue'
import { checkoutCopy } from '@/config/site'
import type { BankAccount } from '@/types'

const model = defineModel<string>({ required: true })
defineProps<{ accounts: BankAccount[] }>()
</script>

<template>
  <fieldset class="tb">
    <legend class="tb__title">{{ checkoutCopy.transferBankTitle }}</legend>
    <div class="tb__options">
      <label
        v-for="account in accounts"
        :key="account._id"
        class="tb__option"
        :class="{ 'tb__option--on': model === account._id }"
      >
        <input v-model="model" type="radio" name="transfer-bank" :value="account._id" class="visually-hidden" />
        <BankLogo :src="account.logoUrl" size="2rem" />
        <span class="tb__name">{{ account.bank }}</span>
        <i v-if="model === account._id" class="fa-solid fa-circle-check" aria-hidden="true"></i>
      </label>
    </div>
    <p class="tb__hint">{{ checkoutCopy.transferBankHint }}</p>
  </fieldset>
</template>

<style scoped lang="scss">
.tb {
  border: 0;
  margin: 0;
  padding: 0.9rem 0.95rem;
  border-radius: 16px;
  background: $paper;

  &__title {
    float: left;
    width: 100%;
    font-weight: 700;
    font-size: $text-sm;
    margin-bottom: 0.6rem;
  }

  &__options {
    clear: both;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__option {
    @include flex(row, center, flex-start, 0.65rem);
    margin: 0;
    min-height: 3.1rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid $line;
    border-radius: 12px;
    background: $surface;
    font-size: $text-base;
    font-weight: 600;
    color: $ink;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    .tb__name {
      flex: 1 1 auto;
    }

    i {
      color: $accent;
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--on {
      border-color: $accent;
      box-shadow: 0 0 0 2px rgba($accent, 0.25);
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.5rem;
  }
}
</style>
