<script setup lang="ts">
import { orderStatusLabel, trackingCopy } from '@/config/site'
import { useTracking, type TrackedOrder } from '@/composables/useTracking'
import { formatDate } from '@/utils/format'
import CopyButton from '@/components/order/CopyButton.vue'

defineProps<{ order: TrackedOrder }>()
const { status, uploadLink } = useTracking()
</script>

<template>
  <article class="tk">
    <div class="tk__stub">
      <p class="tk__hello">{{ trackingCopy.hello(order.customer?.firstName || '') }}</p>
      <p class="tk__label">{{ trackingCopy.orderLabel }}</p>
      <div class="tk__number-row">
        <h1 class="tk__number">{{ order.number }}</h1>
        <CopyButton :value="order.number" :label="trackingCopy.orderLabel" dark />
      </div>
      <p class="tk__date">
        <i class="fa-regular fa-calendar" aria-hidden="true"></i>
        {{ trackingCopy.placedOn(formatDate(order.createdAt)) }}
      </p>
    </div>

    <div class="tk__perf" aria-hidden="true"></div>

    <div v-if="status" class="tk__body" aria-live="polite">
      <span class="tk__chip" :class="`tk__chip--${status.tone}`">
        <span class="tk__dot"></span>
        {{ orderStatusLabel[order.status] }}
      </span>
      <h2 class="tk__title">{{ status.title }}</h2>
      <p class="tk__text">{{ status.text }}</p>
      <RouterLink v-if="uploadLink" :to="uploadLink" class="btn btn--primary tk__action">
        <i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i> {{ trackingCopy.uploadReceipt }}
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
$notch: 11px;

.tk {
  @include flex(column, stretch, flex-start);
  border-radius: 24px;
  background: $surface;
  box-shadow: $shadow-md;
  overflow: hidden;

  &__stub {
    @include moss;
    @include flex(column, flex-start, flex-start, 0.35rem);
    padding: 1.35rem 1.2rem 1.4rem;
  }

  &__hello {
    @include display($text-lg, 720, 112%);
    color: #fff;
    margin-bottom: 0.7rem;
  }

  &__label {
    @include eyebrow;
    color: $sage;
  }

  &__number-row {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    width: 100%;
  }

  &__number {
    font-family: $font-mono;
    font-size: clamp(1.9rem, 1.4rem + 2.6vw, 2.7rem);
    font-weight: 700;
    letter-spacing: 0.02em;
    line-height: 1.05;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }

  &__date {
    @include flex(row, center, flex-start, 0.45rem);
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: rgba(#fff, 0.72);
  }

  // Perforado del boleto: línea punteada con dos muescas del color del fondo.
  &__perf {
    position: relative;
    height: 0;
    border-top: 2px dashed $alu;
    margin-inline: $notch + 6px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -$notch - 1px;
      width: $notch * 2;
      height: $notch * 2;
      border-radius: 50%;
      background: $paper;
    }

    &::before {
      left: -$notch * 2 - 6px;
    }

    &::after {
      right: -$notch * 2 - 6px;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.55rem);
    padding: 1.35rem 1.2rem 1.4rem;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.32rem 0.75rem 0.32rem 0.6rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.02em;

    &--wait {
      background: $warning-bg;
      color: darken($warning, 24%);
    }

    &--progress {
      background: $accent-soft;
      color: $accent-deep;
    }

    &--done {
      background: $success-bg;
      color: darken($success, 8%);
    }

    &--problem {
      background: $danger-bg;
      color: darken($danger, 10%);
    }
  }

  &__dot {
    position: relative;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: currentColor;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: currentColor;
      animation: tk-ping 1.8s $ease-out infinite;
    }
  }

  &__title {
    @include display($display-sm, 800, 116%);
    margin-top: 0.25rem;
  }

  &__text {
    max-width: 36rem;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__action {
    margin-top: 0.5rem;
  }

  @include from('lg') {
    flex-direction: row;

    &__stub {
      flex: 0 0 38%;
      justify-content: center;
      padding: 2rem 1.9rem;
    }

    &__perf {
      height: auto;
      width: 0;
      border-top: none;
      border-left: 2px dashed $alu;
      margin: $notch + 6px 0;
      // La muesca se ve sobre el borde entre el musgo y el blanco.
      left: -1px;

      &::before,
      &::after {
        top: auto;
        left: -$notch - 1px;
        right: auto;
      }

      &::before {
        top: -$notch * 2 - 6px;
      }

      &::after {
        bottom: -$notch * 2 - 6px;
      }
    }

    &__body {
      flex: 1;
      justify-content: center;
      padding: 2rem 2.2rem;
    }
  }

  @include reduced-motion {
    &__dot::after {
      animation: none;
    }
  }
}

@keyframes tk-ping {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  80%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
</style>
