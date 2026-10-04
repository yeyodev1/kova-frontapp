<script setup lang="ts">
import { trustSeals } from '@/config/site'

defineProps<{ light?: boolean }>()
</script>

<template>
  <ul class="seals" :class="{ 'seals--light': light }">
    <li v-for="seal in trustSeals" :key="seal.label" class="seals__item">
      <i :class="seal.icon" aria-hidden="true"></i>
      <span>{{ seal.label }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.seals {
  list-style: none;
  @include flex(row, center, flex-start, 0.4rem 0.9rem);
  flex-wrap: wrap;
  font-size: $text-xs;
  font-weight: 500;
  color: $ink-soft;

  &__item {
    @include flex(row, center, flex-start, 0.4rem);
    white-space: nowrap;

    i {
      color: $accent;
      font-size: 0.8em;
    }
  }

  &--light {
    color: rgba($surface, 0.85);

    i {
      color: $sage;
    }
  }
}
</style>
