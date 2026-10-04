<script setup lang="ts">
import { computed } from 'vue'
import { formatCents } from '@/utils/format'

// Monto que cambia con un deslizamiento corto: el cliente ve que el total se actualizó.
const props = defineProps<{ cents: number | null | undefined; placeholder?: string }>()
const text = computed(() => (props.cents == null ? props.placeholder || '—' : formatCents(props.cents)))
</script>

<template>
  <span class="ticker" aria-live="polite">
    <Transition name="ticker" mode="out-in">
      <span :key="text" class="ticker__value">{{ text }}</span>
    </Transition>
  </span>
</template>

<style scoped lang="scss">
.ticker {
  display: inline-flex;
  overflow: hidden;
  vertical-align: bottom;
  font-variant-numeric: tabular-nums;

  &__value {
    display: inline-block;
  }
}

.ticker-enter-active,
.ticker-leave-active {
  transition:
    transform 0.22s $ease-out,
    opacity 0.22s ease;
}
.ticker-enter-from {
  transform: translateY(60%);
  opacity: 0;
}
.ticker-leave-to {
  transform: translateY(-60%);
  opacity: 0;
}
</style>
