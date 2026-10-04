<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: number; min?: number; max?: number; label?: string }>(), {
  min: 0,
  max: 99,
  label: 'Cantidad',
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function change(delta: number) {
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  if (next !== props.modelValue) emit('update:modelValue', next)
}
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <button type="button" class="stepper__btn" aria-label="Quitar uno" @click="change(-1)">
      <i class="fa-solid fa-minus"></i>
    </button>
    <span class="stepper__value" aria-live="polite">{{ modelValue }}</span>
    <button type="button" class="stepper__btn" aria-label="Agregar uno" :disabled="modelValue >= max" @click="change(1)">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, flex-start);
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $surface;

  &__btn {
    @include flex(row, center, center);
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.75rem;
    color: $ink-soft;

    &:disabled {
      opacity: 0.35;
    }
  }

  &__value {
    min-width: 1.6rem;
    text-align: center;
    font-weight: 600;
    font-size: $text-sm;
  }
}
</style>
