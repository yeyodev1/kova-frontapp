<script setup lang="ts">
import { onMounted, ref } from 'vue'

// El destello cruza una sola vez al entrar: es la firma, no un adorno en bucle.
const glinting = ref(false)
onMounted(() => requestAnimationFrame(() => (glinting.value = true)))
</script>

<template>
  <div class="ti" :class="{ 'is-glinting': glinting }" aria-hidden="true">
    <svg class="ti__route" viewBox="0 0 240 120" preserveAspectRatio="none">
      <path d="M22 104 C 70 104, 70 30, 120 34 S 190 70, 214 22" />
    </svg>
    <span class="ti__truck"><i class="fa-solid fa-truck-fast"></i></span>
    <span class="ti__pin"><i class="fa-solid fa-location-dot"></i></span>

    <div class="ti__stage">
      <span class="ti__box">
        <i class="fa-solid fa-box"></i>
        <span class="ti__tape"></span>
      </span>
      <span class="ti__top"></span>
      <span class="ti__front"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ti {
  @include plinth(24px);
  @include glint('&:hover', 1.3s, 0.6);
  width: 100%;
  height: 100%;
  background:
    radial-gradient(70% 60% at 50% 30%, rgba(#fff, 0.95), transparent 70%),
    radial-gradient(120% 90% at 50% 0%, #ffffff 0%, $alu-light 50%, $alu 100%);

  &__route {
    position: absolute;
    inset: 12% 8% 34% 8%;
    width: 84%;
    height: 54%;
    fill: none;
    stroke: $alu-dark;
    stroke-width: 1.6;
    stroke-dasharray: 4 6;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    opacity: 0.85;
  }

  &__truck,
  &__pin {
    position: absolute;
    @include flex(row, center, center);
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm, inset 0 0 0 1px rgba($alu-dark, 0.5);
  }

  &__truck {
    left: 5%;
    bottom: 26%;
    width: 2.4rem;
    height: 2.4rem;
    color: $accent;
    font-size: 0.85rem;
  }

  &__pin {
    right: 6%;
    top: 6%;
    width: 2.7rem;
    height: 2.7rem;
    color: $accent-deep;
    font-size: 1rem;
    animation: ti-bob 3.2s ease-in-out infinite;
  }

  // La peana: una plataforma de aluminio con cara superior elíptica y canto frontal.
  &__stage {
    position: absolute;
    left: 50%;
    bottom: 12%;
    width: 46%;
    max-width: 13rem;
    aspect-ratio: 2.4 / 1;
    transform: translateX(-50%);
  }

  &__top {
    position: absolute;
    inset: 0 0 34% 0;
    border-radius: 50%;
    background: radial-gradient(80% 90% at 50% 30%, #fff, $alu-light 55%, $alu 100%);
    box-shadow: inset 0 -2px 0 rgba($alu-dark, 0.5);
    z-index: 1;
  }

  &__front {
    position: absolute;
    inset: 33% 0 0 0;
    border-radius: 0 0 50% 50% / 0 0 100% 100%;
    background: linear-gradient(90deg, $alu-dark, $alu-light 35%, $alu 60%, $alu-dark);
    box-shadow: 0 14px 22px -10px rgba($accent-deep, 0.45);
  }

  &__box {
    position: absolute;
    left: 50%;
    bottom: 42%;
    z-index: 3;
    @include flex(row, center, center);
    width: 56%;
    aspect-ratio: 1;
    transform: translateX(-50%);
    border-radius: 14px;
    background: linear-gradient(160deg, lighten($accent, 6%), $accent-deep 85%);
    color: rgba(#fff, 0.92);
    font-size: clamp(1.6rem, 6vw, 2.3rem);
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.25),
      0 16px 26px -12px rgba($accent-deep, 0.7);
    animation: ti-land 0.8s $ease-spring 0.15s both;
  }

  &__tape {
    position: absolute;
    left: 50%;
    top: 0;
    width: 18%;
    height: 22%;
    transform: translateX(-50%);
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, $alu-light, $alu);
  }

  @include reduced-motion {
    &__pin,
    &__box {
      animation: none;
    }
  }
}

@keyframes ti-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes ti-land {
  from {
    opacity: 0;
    transform: translate(-50%, -18px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}
</style>
