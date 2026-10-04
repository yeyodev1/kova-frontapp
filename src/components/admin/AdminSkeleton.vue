<script setup lang="ts">
withDefaults(defineProps<{ rows?: number; height?: string }>(), { rows: 4, height: '4.2rem' })
</script>

<template>
  <div class="skeleton" aria-busy="true" aria-label="Cargando">
    <span v-for="n in rows" :key="n" class="skeleton__row" :style="{ height }"></span>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__row {
    display: block;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, $sand 0%, lighten($sand, 4%) 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.3s ease-in-out infinite;
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
