<script setup lang="ts">
import { home } from '@/config/site'

defineProps<{ count: number; index: number }>()
const emit = defineEmits<{ prev: []; next: []; go: [i: number] }>()
</script>

<template>
  <div class="controls">
    <button type="button" class="controls__arrow" :aria-label="home.vitrine.prev" @click="emit('prev')">
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
    </button>
    <div class="controls__dots">
      <button
        v-for="n in count"
        :key="n"
        type="button"
        class="controls__dot"
        :class="{ 'is-active': n - 1 === index }"
        :aria-label="home.vitrine.goTo(n)"
        :aria-current="n - 1 === index"
        @click="emit('go', n - 1)"
      >
        <span></span>
      </button>
    </div>
    <button type="button" class="controls__arrow" :aria-label="home.vitrine.next" @click="emit('next')">
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.controls {
  @include flex(row, center, center, 0.25rem);
  margin-top: 0.75rem;

  &__arrow {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 0.8rem;
    color: $ink-soft;
    transition:
      background-color $dur-fast $ease-out,
      transform $dur-fast $ease-out;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba($alu, 0.6);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  &__dots {
    @include flex(row, center, center);
  }

  // Botón de 44px de alto; el punto visible es chico.
  &__dot {
    @include flex(row, center, center);
    width: 1.6rem;
    height: 2.75rem;
    -webkit-tap-highlight-color: transparent;

    span {
      display: block;
      width: 1.1rem;
      height: 4px;
      border-radius: 4px;
      background: $alu-dark;
      transform: scaleX(0.4);
      transition:
        transform $dur $ease-out,
        background-color $dur $ease-out;
    }

    &.is-active span {
      background: $accent-deep;
      transform: scaleX(1);
    }
  }
}
</style>
