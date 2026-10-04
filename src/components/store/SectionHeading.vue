<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; text?: string; center?: boolean }>()
</script>

<template>
  <header class="heading" :class="{ 'heading--center': center }">
    <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
    <h2 class="heading__title">{{ title }}</h2>
    <p v-if="text" class="heading__text">{{ text }}</p>
    <slot />
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, flex-start, 0.4rem);
  margin-bottom: 1.4rem;

  &--center {
    align-items: center;
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__text {
    color: $ink-soft;
    max-width: 56ch;
  }
}
</style>
