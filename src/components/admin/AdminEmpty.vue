<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <i :class="icon || 'fa-regular fa-folder-open'" class="empty__icon"></i>
    <p class="empty__title">{{ title }}</p>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.4rem);
  text-align: center;
  padding: 2.5rem 1rem;
  border: 1px dashed $line;
  border-radius: $radius-md;
  background: $surface;

  &__icon {
    font-size: 1.6rem;
    color: $silver;
    margin-bottom: 0.3rem;
  }

  &__title {
    font-weight: 600;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-muted;
    max-width: 34ch;
  }
}
</style>
