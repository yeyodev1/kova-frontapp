<script setup lang="ts">
import { trackingCopy } from '@/config/site'
import type { TrackStep } from '@/composables/useTracking'

defineProps<{ steps: TrackStep[] }>()

// Cada tramo se dibuja después del anterior: la línea "avanza" hasta el paso actual.
const STEP_MS = 260
</script>

<template>
  <section class="tl">
    <h2 class="tl__title">{{ trackingCopy.progressTitle }}</h2>
    <ol class="tl__list">
      <li
        v-for="(step, i) in steps"
        :key="step.key"
        class="tl__step"
        :class="`tl__step--${step.state}`"
        :style="{ '--delay': `${i * STEP_MS}ms` }"
        :aria-current="step.state === 'current' ? 'step' : undefined"
      >
        <span v-if="i < steps.length - 1" class="tl__track" aria-hidden="true">
          <span v-if="step.state === 'done'" class="tl__fill"></span>
        </span>
        <span class="tl__node" aria-hidden="true">
          <i :class="step.state === 'done' ? 'fa-solid fa-check' : step.icon"></i>
        </span>
        <div class="tl__body">
          <p class="tl__label">
            {{ step.label }}
            <span v-if="step.state === 'current'" class="tl__now">{{ trackingCopy.stepNow }}</span>
          </p>
          <p v-if="step.hint" class="tl__hint">{{ step.hint }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
$node: 2.4rem;
$gap: 1.6rem;

.tl {
  @include card;
  border-radius: 22px;
  padding: 1.35rem 1.15rem 1.1rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.75rem 1.6rem 1.4rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
    margin-bottom: 1.35rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, $gap);
  }

  &__step {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.95rem);
  }

  // Tramo entre este nodo y el siguiente: base gris y relleno salvia que se dibuja con scaleY.
  &__track {
    position: absolute;
    left: calc(#{$node} / 2 - 1.5px);
    top: $node;
    bottom: -$gap;
    width: 3px;
    border-radius: 3px;
    background: $sand;
    overflow: hidden;
  }

  &__fill {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, $accent, $sage);
    transform-origin: top;
    animation: tl-draw 0.42s $ease-out both;
    animation-delay: calc(var(--delay) + 0.25s);
  }

  &__node {
    position: relative;
    z-index: 1;
    @include flex(row, center, center);
    flex-shrink: 0;
    width: $node;
    height: $node;
    border-radius: 50%;
    font-size: 0.85rem;
    transition: transform $dur $ease-out;
  }

  &__step--done &__node {
    background: $accent;
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(#fff, 0.25);
    animation: tl-pop 0.4s $ease-spring both;
    animation-delay: calc(var(--delay) + 0.1s);
  }

  &__step--current &__node {
    background: $surface;
    color: $accent-deep;
    box-shadow:
      inset 0 0 0 2px $accent,
      0 6px 16px -6px rgba($accent, 0.6);
    animation: tl-pop 0.5s $ease-spring both;
    animation-delay: calc(var(--delay) + 0.2s);

    // Pulso suave: el pedido está "vivo" en este paso.
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 2px solid $accent;
      animation: tl-pulse 2.2s $ease-out infinite;
      animation-delay: calc(var(--delay) + 0.8s);
      opacity: 0;
    }
  }

  &__step--todo &__node {
    background: $alu-light;
    color: $alu-dark;
    box-shadow: inset 0 0 0 1.5px $alu;
  }

  &__body {
    flex: 1;
    min-width: 0;
    padding-top: 0.45rem;
  }

  &__label {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-weight: 700;
    line-height: 1.3;
  }

  &__step--todo &__label {
    color: $ink-muted;
    font-weight: 600;
  }

  &__now {
    font-family: $font-mono;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.18rem 0.5rem;
    border-radius: $radius-pill;
    background: $accent;
    color: #fff;
  }

  &__hint {
    margin-top: 0.2rem;
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__step--current &__hint {
    color: $ink-soft;
  }

  @include reduced-motion {
    &__fill,
    &__node,
    &__step--current &__node::after {
      animation: none !important;
    }
  }
}

@keyframes tl-draw {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes tl-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes tl-pulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(1.55);
    opacity: 0;
  }
}
</style>
