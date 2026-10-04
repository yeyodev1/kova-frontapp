<script setup lang="ts">
defineProps<{ options: { value: string; label: string }[]; modelValue: string; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="chips" role="group" :aria-label="label">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="chips__item"
      :class="{ 'chips__item--active': opt.value === modelValue }"
      :aria-pressed="opt.value === modelValue"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
// En móvil los chips se deslizan en una fila; no se apilan en 4 renglones.
.chips {
  @include flex(row, center, flex-start, 0.4rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
  }

  &__item {
    flex-shrink: 0;
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.5rem 0.85rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    color: $ink-soft;
    white-space: nowrap;
    @include transition(background);

    &--active {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }
}
</style>
