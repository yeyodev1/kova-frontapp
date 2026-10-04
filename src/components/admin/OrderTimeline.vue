<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import type { TimelineEvent } from '@/composables/admin/useOrderDetail'

defineProps<{ events: TimelineEvent[] }>()
</script>

<template>
  <AdminPanel title="Historial" icon="fa-solid fa-clock-rotate-left">
    <ol class="tl">
      <li v-for="(e, i) in events" :key="i" class="tl__item">
        <span class="tl__dot"><i :class="e.icon"></i></span>
        <div>
          <p class="tl__label">{{ e.label }}</p>
          <p class="tl__at">{{ e.at }}</p>
          <p v-if="e.note" class="tl__note">{{ e.note }}</p>
        </div>
      </li>
    </ol>
  </AdminPanel>
</template>

<style scoped lang="scss">
.tl {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.9rem);
  position: relative;

  &__item {
    @include flex(row, flex-start, flex-start, 0.7rem);
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 0.8rem;
      top: 1.8rem;
      bottom: -0.8rem;
      width: 1px;
      background: $line;
    }
  }

  &__dot {
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent;
    font-size: 0.62rem;
    @include flex(row, center, center);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 500;
  }

  &__at,
  &__note {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
