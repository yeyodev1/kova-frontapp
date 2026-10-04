<script setup lang="ts">
import { trackingCopy } from '@/config/site'
import { useTracking } from '@/composables/useTracking'

// Cancelado, devuelto o fallido: no tiene sentido una línea de tiempo a medias.
// Mejor decir qué pasó y dar una salida directa con una persona.
const { whatsapp } = useTracking()
</script>

<template>
  <section class="ta">
    <span class="ta__icon" aria-hidden="true"><i class="fa-solid fa-headset"></i></span>
    <h2 class="ta__title">{{ trackingCopy.problemTitle }}</h2>
    <p class="ta__text">{{ trackingCopy.problemText }}</p>
    <a :href="whatsapp" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ trackingCopy.problemCta }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.ta {
  @include flex(column, flex-start, flex-start, 0.6rem);
  padding: 1.5rem 1.25rem;
  border-radius: 22px;
  background: $surface;
  border: 1px solid rgba($danger, 0.35);
  box-shadow: 0 0 0 4px rgba($danger, 0.06), $shadow-sm;

  &__icon {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: 14px;
    background: $danger-bg;
    color: $danger;
    font-size: 1.15rem;
  }

  &__title {
    @include display($text-xl, 780, 114%);
    margin-top: 0.3rem;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.55;
    margin-bottom: 0.6rem;
  }
}
</style>
