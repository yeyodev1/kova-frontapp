<script setup lang="ts">
import { trackingCopy } from '@/config/site'
</script>

<template>
  <div class="sk" role="status" aria-busy="true">
    <span class="visually-hidden">{{ trackingCopy.loading }}</span>
    <div class="sk__ticket">
      <div class="sk__stub">
        <span class="sk__bar sk__bar--light" style="width: 30%"></span>
        <span class="sk__bar sk__bar--light sk__bar--xl" style="width: 62%"></span>
        <span class="sk__bar sk__bar--light" style="width: 44%"></span>
      </div>
      <div class="sk__body">
        <span class="skeleton sk__chip"></span>
        <span class="skeleton sk__line sk__line--title"></span>
        <span class="skeleton sk__line" style="width: 88%"></span>
        <span class="skeleton sk__line" style="width: 64%"></span>
      </div>
    </div>
    <div class="sk__cols">
      <div class="sk__card">
        <div v-for="n in 4" :key="n" class="sk__step">
          <span class="skeleton sk__dot"></span>
          <span class="skeleton sk__line" :style="{ width: `${70 - n * 8}%` }"></span>
        </div>
      </div>
      <div class="sk__card">
        <span class="skeleton sk__line sk__line--title"></span>
        <span class="skeleton sk__block"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sk {
  @include flex(column, stretch, flex-start, 1.25rem);

  &__ticket {
    @include flex(column, stretch, flex-start);
    border-radius: 24px;
    background: $surface;
    overflow: hidden;
    box-shadow: $shadow-sm;
  }

  &__stub {
    @include moss;
    @include flex(column, flex-start, flex-start, 0.75rem);
    padding: 1.4rem 1.2rem;
  }

  &__bar {
    display: block;
    height: 0.85rem;
    border-radius: 6px;

    &--light {
      background: rgba(#fff, 0.12);
      animation: sk-breathe 1.4s ease-in-out infinite;
    }

    &--xl {
      height: 2.2rem;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.7rem);
    padding: 1.4rem 1.2rem;
  }

  &__chip {
    width: 7rem;
    height: 1.6rem;
    border-radius: $radius-pill;
  }

  &__line {
    display: block;
    width: 100%;
    height: 0.85rem;

    &--title {
      width: 70%;
      height: 1.6rem;
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1.1rem);
    flex: 1;
    border-radius: 22px;
    padding: 1.4rem 1.2rem;
  }

  &__step {
    @include flex(row, center, flex-start, 0.9rem);
  }

  &__dot {
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
  }

  &__block {
    height: 4.5rem;
    border-radius: 16px;
  }

  @include from('lg') {
    &__ticket {
      flex-direction: row;
    }

    &__stub {
      flex: 0 0 38%;
      padding: 2rem 1.9rem;
    }

    &__body {
      flex: 1;
      padding: 2rem 2.2rem;
    }

    &__cols {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  @include reduced-motion {
    &__bar--light {
      animation: none;
    }
  }
}

@keyframes sk-breathe {
  50% {
    opacity: 0.5;
  }
}
</style>
