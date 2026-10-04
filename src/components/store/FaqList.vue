<script setup lang="ts">
import type { Faq } from '@/types'

defineProps<{ items: Faq[] }>()
</script>

<template>
  <div class="faqs">
    <details v-for="faq in items" :key="faq.question" class="faq">
      <summary class="faq__question">
        <span>{{ faq.question }}</span>
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </summary>
      <p class="faq__answer">{{ faq.answer }}</p>
    </details>
  </div>
</template>

<style scoped lang="scss">
.faqs {
  @include flex(column, stretch, flex-start, 0.6rem);
}

.faq {
  @include card;
  overflow: hidden;

  &__question {
    @include flex(row, center, space-between, 1rem);
    list-style: none;
    cursor: pointer;
    padding: 1rem 1.1rem;
    min-height: 3.2rem;
    font-weight: 600;
    font-size: $text-base;

    &::-webkit-details-marker {
      display: none;
    }

    i {
      color: $accent;
      flex-shrink: 0;
      @include transition(transform);
    }
  }

  &[open] &__question i {
    transform: rotate(45deg);
  }

  &__answer {
    padding: 0 1.1rem 1.1rem;
    color: $ink-soft;
    font-size: $text-sm;
  }
}
</style>
