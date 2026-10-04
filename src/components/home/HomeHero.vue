<script setup lang="ts">
import { home, whatsappLink } from '@/config/site'
import HeroVitrine from './HeroVitrine.vue'
import type { Product } from '@/types'

defineProps<{ products: Product[]; loading: boolean }>()
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ home.hero.eyebrow }}
        </p>
        <h1 class="hero__title" :aria-label="home.hero.title">
          <span
            v-for="(line, i) in home.hero.titleLines"
            :key="line"
            class="hero__line"
            aria-hidden="true"
          >
            <span :style="{ '--i': i }">{{ line }}</span>
          </span>
        </h1>
        <p class="hero__text">{{ home.hero.text }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--cta btn--lg hero__cta">
            {{ home.hero.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
          <a :href="whatsappLink()" class="btn btn--lg hero__wa" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ home.hero.secondary }}
          </a>
        </div>
      </div>

      <div class="hero__showcase">
        <HeroVitrine :products="products" :loading="loading" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  // Niebla salvia con un halo frío: el fondo de la vitrina, no un "banner".
  background:
    radial-gradient(70% 45% at 80% 62%, rgba($sage, 0.38), transparent 70%),
    radial-gradient(60% 40% at 0% 0%, rgba(#fff, 0.7), transparent 70%),
    linear-gradient(180deg, $paper 0%, darken($paper, 2%) 100%);

  &__inner {
    @include container(1200px);
    @include flex(column, stretch, flex-start, 2.25rem);
    padding-block: 1.5rem 2.5rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
      padding-block: 3.5rem 4.5rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('md') {
      flex: 1.3 1 0;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.45rem);
    opacity: 0;
    animation: rise 0.6s $ease-out forwards;
  }

  &__title {
    @include display(clamp(2rem, 9vw, 4.9rem), 820, 116%);
    line-height: 0.98;
    color: $accent-deep;

    @include from('md') {
      font-size: clamp(2.6rem, 4.1vw, 4.4rem);
    }
  }

  // Máscara por línea: el texto sube desde abajo de su propia caja.
  &__line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
    margin-bottom: -0.08em;

    span {
      display: block;
      animation: line-up 0.9s $ease-out both;
      animation-delay: calc(var(--i) * 90ms + 120ms);
    }

    &:last-child span {
      color: $accent;
    }
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.5;
    color: $ink-soft;
    max-width: 40ch;
    opacity: 0;
    animation: rise 0.7s $ease-out 0.45s forwards;
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    width: 100%;
    margin-top: 0.3rem;
    opacity: 0;
    animation: rise 0.7s $ease-out 0.58s forwards;

    @include from('sm') {
      width: auto;
    }
  }

  &__cta {
    flex: 1 1 auto;

    // El destello de compra cruza una vez cuando termina de entrar.
    &::after {
      animation: glint 1.1s cubic-bezier(0.4, 0, 0.2, 1) 1.5s;
    }
  }

  &__wa {
    flex: 0 0 auto;
    background: $surface;
    color: $ink;
    border: 1px solid $line;
    box-shadow: $shadow-sm;

    i {
      color: #1f9d55;
      font-size: 1.15rem;
    }

    &:hover {
      border-color: $alu-dark;
    }
  }

  &__showcase {
    opacity: 0;
    animation: rise 0.9s $ease-out 0.3s forwards;

    @include from('md') {
      flex: 1 1 0;
    }
  }

  @include reduced-motion {
    &__eyebrow,
    &__text,
    &__actions,
    &__showcase {
      opacity: 1;
      animation: none;
    }
  }
}
</style>
