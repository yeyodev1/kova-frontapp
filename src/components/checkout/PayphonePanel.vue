<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import type { PayphoneConfig } from '@/types'

const props = defineProps<{ config: PayphoneConfig; orderNumber: string }>()
const emit = defineEmits<{ cancel: [] }>()

const { render } = usePayphoneBox()
const status = ref<'loading' | 'ready' | 'error'>('loading')
const panel = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  panel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  try {
    await render(props.config)
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
})
</script>

<template>
  <section ref="panel" class="pp" aria-live="polite">
    <header class="pp__head">
      <h2 class="pp__title"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ checkoutCopy.payphoneTitle }}</h2>
      <p class="pp__text">{{ checkoutCopy.payphoneText }}</p>
      <p class="pp__amount">
        {{ orderNumber }} · <strong>{{ formatCents(config.amount) }}</strong>
      </p>
    </header>

    <p v-if="status === 'loading'" class="pp__state">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ checkoutCopy.payphoneLoading }}
    </p>
    <p v-else-if="status === 'error'" class="pp__state pp__state--error" role="alert">{{ checkoutCopy.payphoneError }}</p>

    <div id="pp-button" class="pp__box"></div>

    <button type="button" class="pp__change" @click="emit('cancel')">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ checkoutCopy.payphoneChange }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.pp {
  @include card;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1.1rem;
  border-color: $accent;
  box-shadow: 0 0 0 1px $accent;
  scroll-margin-top: 1rem;

  @include from('md') {
    padding: 1.5rem;
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xl;
    font-weight: 600;

    i {
      color: $success;
      font-size: 1rem;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__amount {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;

    strong {
      font-family: $font-display;
      color: $ink;
      font-size: $text-lg;
    }
  }

  &__state {
    @include flex(row, center, center, 0.5rem);
    padding: 1.5rem 0;
    color: $ink-soft;
    font-size: $text-sm;

    &--error {
      color: $danger;
      text-align: center;
    }
  }

  &__box {
    min-height: 1px;
  }

  &__change {
    align-self: center;
    min-height: 2.75rem;
    padding-inline: 1rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
