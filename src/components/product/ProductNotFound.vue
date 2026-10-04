<script setup lang="ts">
import { productCopy, whatsappLink } from '@/config/site'
</script>

<template>
  <section class="nf">
    <div class="nf__plinth" aria-hidden="true">
      <i class="fa-solid fa-box-open"></i>
    </div>
    <p class="nf__eyebrow">{{ productCopy.notFoundEyebrow }}</p>
    <h1 class="nf__title">{{ productCopy.notFoundTitle }}</h1>
    <p class="nf__text">{{ productCopy.notFoundText }}</p>
    <div class="nf__actions">
      <RouterLink to="/tienda" class="btn btn--primary btn--lg">
        {{ productCopy.notFoundCta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
      <a :href="whatsappLink()" class="btn btn--ghost btn--lg" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ productCopy.needHelp }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  @include flex(column, center, flex-start, 0.8rem);
  text-align: center;
  padding: $space-xl 0.5rem;
  max-width: 34rem;
  margin-inline: auto;

  > * {
    animation: rise $dur-slow $ease-out both;
  }

  @for $i from 2 through 5 {
    > :nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 70}ms;
    }
  }

  &__plinth {
    @include plinth(32px);
    @include flex(row, center, center);
    width: 8rem;
    height: 8rem;
    margin-bottom: 0.8rem;
    font-size: 2.6rem;
    color: $alu-dark;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 800, 122%);
  }

  &__text {
    color: $ink-soft;
    max-width: 40ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
}
</style>
