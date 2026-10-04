<script setup lang="ts">
import { home, site, whatsappLink } from '@/config/site'
import TrustSeals from '@/components/store/TrustSeals.vue'
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow"><i class="fa-solid fa-location-dot"></i> {{ home.hero.eyebrow }}</p>
        <h1 class="hero__title">{{ home.hero.title }}</h1>
        <p class="hero__text">{{ home.hero.text }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--cta btn--lg">
            {{ home.hero.cta }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <a :href="whatsappLink()" class="btn btn--ghost hero__wa" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> {{ home.hero.secondary }}
          </a>
        </div>
        <TrustSeals light class="hero__seals" />
      </div>
      <div class="hero__brand" aria-hidden="true">
        <img :src="site.logo" alt="" width="320" height="320" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  background:
    radial-gradient(circle at 85% 20%, rgba($silver, 0.28), transparent 45%),
    linear-gradient(160deg, $accent 0%, $accent-deep 100%);
  color: $surface;
  overflow: hidden;

  &__inner {
    @include container;
    @include flex(column, stretch, center, 2rem);
    padding-block: 2.5rem 2.75rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding-block: 4.5rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);
    flex: 1.4;
  }

  &__eyebrow {
    @include eyebrow;
    color: $silver;
  }

  &__title {
    @include display($display-md, 700);
    color: $surface;
    max-width: 16ch;
  }

  &__text {
    font-size: $text-lg;
    color: rgba($surface, 0.88);
    max-width: 46ch;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    width: 100%;
    margin-top: 0.4rem;

    @include from('sm') {
      flex-direction: row;
      width: auto;
    }
  }

  &__wa {
    border-color: rgba($surface, 0.7);
    color: $surface;
    min-height: 3.4rem;

    &:hover {
      background: $surface;
      color: $accent-deep;
    }
  }

  &__seals {
    margin-top: 0.4rem;
  }

  &__brand {
    display: none;

    @include from('md') {
      @include flex(row, center, center);
      flex: 1;
    }

    img {
      width: min(320px, 100%);
      aspect-ratio: 1;
      border-radius: $radius-lg;
      box-shadow: 0 30px 60px rgba($ink, 0.3);
      border: 1px solid rgba($silver, 0.5);
    }
  }
}
</style>
