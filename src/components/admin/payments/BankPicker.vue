<script setup lang="ts">
import { computed, ref } from 'vue'
import BankLogo from '@/components/ui/BankLogo.vue'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'
import type { BankCatalogItem } from '@/services/payments.service'

const model = defineModel<string>({ required: true })
const props = defineProps<{ banks: BankCatalogItem[]; error?: string }>()

const query = ref('')
// Con un banco ya elegido la lista se pliega: en el celular el formulario no se hace eterno.
const browsing = ref(!model.value)

const plain = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const filtered = computed(() => {
  const q = plain(query.value.trim())
  return q ? props.banks.filter((b) => plain(b.name).includes(q) || b.code === 'otro') : props.banks
})
const selected = computed(() => props.banks.find((b) => b.code === model.value) || null)

function pick(code: string) {
  model.value = code
  browsing.value = false
  query.value = ''
}
</script>

<template>
  <div class="bp" :class="{ 'bp--invalid': error }">
    <span class="bp__label" id="bp-label">{{ copy.bankLabel }}</span>

    <button v-if="selected && !browsing" type="button" class="bp__selected" @click="browsing = true">
      <BankLogo :src="selected.logoUrl" size="2.25rem" />
      <strong>{{ selected.name }}</strong>
      <span class="bp__change">Cambiar <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
    </button>

    <template v-else>
      <div class="bp__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input v-model="query" type="search" :placeholder="copy.bankSearch" :aria-label="copy.bankSearch" autocomplete="off" />
      </div>
      <ul class="bp__list" role="listbox" aria-labelledby="bp-label">
        <li v-for="bank in filtered" :key="bank.code">
          <button
            type="button"
            role="option"
            class="bp__option"
            :class="{ 'bp__option--on': bank.code === model }"
            :aria-selected="bank.code === model"
            @click="pick(bank.code)"
          >
            <BankLogo :src="bank.logoUrl" size="2rem" />
            <span class="bp__name">{{ bank.name }}</span>
            <i v-if="bank.code === model" class="fa-solid fa-check" aria-hidden="true"></i>
          </button>
        </li>
      </ul>
      <p v-if="filtered.length === 1" class="bp__hint">{{ copy.bankNone }}</p>
    </template>
    <p v-if="error" class="bp__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.bp {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__selected {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.55rem 0.8rem;
    border: 1px solid $line;
    border-radius: 12px;
    background: $surface;
    text-align: left;

    strong {
      flex: 1 1 auto;
      font-size: $text-base;
    }
  }

  &__change {
    font-size: $text-xs;
    font-weight: 600;
    color: $accent;
  }

  &__search {
    position: relative;

    i {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      padding-left: 2.4rem;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.15rem);
    list-style: none;
    margin: 0;
    padding: 0.3rem;
    max-height: 15rem;
    overflow-y: auto;
    border: 1px solid $line;
    border-radius: 12px;
    background: $surface;
    overscroll-behavior: contain;
  }

  &__option {
    @include flex(row, center, flex-start, 0.65rem);
    width: 100%;
    min-height: 2.9rem;
    padding: 0.35rem 0.6rem;
    border-radius: 10px;
    text-align: left;
    font-size: $text-sm;
    @include transition(background);

    &:hover {
      background: $paper;
    }

    &--on {
      background: $accent-soft;
      font-weight: 600;

      i {
        color: $accent;
      }
    }
  }

  &__name {
    flex: 1 1 auto;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
  }

  &--invalid &__list,
  &--invalid &__selected {
    border-color: $danger;
  }
}
</style>
