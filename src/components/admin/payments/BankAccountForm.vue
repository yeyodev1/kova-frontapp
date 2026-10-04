<script setup lang="ts">
import { toRef } from 'vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import BankPicker from './BankPicker.vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'
import type { AccountDraft } from '@/composables/admin/usePayments'
import type { BankCatalogItem } from '@/services/payments.service'

const props = defineProps<{
  open: boolean
  editing: boolean
  draft: AccountDraft
  errors: Partial<Record<keyof AccountDraft, string>>
  banks: BankCatalogItem[]
  notice?: string
  saving?: boolean
}>()
const emit = defineEmits<{ close: []; save: [] }>()

useBodyScroll(toRef(props, 'open'))

const types = ['Ahorros', 'Corriente', 'Transaccional'] as const
const fields = [
  { key: 'number', label: copy.numberLabel, mode: 'numeric', placeholder: '2201234567' },
  { key: 'holder', label: copy.holderLabel, mode: 'text', placeholder: 'Kova S.A.S.' },
  { key: 'idNumber', label: copy.idLabel, mode: 'numeric', placeholder: '0999999999001' },
] as const
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')" @keydown.esc="emit('close')">
        <form
          class="sheet__box"
          role="dialog"
          aria-modal="true"
          :aria-label="editing ? copy.formEdit : copy.formNew"
          novalidate
          @submit.prevent="emit('save')"
        >
          <header class="sheet__head">
            <h2>{{ editing ? copy.formEdit : copy.formNew }}</h2>
            <button type="button" class="sheet__close" :aria-label="copy.cancel" @click="emit('close')">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <p v-if="notice" class="sheet__notice" role="status">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ notice }}
          </p>

          <div class="sheet__body">
            <BankPicker v-model="draft.bankCode" :banks="banks" :error="errors.bankCode" />

            <div v-if="draft.bankCode === 'otro'" class="field" :class="{ 'field--invalid': errors.bank }">
              <label for="acc-bank">{{ copy.otherName }}</label>
              <input id="acc-bank" v-model="draft.bank" type="text" maxlength="80" autocomplete="off" />
              <span v-if="errors.bank" class="field__error">{{ errors.bank }}</span>
            </div>

            <fieldset class="sheet__types">
              <legend>{{ copy.typeLabel }}</legend>
              <label v-for="type in types" :key="type" class="sheet__chip" :class="{ 'sheet__chip--on': draft.type === type }">
                <input v-model="draft.type" type="radio" name="acc-type" :value="type" class="visually-hidden" />
                <i v-if="draft.type === type" class="fa-solid fa-check" aria-hidden="true"></i>
                {{ type }}
              </label>
            </fieldset>

            <div v-for="f in fields" :key="f.key" class="field" :class="{ 'field--invalid': errors[f.key] }">
              <label :for="`acc-${f.key}`">{{ f.label }}</label>
              <input
                :id="`acc-${f.key}`"
                v-model="draft[f.key]"
                type="text"
                :inputmode="f.mode"
                :placeholder="f.placeholder"
                :aria-invalid="!!errors[f.key]"
                autocomplete="off"
              />
              <span v-if="errors[f.key]" class="field__error">{{ errors[f.key] }}</span>
            </div>
          </div>

          <footer class="sheet__actions">
            <AdminButton @click="emit('close')">{{ copy.cancel }}</AdminButton>
            <AdminButton type="submit" variant="primary" icon="fa-solid fa-floppy-disk" :loading="saving">
              {{ copy.save }}
            </AdminButton>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: $overlay;
  backdrop-filter: blur(4px);
  @include flex(column, stretch, flex-end);

  @include from('sm') {
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__box {
    @include flex(column, stretch, flex-start);
    width: 100%;
    max-height: 92dvh;
    background: $surface;
    border-radius: 22px 22px 0 0;
    box-shadow: $shadow-lg;

    @include from('sm') {
      max-width: 480px;
      border-radius: 22px;
    }
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    padding: 1rem 1rem 0.5rem 1.2rem;

    h2 {
      @include display($text-lg, 780, 110%);
    }
  }

  &__close {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    color: $ink-soft;

    &:hover {
      background: $paper;
    }
  }

  &__notice {
    margin: 0 1.2rem 0.4rem;
    padding: 0.65rem 0.8rem;
    border-radius: 12px;
    background: $info-bg;
    color: $info;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.95rem);
    padding: 0.5rem 1.2rem 1rem;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__types {
    border: 0;
    margin: 0;
    padding: 0;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    legend {
      font-size: 0.82rem;
      font-weight: 500;
      color: $ink-soft;
      margin-bottom: 0.35rem;
      width: 100%;
    }
  }

  &__chip {
    @include flex(row, center, center, 0.4rem);
    min-height: 2.6rem;
    margin: 0;
    padding: 0 1.1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    cursor: pointer;
    @include transition(background);

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--on {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    padding: 0.8rem 1.2rem calc(0.8rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity $dur $ease-out;

  .sheet__box {
    transition: transform $dur $ease-out;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(24px);
  }
}
</style>
