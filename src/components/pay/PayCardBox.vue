<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { payOrderCopy as copy } from '@/config/site'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import type { PayphoneConfig } from '@/types'

const props = defineProps<{ config: PayphoneConfig; minutesLeft: number }>()

const { render } = usePayphoneBox()
const status = ref<'loading' | 'ready' | 'error'>('loading')

// Reintentar solo vuelve a pintar la Cajita con el mismo intento: no pide otro al servidor.
async function mount() {
  status.value = 'loading'
  await nextTick()
  try {
    await render(props.config)
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

onMounted(mount)
watch(() => props.config.clientTransactionId, mount)
</script>

<template>
  <section class="pcb" aria-labelledby="pcb-title">
    <header class="pcb__head">
      <span class="pcb__lock" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>
      <div>
        <h2 id="pcb-title" class="pcb__title">{{ copy.boxTitle }}</h2>
        <p class="pcb__text">{{ copy.boxText }}</p>
      </div>
    </header>

    <div class="pcb__stage" aria-live="polite">
      <div v-if="status === 'loading'" class="pcb__loading">
        <span class="pcb__shimmer" aria-hidden="true"></span>
        <p><span class="pcb__spinner" aria-hidden="true"></span> {{ copy.boxLoading }}</p>
      </div>

      <div v-else-if="status === 'error'" class="pcb__error" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <p>{{ copy.boxError }}</p>
        <button type="button" class="btn btn--dark" @click="mount">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.boxRetry }}
        </button>
      </div>

      <div id="pp-button" class="pcb__box" :class="{ 'pcb__box--ready': status === 'ready' }"></div>
    </div>

    <p v-if="status === 'ready'" class="pcb__timer" :class="{ 'pcb__timer--soon': minutesLeft <= 2 }">
      <i class="fa-regular fa-clock" aria-hidden="true"></i> {{ copy.expiresIn(minutesLeft) }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.pcb {
  @include alu-border(20px);
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.15rem 1rem 1rem;
  box-shadow:
    0 0 0 4px rgba($accent, 0.12),
    $shadow-md;
  animation: rise $dur-slow $ease-out both;

  @include from('md') {
    padding: 1.5rem 1.5rem 1.2rem;
  }

  &__head {
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
    margin-top: 0.2rem;
    font-size: $text-sm;
    line-height: 1.45;
    color: $ink-soft;
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
    animation: pcb-spin 0.75s linear infinite;
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
      max-width: 34ch;
      font-size: $text-sm;
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

  &__timer {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;

    &--soon {
      color: darken($warning, 18%);
    }
  }
}

@keyframes pcb-spin {
  to {
    transform: rotate(360deg);
  }
}

@include reduced-motion {
  .pcb__spinner {
    animation-duration: 2s;
  }
}
</style>
