<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><i :class="icon || 'fa-solid fa-box-open'" aria-hidden="true"></i></span>
    <h2 class="empty__title">{{ title }}</h2>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <div class="empty__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.6rem);
  text-align: center;
  padding: $space-lg 1rem;

  &__icon {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    color: $ink-soft;
    max-width: 42ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}
</style>
