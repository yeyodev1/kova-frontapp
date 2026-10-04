<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import TrustSeals from '@/components/store/TrustSeals.vue'
import PriceTicker from './PriceTicker.vue'

defineProps<{ total: number; processing: boolean; disabled?: boolean }>()
</script>

<template>
  <div class="submit">
    <Transition name="slide-up" appear>
      <div class="submit__bar">
        <!-- aria-disabled en vez de disabled mientras procesa: el foco no se pierde y
             useCheckout ignora el segundo envío, así nunca hay doble pedido. -->
        <button
          type="submit"
          class="btn btn--cta btn--lg btn--block submit__btn"
          :class="{ 'submit__btn--busy': processing }"
          :disabled="disabled && !processing"
          :aria-disabled="processing || undefined"
          :aria-busy="processing"
        >
          <span v-if="processing" class="submit__spinner" aria-hidden="true"></span>
          <i v-else class="fa-solid fa-lock" aria-hidden="true"></i>
          <span v-if="processing">{{ checkoutCopy.processing }}</span>
          <span v-else class="submit__label">
            {{ checkoutCopy.confirm }}<template v-if="total">
              <span class="submit__sep" aria-hidden="true">·</span><PriceTicker :cents="total" class="submit__total" /></template>
          </span>
        </button>
      </div>
    </Transition>
    <TrustSeals class="submit__seals" />
  </div>
</template>

<style scoped lang="scss">
.submit {
  @include flex(column, stretch, flex-start, 0.9rem);

  // En móvil el botón queda fijo abajo: siempre a un toque de confirmar.
  &__bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
    padding: 0.7rem 1rem calc(0.7rem + env(safe-area-inset-bottom));
    background: rgba($surface, 0.94);
    backdrop-filter: blur(12px) saturate(1.2);
    border-top: 1px solid $line;
    box-shadow: 0 -12px 30px rgba($ink, 0.08);

    @include from('lg') {
      position: static;
      padding: 0;
      background: none;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  &__btn {
    min-height: 3.6rem;
    font-size: 1.05rem;

    &--busy {
      cursor: progress;
      pointer-events: none;
      filter: saturate(0.85);
    }
  }

  &__label {
    @include flex(row, center, center, 0.45rem);
  }

  &__sep {
    opacity: 0.6;
  }

  &__total {
    @include price(1.1rem, 800);
  }

  &__spinner {
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 50%;
    border: 2.5px solid rgba($surface, 0.35);
    border-top-color: $surface;
    animation: submit-spin 0.7s linear infinite;
  }

  &__seals {
    justify-content: center;
  }
}

@keyframes submit-spin {
  to {
    transform: rotate(360deg);
  }
}

@include reduced-motion {
  .submit__spinner {
    animation-duration: 1.6s !important;
    animation-iteration-count: infinite !important;
  }
}
</style>
