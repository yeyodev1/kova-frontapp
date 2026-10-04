<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatCents } from '@/utils/format'

/**
 * Precio que "rueda" al cambiar: el valor viejo sale hacia arriba y el nuevo
 * entra desde abajo (o al revés si baja). Solo transform/opacity.
 */
const props = defineProps<{ cents: number }>()

const direction = ref<'up' | 'down'>('up')
watch(
  () => props.cents,
  (now, before) => (direction.value = now >= before ? 'up' : 'down'),
)
const text = computed(() => formatCents(props.cents))
</script>

<template>
  <span class="roll" aria-live="polite">
    <Transition :name="`roll-${direction}`">
      <span :key="text" class="roll__value">{{ text }}</span>
    </Transition>
  </span>
</template>

<style scoped lang="scss">
.roll {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  vertical-align: bottom;
  font-variant-numeric: tabular-nums;

  &__value {
    display: inline-block;
  }
}

.roll-up-enter-active,
.roll-up-leave-active,
.roll-down-enter-active,
.roll-down-leave-active {
  transition:
    transform $dur $ease-out,
    opacity $dur $ease-out;
}

// El valor saliente se apila encima para que el ancho no salte.
.roll-up-leave-active,
.roll-down-leave-active {
  position: absolute;
  left: 0;
  top: 0;
}

.roll-up-enter-from,
.roll-down-leave-to {
  transform: translateY(70%);
  opacity: 0;
}

.roll-up-leave-to,
.roll-down-enter-from {
  transform: translateY(-70%);
  opacity: 0;
}
</style>
