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
    border-radius: 14px;
    background: $danger-bg;
    color: darken($danger, 6%);
    font-weight: 600;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start);
  }

  &__step {
    position: relative;
    @include flex(row, center, flex-start, 0.85rem);
    padding-bottom: 1.25rem;
    color: $ink-muted;

    // Línea vertical que une los pasos
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 0.8rem;
      top: 1.75rem;
      bottom: 0.15rem;
      width: 2px;
      margin-left: -1px;
      background: $line;
    }

    &:last-child {
      padding-bottom: 0;
    }

    &--done {
      color: $ink-soft;

      &::after {
        background: $sage !important;
      }
    }

    &--current {
      color: $ink;
      font-weight: 700;
    }
  }

  &__dot {
    position: relative;
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    border: 2px solid $line;
    background: $surface;
    font-size: 0.65rem;
    color: $surface;
  }

  &__step--done &__dot {
    background: $sage;
    border-color: $sage;
  }

  &__step--current &__dot {
    border-color: $accent;
    background: $accent;

    // Pulso lento: el paso en el que está tu pedido ahora mismo.
    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: $accent;
      animation: tl-pulse 2s $ease-out infinite;
    }
  }

  &__label {
    font-size: $text-base;
  }
}

@keyframes tl-pulse {
  from {
    transform: scale(1);
    opacity: 0.45;
  }
  to {
    transform: scale(2.1);
    opacity: 0;
  }
}

@include reduced-motion {
  .tl__step--current .tl__dot::before {
    display: none;
  }
}
</style>
