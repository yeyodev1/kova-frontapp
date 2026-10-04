<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <span class="empty__plinth"><i :class="icon || 'fa-regular fa-folder-open'"></i></span>
    <p class="empty__title">{{ title }}</p>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <div v-if="$slots.default" class="empty__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.45rem);
  text-align: center;
  padding: 2.4rem 1.2rem;
  border: 1px dashed $alu-dark;
  border-radius: $radius-md;
  background: rgba($surface, 0.7);
  animation: rise $dur-slow $ease-out both;

  &__plinth {
    @include plinth(16px);
    @include flex(row, center, center);
    width: 3.6rem;
    height: 3.6rem;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    color: $accent;
  }

  &__title {
    @include display(1.05rem, 750, 112%);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-muted;
    max-width: 36ch;
  }

  &__actions {
    @include flex(row, center, center, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  @include reduced-motion {
    animation: none;
  }
}
</style>
