<script setup lang="ts">
import { orderCopy } from '@/config/site'
import CopyButton from './CopyButton.vue'

defineProps<{ carrier: string; guide: string }>()
</script>

<template>
  <section class="si">
    <h3 class="si__title">{{ orderCopy.trackShipTitle }}</h3>
    <dl v-if="carrier || guide" class="si__list">
      <div v-if="carrier" class="si__row">
        <dt>{{ orderCopy.carrier }}</dt>
        <dd>{{ carrier }}</dd>
      </div>
      <div v-if="guide" class="si__row si__row--guide">
        <dt>{{ orderCopy.guide }}</dt>
        <dd>
          <span class="si__mono">{{ guide }}</span>
          <CopyButton :value="guide" :label="orderCopy.guide" />
        </dd>
      </div>
    </dl>
    <p v-else class="si__empty">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ orderCopy.trackNoGuide }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.si {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__title {
    @include eyebrow;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__row {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    font-size: $text-sm;

    dt {
      color: $ink-muted;
    }

    dd {
      @include flex(row, center, flex-end, 0.6rem);
      font-weight: 700;
      min-width: 0;
    }

    &--guide {
      padding: 0.6rem 0.6rem 0.6rem 0.85rem;
      border-radius: 14px;
      background: $alu-light;
      border: 1px solid $line;
    }
  }

  &__mono {
    font-family: $font-mono;
    font-size: 1rem;
    letter-spacing: 0.04em;
    overflow-wrap: anywhere;
  }

  &__empty {
    @include flex(row, baseline, flex-start, 0.55rem);
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }
}
</style>
