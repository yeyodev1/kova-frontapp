<script setup lang="ts">
import { trackingCopy } from '@/config/site'
import { useTracking, type TrackedOrder } from '@/composables/useTracking'
import CopyButton from '@/components/order/CopyButton.vue'

defineProps<{ order: TrackedOrder }>()
const { carrier, guide } = useTracking()
</script>

<template>
  <section class="sh">
    <h2 class="sh__title">{{ trackingCopy.shipTitle }}</h2>

    <dl class="sh__rows">
      <div class="sh__row">
        <dt><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ trackingCopy.carrier }}</dt>
        <dd :class="{ 'sh__muted': !carrier }">{{ carrier || trackingCopy.carrierPending }}</dd>
      </div>
      <div v-if="order.address?.city" class="sh__row">
        <dt><i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ trackingCopy.destination }}</dt>
        <dd>{{ order.address.city }}, {{ order.address.province }}</dd>
      </div>
    </dl>

    <div v-if="guide" class="sh__guide">
      <div>
        <p class="sh__guide-label">{{ trackingCopy.guide }}</p>
        <p class="sh__guide-value">{{ guide }}</p>
      </div>
      <CopyButton :value="guide" :label="trackingCopy.guide" />
    </div>
    <p v-else class="sh__pending">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ trackingCopy.noGuide }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.sh {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  border-radius: 22px;
  padding: 1.35rem 1.15rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 1.6rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
  }

  &__rows {
    @include flex(column, stretch, flex-start, 0.7rem);
    font-size: $text-sm;
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);

    dt {
      @include flex(row, baseline, flex-start, 0.5rem);
      color: $ink-muted;
      white-space: nowrap;

      i {
        width: 1rem;
        color: $accent;
        text-align: center;
      }
    }

    dd {
      font-weight: 700;
      text-align: right;
    }
  }

  &__muted {
    color: $ink-muted;
    font-weight: 600 !important;
  }

  &__guide {
    @include plinth(16px);
    @include flex(row, center, space-between, 0.75rem);
    padding: 0.85rem 0.9rem 0.85rem 1rem;
  }

  &__guide-label {
    @include eyebrow;
    font-size: 0.62rem;
  }

  &__guide-value {
    margin-top: 0.15rem;
    font-family: $font-mono;
    font-size: $text-lg;
    font-weight: 700;
    letter-spacing: 0.04em;
    word-break: break-all;
  }

  &__pending {
    @include flex(row, baseline, flex-start, 0.55rem);
    padding: 0.85rem 1rem;
    border-radius: 14px;
    border: 1px dashed $alu-dark;
    background: $alu-light;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }
}
</style>
