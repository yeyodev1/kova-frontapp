<script setup lang="ts">
import { home, whatsappLink } from '@/config/site'

const copy = home.notFound
</script>

<template>
  <section class="not-found">
    <div class="not-found__display" aria-hidden="true">
      <span class="not-found__halo"></span>
      <span class="not-found__plinth">
        <span class="not-found__shadow"></span>
      </span>
      <span class="not-found__base"></span>
    </div>
    <p class="not-found__code">{{ copy.code }}</p>
    <h1 class="not-found__title">{{ copy.title }}</h1>
    <p class="not-found__text">{{ copy.text }}</p>
    <div class="not-found__actions">
      <RouterLink to="/tienda" class="btn btn--primary btn--lg">
        {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
      <a :href="whatsappLink()" class="btn btn--lg not-found__wa" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.secondary }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(640px);
  @include flex(column, center, center, 0.75rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl;

  &__display {
    position: relative;
    @include flex(column, center, flex-start);
    margin-bottom: 1.25rem;
    animation: rise 0.7s $ease-out both;
  }

  &__halo {
    position: absolute;
    inset: -30% -40%;
    background: radial-gradient(closest-side, rgba(#fff, 0.9), transparent);
  }

  // La peana vacía: el producto que buscabas no está, solo queda su sombra.
  &__plinth {
    @include plinth(26px);
    @include glint('&:hover', 1.2s, 0.6);
    @include flex(column, center, flex-end);
    width: 12rem;
    height: 9.5rem;
    padding-bottom: 1.6rem;

    &::after {
      animation: glint 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    }
  }

  &__shadow {
    width: 5.5rem;
    height: 0.9rem;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba($accent-deep, 0.2), transparent);
    animation: wobble 3s ease-in-out infinite alternate;
  }

  &__base {
    width: 10.8rem;
    height: 12px;
    border-radius: 0 0 12px 12px;
    background: linear-gradient(180deg, $alu, $alu-dark);
    box-shadow: 0 16px 26px -14px rgba($ink, 0.35);
  }

  &__code {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 820, 118%);
    color: $accent-deep;
    max-width: 14ch;
  }

  &__text {
    color: $ink-soft;
    max-width: 42ch;
    margin-bottom: 0.75rem;
  }

  &__actions {
    @include flex(column, stretch, center, 0.6rem);
    width: 100%;

    @include from('sm') {
      flex-direction: row;
      width: auto;
    }
  }

  &__wa {
    background: $surface;
    border: 1px solid $line;

    i {
      color: #1f9d55;
    }
  }
}

@keyframes wobble {
  to {
    transform: scaleX(0.7);
    opacity: 0.6;
  }
}
</style>
