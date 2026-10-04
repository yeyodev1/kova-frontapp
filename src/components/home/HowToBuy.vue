<script setup lang="ts">
import { home } from '@/config/site'
import SectionHeading from '@/components/store/SectionHeading.vue'
</script>

<template>
  <section class="steps">
    <div class="steps__inner">
      <SectionHeading :eyebrow="home.steps.eyebrow" :title="home.steps.title" center light />
      <ol v-reveal class="steps__list">
        <li v-for="(step, i) in home.steps.items" :key="step.title" class="steps__item" :style="{ '--i': i }">
          <span class="steps__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="steps__body">
            <h3 class="steps__title">
              <i :class="step.icon" aria-hidden="true"></i>
              {{ step.title }}
            </h3>
            <p class="steps__text">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
$badge: 3.25rem;

.steps {
  @include moss;
  padding-block: $space-xl;

  &__inner {
    @include container(1200px);
  }

  &__list {
    list-style: none;
    position: relative;
    @include flex(column, stretch, flex-start, 1.75rem);
    max-width: 30rem;
    margin-inline: auto;

    // Conector: vertical en móvil, horizontal en escritorio. Se "dibuja" al revelarse.
    &::before {
      content: '';
      position: absolute;
      left: calc($badge / 2);
      top: calc($badge / 2);
      bottom: calc($badge / 2);
      width: 1px;
      background: linear-gradient(180deg, $alu, rgba($alu, 0.25));
      transform-origin: top;
      transition: transform 1.1s $ease-out 0.2s;
    }

    @include from('md') {
      flex-direction: row;
      max-width: none;
      gap: 2rem;

      &::before {
        left: calc(100% / 6);
        right: calc(100% / 6);
        top: calc($badge / 2);
        bottom: auto;
        width: auto;
        height: 1px;
        background: linear-gradient(90deg, rgba($alu, 0.25), $alu, rgba($alu, 0.25));
        transform-origin: left;
      }
    }

    &.reveal {
      opacity: 1;
      transform: none;

      &:not(.is-visible)::before {
        transform: scale(0);
      }

      &:not(.is-visible) .steps__item {
        opacity: 0;
        transform: translateY(16px);
      }
    }
  }

  &__item {
    position: relative;
    @include flex(row, flex-start, flex-start, 1.1rem);
    transition:
      opacity 0.6s $ease-out,
      transform 0.6s $ease-out;
    transition-delay: calc(var(--i) * 160ms + 150ms);

    @include from('md') {
      flex: 1 1 0;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  &__num {
    @include plinth(50%);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: $badge;
    height: $badge;
    font-family: $font-mono;
    font-weight: 600;
    font-size: 0.95rem;
    color: $accent-deep;
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.9),
      0 0 0 6px $accent-deep,
      0 10px 24px rgba(#000, 0.3);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.35rem);
    padding-top: 0.35rem;

    @include from('md') {
      align-items: center;
      padding-top: 0.5rem;
    }
  }

  &__title {
    @include display($text-lg, 750, 115%);
    @include flex(row, center, flex-start, 0.55rem);
    color: $surface;

    i {
      font-size: 0.95rem;
      color: $sage;
    }
  }

  &__text {
    font-size: $text-sm;
    color: rgba($surface, 0.68);
    max-width: 32ch;
  }
}
</style>
