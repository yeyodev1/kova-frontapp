<script setup lang="ts">
withDefaults(defineProps<{ rows?: number; height?: string }>(), { rows: 4, height: '4.2rem' })
</script>

<template>
  <div class="sk" aria-busy="true" aria-label="Cargando">
    <span v-for="n in rows" :key="n" class="sk__row" :style="{ height, '--i': n }">
      <span class="sk__thumb"></span>
      <span class="sk__lines">
        <span class="sk__line"></span>
        <span class="sk__line sk__line--short"></span>
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
// Silueta de fila (miniatura + dos líneas): anticipa la forma de lo que llega.
.sk {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__row {
    @include card;
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0.8rem;
    opacity: 0;
    animation: rise $dur-slow $ease-out forwards;
    animation-delay: calc(var(--i) * 60ms);
  }

  &__thumb,
  &__line {
    display: block;
    background: linear-gradient(90deg, $sand 0%, $alu-light 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.3s ease-in-out infinite;
  }

  &__thumb {
    flex: 0 0 auto;
    height: 100%;
    max-height: 3.4rem;
    aspect-ratio: 1;
    border-radius: $radius-sm;
  }

  &__lines {
    flex: 1;
    @include flex(column, stretch, center, 0.5rem);
  }

  &__line {
    height: 0.7rem;
    border-radius: $radius-pill;
    max-width: 70%;

    &--short {
      max-width: 40%;
    }
  }

  @include reduced-motion {
    &__row {
      opacity: 1;
      animation: none;
    }
  }
}

@keyframes shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
</style>
