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

async function mount() {
  status.value = 'loading'
  try {
    await render(props.config)
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

onMounted(async () => {
  await nextTick()
  panel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mount()
})
</script>

<template>
  <section ref="panel" class="pp" aria-labelledby="pp-title">
    <header class="pp__head">
      <div class="pp__heading">
        <span class="pp__lock" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>
        <div>
          <h2 id="pp-title" class="pp__title">{{ checkoutCopy.payphoneTitle }}</h2>
          <p class="pp__text">{{ checkoutCopy.payphoneText }}</p>
        </div>
      </div>
      <div class="pp__amount">
        <span class="pp__amount-label">{{ checkoutCopy.payphoneAmount }}</span>
        <strong class="pp__amount-value">{{ formatCents(config.amount) }}</strong>
        <span class="pp__order">{{ checkoutCopy.payphoneOrder }} {{ orderNumber }}</span>
      </div>
    </header>

    <div class="pp__stage" aria-live="polite">
      <div v-if="status === 'loading'" class="pp__loading">
        <span class="pp__shimmer" aria-hidden="true"></span>
        <p><span class="pp__spinner" aria-hidden="true"></span> {{ checkoutCopy.payphoneLoading }}</p>
      </div>

      <div v-else-if="status === 'error'" class="pp__error" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <p>{{ checkoutCopy.payphoneError }}</p>
        <button type="button" class="btn btn--dark" @click="mount">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ checkoutCopy.payphoneRetry }}
        </button>
      </div>

      <div id="pp-button" class="pp__box" :class="{ 'pp__box--ready': status === 'ready' }"></div>
    </div>

    <button type="button" class="pp__change" @click="emit('cancel')">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ checkoutCopy.payphoneChange }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.pp {
  @include alu-border(20px);
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.15rem 1rem 1rem;
  box-shadow:
    0 0 0 4px rgba($accent, 0.12),
    $shadow-md;
  scroll-margin-top: 1rem;
  animation: rise $dur-slow $ease-out both;

  @include from('md') {
    padding: 1.6rem 1.6rem 1.2rem;
  }

  &__head {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__heading {
    @include flex(row, flex-start, flex-start, 0.75rem);
  }

  &__lock {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: $success-bg;
    color: darken($success, 6%);
    font-size: 0.9rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;
    margin-top: 0.2rem;
  }

  &__amount {
    @include moss;
    @include flex(row, baseline, space-between, 0.25rem 0.75rem);
    flex-wrap: wrap;
    padding: 0.9rem 1rem;
    border-radius: 14px;
  }

  &__amount-label {
    @include eyebrow;
    color: rgba(#fff, 0.7);
    flex-basis: 100%;
  }

  &__amount-value {
    @include price($display-sm, 850);
    color: #fff;
    line-height: 1.05;
  }

  &__order {
    font-family: $font-mono;
    font-size: $text-xs;
    letter-spacing: 0.06em;
    color: rgba(#fff, 0.75);
  }

  &__stage {
    position: relative;
    min-height: 6rem;
  }

  &__loading {
    @include flex(column, stretch, flex-start, 0.8rem);

    p {
      @include flex(row, center, center, 0.55rem);
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &__shimmer {
    @include plinth(14px);
    @include glint('&', 1.6s, 0.7);
    height: 9rem;

    &::after {
      animation-iteration-count: infinite !important;
    }
  }

  &__spinner {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid $line;
    border-top-color: $accent;
    animation: pp-spin 0.75s linear infinite;
  }

  &__error {
    @include flex(column, center, flex-start, 0.75rem);
    padding: 1.25rem 1rem;
    border-radius: 14px;
    background: $danger-bg;
    text-align: center;

    i {
      font-size: 1.4rem;
      color: $danger;
    }

    p {
      font-size: $text-sm;
      color: $ink;
      max-width: 34ch;
    }
  }

  &__box {
    min-height: 1px;
    opacity: 0;
    transition: opacity $dur-slow $ease-out;

    &--ready {
      opacity: 1;
    }
  }

  &__change {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring;
    align-self: center;
    min-height: 2.75rem;
    padding-inline: 1rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    transition: background-color $dur-fast ease;

    &:hover {
      background: $accent-soft;
    }
  }
}

@keyframes pp-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
