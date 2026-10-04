<script setup lang="ts">
import { whatsappLink } from '@/config/site'
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">Esta página no existe</h1>
    <p class="not-found__text">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
    <div class="not-found__actions">
      <RouterLink to="/tienda" class="btn btn--cta btn--lg">Ver productos</RouterLink>
      <a :href="whatsappLink()" class="btn btn--ghost btn--lg" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Escríbenos
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(640px);
  @include flex(column, center, center, 0.8rem);
  flex: 1;
  text-align: center;
  padding-block: $space-section;

  &__code {
    @include eyebrow;
    font-size: $text-base;
  }

  &__title {
    @include display($display-md);
  }

  &__text {
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
