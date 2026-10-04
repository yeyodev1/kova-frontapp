<script setup lang="ts">
import { site, checkoutCopy } from '@/config/site'

// done/current vienen del formulario real: el indicador avanza mientras el cliente completa.
withDefaults(defineProps<{ done?: boolean[]; current?: number }>(), { done: () => [], current: 0 })
</script>

<template>
  <header class="ch">
    <div class="ch__inner">
      <RouterLink to="/" class="ch__logo" :aria-label="checkoutCopy.backToStore">
        <span class="ch__plinth"><img :src="site.logo" alt="" width="30" height="30" /></span>
        <span class="ch__name">{{ site.name.toUpperCase() }}</span>
      </RouterLink>

      <ol class="ch__steps" :aria-label="checkoutCopy.stepsLabel">
        <li
          v-for="(label, i) in checkoutCopy.steps"
          :key="label"
          class="ch__step"
          :class="{ 'ch__step--done': done[i], 'ch__step--current': i === current && !done[i] }"
          :aria-current="i === current ? 'step' : undefined"
        >
          <span class="ch__dot" aria-hidden="true">
            <Transition name="ch-swap" mode="out-in">
              <i v-if="done[i]" key="ok" class="fa-solid fa-check"></i>
              <span v-else key="n">{{ i + 1 }}</span>
            </Transition>
          </span>
          <span class="ch__label">{{ label }}<span v-if="done[i]" class="visually-hidden">, {{ checkoutCopy.stepDone }}</span></span>
          <span v-if="i < checkoutCopy.steps.length - 1" class="ch__bar" aria-hidden="true"><span class="ch__fill"></span></span>
        </li>
      </ol>

      <span class="ch__secure"><i class="fa-solid fa-lock" aria-hidden="true"></i><span>{{ checkoutCopy.secure }}</span></span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.ch {
  position: relative;
  z-index: 5;
  background: rgba($surface, 0.92);
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1160px);
    @include flex(row, center, space-between, 0.75rem);
    min-height: 3.75rem;
    flex-wrap: wrap;
    padding-block: 0.5rem;
  }

  &__logo {
    @include flex(row, center, flex-start, 0.55rem);
    @include focus-ring;
    border-radius: 10px;
  }

  &__plinth {
    @include plinth(10px);
    @include flex(row, center, center);
    width: 2.25rem;
    height: 2.25rem;

    img {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 6px;
      mix-blend-mode: normal;
    }
  }

  &__name {
    @include display(0.95rem, 800, 125%);
    letter-spacing: 0.16em;
    color: $accent-deep;
  }

  // En móvil los pasos bajan a su propia fila, a todo el ancho.
  &__steps {
    order: 3;
    flex: 1 0 100%;
    list-style: none;
    @include flex(row, center, space-between, 0.4rem);
    padding-top: 0.15rem;

    @include from('md') {
      order: 0;
      flex: 0 1 26rem;
      padding-top: 0;
    }
  }

  &__step {
    @include flex(row, center, flex-start, 0.4rem);
    flex: 1;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;

    &:last-child {
      flex: 0 0 auto;
    }

    &--done,
    &--current {
      color: $ink;
    }
  }

  // Conector entre pasos: se llena con scaleX al completar el paso.
  &__bar {
    flex: 1;
    min-width: 0.75rem;
    height: 2px;
    margin-left: 0.2rem;
    border-radius: 2px;
    background: $line;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    background: $success;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform $dur-slow $ease-out;
  }

  &__step--done &__fill {
    transform: scaleX(1);
  }

  &__dot {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 1.5px solid $alu-dark;
    background: $surface;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 700;
    transition:
      background-color $dur ease,
      border-color $dur ease,
      color $dur ease;
  }

  &__step--current &__dot {
    border-color: $accent-deep;
    background: $accent-deep;
    color: $surface;
  }

  &__step--done &__dot {
    border-color: $success;
    background: $success;
    color: $surface;

    i {
      animation: pop 0.4s $ease-spring;
    }
  }

  &__secure {
    @include flex(row, center, flex-start, 0.4rem);
    padding: 0.35rem 0.7rem;
    border-radius: $radius-pill;
    background: $success-bg;
    font-size: $text-xs;
    font-weight: 700;
    color: darken($success, 8%);
  }
}

.ch-swap-enter-active,
.ch-swap-leave-active {
  transition:
    opacity $dur-fast ease,
    transform $dur-fast $ease-out;
}
.ch-swap-enter-from,
.ch-swap-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
