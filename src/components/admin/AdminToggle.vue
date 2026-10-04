<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; busy?: boolean; hideLabel?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="tgl"
    :class="{ 'tgl--on': modelValue, 'tgl--busy': busy }"
    :aria-checked="modelValue"
    :aria-label="hideLabel ? label : undefined"
    :disabled="busy"
    @click.stop.prevent="emit('update:modelValue', !modelValue)"
  >
    <span class="tgl__track"><span class="tgl__thumb"></span></span>
    <span v-if="!hideLabel" class="tgl__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.tgl {
  @include flex(row, center, flex-start, 0.5rem);
  font-size: $text-sm;
  color: $ink-soft;

  &__track {
    width: 2.4rem;
    height: 1.4rem;
    border-radius: $radius-pill;
    background: $line;
    position: relative;
    flex-shrink: 0;
    @include transition(background);
  }

  &__thumb {
    position: absolute;
    top: 0.15rem;
    left: 0.15rem;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }

  &--on &__track {
    background: $accent;
  }

  &--on &__thumb {
    transform: translateX(1rem);
  }

  &--busy {
    opacity: 0.5;
  }
}
</style>
