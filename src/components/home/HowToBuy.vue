<script setup lang="ts">
import { home } from '@/config/site'
import SectionHeading from '@/components/store/SectionHeading.vue'
</script>

<template>
  <section class="steps">
    <SectionHeading :eyebrow="home.steps.eyebrow" :title="home.steps.title" center />
    <ol class="steps__list">
      <li v-for="(step, i) in home.steps.items" :key="step.title" class="steps__item">
        <span class="steps__num">{{ i + 1 }}</span>
        <i :class="step.icon" class="steps__icon" aria-hidden="true"></i>
        <h3 class="steps__title">{{ step.title }}</h3>
        <p class="steps__text">{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.steps {
  &__list {
    list-style: none;
    @include flex-cards(240px, 0.9rem);
  }

  &__item {
    @include card;
    @include flex(column, flex-start, flex-start, 0.45rem);
    position: relative;
    padding: 1.4rem 1.25rem;
  }

  &__num {
    position: absolute;
    top: 1rem;
    right: 1.1rem;
    font-family: $font-display;
    font-weight: 700;
    font-size: 2rem;
    color: $sand;
    line-height: 1;
  }

  &__icon {
    font-size: 1.4rem;
    color: $accent;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
