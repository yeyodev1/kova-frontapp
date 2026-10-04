<script setup lang="ts">
import { whatsappLink, layoutCopy } from '@/config/site'

defineProps<{ raised?: boolean }>()
</script>

<template>
  <a
    class="wa"
    :class="{ 'wa--raised': raised }"
    :href="whatsappLink()"
    target="_blank"
    rel="noopener"
    :aria-label="layoutCopy.whatsappFloat"
    :title="layoutCopy.whatsappFloat"
  >
    <span class="wa__halo" aria-hidden="true"></span>
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
</template>

<style scoped lang="scss">
$wa: #1f9d55;

.wa {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 80;
  @include flex(row, center, center);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(180deg, lighten($wa, 4%), $wa 60%, darken($wa, 4%));
  color: $surface;
  font-size: 1.8rem;
  box-shadow:
    inset 0 1px 0 rgba(#fff, 0.3),
    0 12px 28px -8px rgba($wa, 0.6);
  // Espera a que la persona vea el hero antes de aparecer.
  opacity: 0;
  animation: rise 0.6s $ease-out 1.5s forwards;
  transition: transform $dur-fast $ease-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.94);
  }

  i {
    position: relative;
  }

  // Halo muy sutil: una onda cada pocos segundos, no un parpadeo constante.
  &__halo {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba($wa, 0.55);
    opacity: 0;
    animation: wa-halo 3.6s $ease-out 2.4s infinite;
  }

  @include focus-ring($accent-deep);

  // En producto la barra fija de compra (≈76px, visible hasta 'lg') ocupa el borde
  // inferior: el botón se para encima con aire suficiente para no taparla.
  &--raised {
    @include until('lg') {
      bottom: calc(6.5rem + env(safe-area-inset-bottom));
    }
  }

  @include reduced-motion {
    opacity: 1;
    animation: none;

    &__halo {
      display: none;
    }
  }
}

@keyframes wa-halo {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  55%,
  100% {
    opacity: 0;
    transform: scale(1.55);
  }
}
</style>
