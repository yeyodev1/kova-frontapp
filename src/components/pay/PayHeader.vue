<script setup lang="ts">
import { site, payOrderCopy } from '@/config/site'
</script>

<template>
  <header class="ph">
    <div class="ph__inner">
      <RouterLink to="/" class="ph__logo" :aria-label="site.name">
        <span class="ph__plinth"><img :src="site.logo" alt="" width="30" height="30" /></span>
        <span class="ph__name">{{ site.name.toUpperCase() }}</span>
      </RouterLink>
      <span class="ph__secure"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ payOrderCopy.secure }}</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.ph {
  background: rgba($surface, 0.92);
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1040px);
    @include flex(row, center, space-between, 0.75rem);
    min-height: 3.6rem;
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

  &__secure {
    @include flex(row, center, flex-end, 0.4rem);
    padding: 0.35rem 0.75rem;
    border-radius: $radius-pill;
    background: $success-bg;
    color: darken($success, 8%);
    font-size: $text-xs;
    font-weight: 700;
  }
}
</style>
