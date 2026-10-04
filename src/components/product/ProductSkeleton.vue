<script setup lang="ts">
import { productCopy } from '@/config/site'
</script>

<template>
  <div class="psk" aria-busy="true" :aria-label="productCopy.loading">
    <div class="psk__gallery">
      <div class="psk__media"></div>
      <div class="psk__thumbs">
        <span v-for="n in 4" :key="n" class="skeleton"></span>
      </div>
    </div>
    <div class="psk__info">
      <div class="psk__line psk__line--eyebrow skeleton"></div>
      <div class="psk__line psk__line--title skeleton"></div>
      <div class="psk__line psk__line--title psk__line--short skeleton"></div>
      <div class="psk__line psk__line--price skeleton"></div>
      <div class="psk__line psk__line--text skeleton"></div>
      <div v-for="n in 3" :key="n" class="psk__offer skeleton"></div>
      <div class="psk__cta skeleton"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Misma estructura que la ficha: galería en peana + columna de compra.
.psk {
  @include flex(column, stretch, flex-start, 1.5rem);

  @include from('lg') {
    flex-direction: row;
    gap: 3.5rem;
    padding-top: 2rem;
  }

  &__gallery {
    flex: 1.1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__media {
    @include plinth(0);
    aspect-ratio: 1 / 1;
    margin-inline: -1.25rem;
    border-radius: 0 0 28px 28px;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 55%;
      background: linear-gradient(100deg, transparent, rgba(#fff, 0.8), transparent);
      transform: translateX(-120%);
      animation: psk-shimmer 1.6s $ease-out infinite;
    }

    @include from('md') {
      margin-inline: 0;
      border-radius: 28px;
    }
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.5rem);

    span {
      width: 3.9rem;
      height: 3.9rem;
      border-radius: 12px;
    }
  }

  &__info {
    flex: 1;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__line {
    height: 1rem;
    border-radius: 8px;

    &--eyebrow {
      width: 30%;
      height: 0.7rem;
    }

    &--title {
      height: 2.2rem;
    }

    &--short {
      width: 60%;
    }

    &--price {
      height: 2.8rem;
      width: 45%;
      margin-top: 0.3rem;
    }

    &--text {
      width: 85%;
    }
  }

  &__offer {
    height: 4.4rem;
    border-radius: 16px;
  }

  &__cta {
    height: 3.85rem;
    border-radius: 16px;
    margin-top: 0.4rem;
  }

  @include reduced-motion {
    &__media::after {
      animation: none;
      opacity: 0;
    }
  }
}

@keyframes psk-shimmer {
  to {
    transform: translateX(260%);
  }
}
</style>
