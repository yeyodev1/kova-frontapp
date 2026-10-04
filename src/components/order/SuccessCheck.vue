<script setup lang="ts">
// Check que se dibuja una sola vez: el momento de "listo" del pedido, sin confeti.
</script>

<template>
  <span class="sc" aria-hidden="true">
    <svg viewBox="0 0 64 64">
      <circle class="sc__disc" cx="32" cy="32" r="29" />
      <circle class="sc__ring" cx="32" cy="32" r="29" />
      <path class="sc__tick" d="M20 33.5l8.2 8.2L44.5 25" />
    </svg>
  </span>
</template>

<style scoped lang="scss">
.sc {
  @include plinth(50%);
  @include flex(row, center, center);
  width: 5.5rem;
  height: 5.5rem;
  animation: sc-in 0.5s $ease-spring both;

  svg {
    width: 4rem;
    height: 4rem;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &__ring {
    stroke: $success;
    stroke-width: 3;
    stroke-dasharray: 183;
    stroke-dashoffset: 183;
    transform: rotate(-90deg);
    transform-origin: center;
    animation: sc-draw 0.6s 0.15s $ease-out forwards;
  }

  &__disc {
    fill: $success;
    opacity: 0;
    transform: scale(0.7);
    transform-origin: center;
    animation: sc-fill 0.32s 0.62s $ease-out forwards;
  }

  &__tick {
    stroke: $surface;
    stroke-width: 4.5;
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: sc-draw 0.38s 0.8s $ease-out forwards;
  }

  // Sin movimiento: el check aparece ya dibujado.
  @include reduced-motion {
    animation: none;

    .sc__ring,
    .sc__tick {
      animation: none;
      stroke-dashoffset: 0;
    }

    .sc__disc {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
}

@keyframes sc-in {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
}

@keyframes sc-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes sc-fill {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
