<script setup lang="ts">
import { site, checkoutCopy } from '@/config/site'
</script>

<template>
  <header class="ch">
    <div class="ch__inner">
      <RouterLink to="/" class="ch__logo" :aria-label="`${site.name}, inicio`">
        <img :src="site.logo" alt="" width="32" height="32" />
        <span>{{ site.name.toUpperCase() }}</span>
      </RouterLink>
      <span class="ch__secure"><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ checkoutCopy.secure }}</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.ch {
  background: $surface;
  border-bottom: 1px solid $line;

  &__inner {
    @include container(1040px);
    @include flex(row, center, space-between, 1rem);
    min-height: 3.5rem;
  }

  &__logo {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-display;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: $accent-deep;

    img {
      width: 2rem;
      height: 2rem;
      border-radius: 8px;
    }
  }

  &__secure {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $success;
  }
}
</style>
