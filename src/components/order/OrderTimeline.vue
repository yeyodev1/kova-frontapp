<script setup lang="ts">
import { computed } from 'vue'
import { orderTimeline, orderStatusLabel } from '@/config/site'
import type { OrderStatus } from '@/types'

const props = defineProps<{ status: OrderStatus }>()

const offTrack = computed(() => ['cancelled', 'failed', 'returned'].includes(props.status))
const current = computed(() => orderTimeline.findIndex((step) => step.statuses.includes(props.status)))
</script>

<template>
  <div class="tl">
    <p v-if="offTrack" class="tl__alert" role="status">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ orderStatusLabel[status] }}
    </p>
    <ol v-else class="tl__list">
      <li
        v-for="(step, i) in orderTimeline"
        :key="step.label"
        class="tl__step"
        :class="{ 'tl__step--done': i < current, 'tl__step--current': i === current }"
        :aria-current="i === current ? 'step' : undefined"
      >
        <span class="tl__dot" aria-hidden="true">
          <i v-if="i < current" class="fa-solid fa-check"></i>
        </span>
        <span class="tl__label">{{ i === current ? orderStatusLabel[status] : step.label }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped lang="scss">
.tl {
  &__alert {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger;
    font-weight: 600;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start);
  }

  &__step {
    position: relative;
    @include flex(row, center, flex-start, 0.8rem);
    padding-bottom: 1.1rem;
    color: $ink-muted;

    // Línea vertical que une los pasos
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 0.7rem;
      top: 1.5rem;
      bottom: 0.1rem;
      width: 2px;
      background: $line;
    }

    &--done {
      color: $ink-soft;

      &::after {
        background: $accent !important;
      }
    }

    &--current {
      color: $ink;
      font-weight: 600;
    }
  }

  &__dot {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.45rem;
    height: 1.45rem;
    border-radius: 50%;
    border: 2px solid $line;
    background: $surface;
    font-size: 0.65rem;
    color: $surface;
  }

  &__step--done &__dot {
    background: $accent;
    border-color: $accent;
  }

  &__step--current &__dot {
    border-color: $cta;
    box-shadow: 0 0 0 4px $cta-soft;
  }

  &__label {
    font-size: $text-sm;
  }
}
</style>
