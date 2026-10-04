<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; text?: string; center?: boolean; light?: boolean }>()
</script>

<template>
  <header v-reveal class="heading" :class="{ 'heading--center': center, 'heading--light': light }">
    <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
    <h2 class="heading__title">{{ title }}</h2>
    <p v-if="text" class="heading__text">{{ text }}</p>
    <slot />
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, flex-start, 0.55rem);
  margin-bottom: 1.5rem;

  @include from('md') {
    margin-bottom: 2rem;
  }

  &--center {
    align-items: center;
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.6rem);

    // Un filo de aluminio antes de la etiqueta, como una placa de vitrina.
    &::before {
      content: '';
      width: 1.4rem;
      height: 1px;
      background: currentColor;
      opacity: 0.6;
    }
  }

  &__title {
    @include display($display-sm, 780, 118%);
    color: $ink;
    max-width: 22ch;
  }

  &__text {
    color: $ink-soft;
    max-width: 56ch;
  }

  &--light &__eyebrow {
    color: $sage;
  }

  &--light &__title {
    color: $surface;
  }

  &--light &__text {
    color: rgba($surface, 0.7);
  }
}
</style>
