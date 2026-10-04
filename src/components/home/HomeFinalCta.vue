<script setup lang="ts">
import { home, site, whatsappLink } from '@/config/site'
import TrustSeals from '@/components/store/TrustSeals.vue'
</script>

<template>
  <section class="final">
    <div v-reveal class="final__card">
      <span class="final__halo" aria-hidden="true"></span>
      <div class="final__plinth" aria-hidden="true">
        <img :src="site.logo" alt="" width="120" height="120" loading="lazy" />
      </div>
      <h2 class="final__title">{{ home.finalCta.title }}</h2>
      <p class="final__text">{{ home.finalCta.text }}</p>
      <div class="final__actions">
        <RouterLink to="/tienda" class="btn btn--cta btn--lg">
          {{ home.finalCta.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
        <a :href="whatsappLink()" class="btn btn--lg final__wa" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ home.hero.secondary }}
        </a>
      </div>
      <TrustSeals class="final__seals" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.final {
  @include container(1200px);
  padding-block: 0 $space-xl;

  &__card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    @include flex(column, center, center, 0.9rem);
    text-align: center;
    padding: 3rem 1.25rem 2.25rem;
    border-radius: $radius-lg;
    background:
      radial-gradient(80% 60% at 50% 0%, rgba(#fff, 0.9), transparent 70%),
      linear-gradient(180deg, $alu-light, $sand);
    border: 1px solid rgba($alu-dark, 0.4);
    box-shadow: inset 0 1px 0 #fff, $shadow-md;

    @include from('md') {
      padding: 4.5rem 2rem 3rem;
    }
  }

  &__halo {
    position: absolute;
    z-index: -1;
    left: 50%;
    top: 0;
    width: 36rem;
    height: 36rem;
    transform: translate(-50%, -45%);
    background: radial-gradient(closest-side, rgba($sage, 0.4), transparent);
  }

  &__plinth {
    @include plinth(22px);
    padding: 6px;
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom: 0.5rem;
    box-shadow:
      inset 0 1px 0 #fff,
      0 18px 34px -14px rgba($accent-deep, 0.5);

    img {
      width: 100%;
      height: 100%;
      border-radius: 17px;
      object-fit: cover;
      mix-blend-mode: normal;
    }
  }

  &__title {
    @include display($display-md, 820, 118%);
    color: $accent-deep;
    max-width: 16ch;
  }

  &__text {
    color: $ink-soft;
    max-width: 44ch;
  }

  &__actions {
    @include flex(column, stretch, center, 0.6rem);
    width: 100%;
    margin-top: 0.5rem;

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
      font-size: 1.15rem;
    }
  }

  &__seals {
    justify-content: center;
    margin-top: 0.5rem;
  }
}
</style>
