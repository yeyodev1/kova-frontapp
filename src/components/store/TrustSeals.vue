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
  @include flex(row, center, flex-start, 0.5rem 1rem);
  flex-wrap: wrap;
  font-size: $text-xs;
  color: $ink-soft;

  &__item {
    @include flex(row, center, flex-start, 0.4rem);

    i {
      color: $accent;
    }
  }

  &--light {
    color: rgba($surface, 0.9);

    i {
      color: $silver;
    }
  }
}
</style>
