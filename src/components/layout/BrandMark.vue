<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; light?: boolean }>(), { size: 'md', light: false })
</script>

<template>
  <span class="brand" :class="[`brand--${size}`, { 'brand--light': light }]">
    <span class="brand__plinth">
      <img :src="site.logo" alt="" width="64" height="64" />
    </span>
    <span class="brand__name">{{ site.name.toUpperCase() }}</span>
  </span>
</template>

<style scoped lang="scss">
// El logo sobre una mini peana: la misma idea de la vitrina, a escala de marca.
.brand {
  --mark: 2.1rem;
  @include flex(row, center, flex-start, 0.6rem);
  color: $accent-deep;

  &__plinth {
    @include plinth(11px);
    flex-shrink: 0;
    width: var(--mark);
    height: var(--mark);
    padding: 2px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 9px;
      mix-blend-mode: normal;
    }
  }

  &__name {
    @include display(1.05rem, 800, 125%);
    letter-spacing: 0.32em;
    line-height: 1;
    // El tracking agrega aire al final; lo compensamos para que quede centrado.
    margin-right: -0.32em;
  }

  &--sm {
    --mark: 1.8rem;

    .brand__name {
      font-size: 0.95rem;
    }
  }

  &--lg {
    --mark: 2.8rem;
    gap: 0.8rem;

    .brand__name {
      font-size: 1.35rem;
    }
  }

  &--light {
    color: $surface;
  }
}
</style>
