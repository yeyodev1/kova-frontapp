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
    <button
      type="button"
      class="stepper__btn"
      aria-label="Quitar uno"
      :disabled="modelValue <= min && min > 0"
      @click="change(-1)"
    >
      <i :class="modelValue <= 1 && min === 0 ? 'fa-solid fa-trash-can' : 'fa-solid fa-minus'" aria-hidden="true"></i>
    </button>
    <span class="stepper__value" aria-live="polite">
      <Transition name="tick" mode="out-in">
        <span :key="modelValue">{{ modelValue }}</span>
      </Transition>
    </span>
    <button type="button" class="stepper__btn" aria-label="Agregar uno" :disabled="modelValue >= max" @click="change(1)">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, flex-start);
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $surface;
  box-shadow: inset 0 1px 0 rgba(#fff, 0.9), 0 1px 2px rgba($ink, 0.05);

  &__btn {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 0.75rem;
    color: $ink-soft;
    transition:
      transform $dur-fast $ease-out,
      background-color $dur-fast $ease-out;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: $accent-soft;
      color: $accent-deep;
    }

    &:active {
      transform: scale(0.88);
    }

    &:disabled {
      opacity: 0.35;
    }
  }

  &__value {
    min-width: 1.75rem;
    text-align: center;
    @include price($text-sm, 750);
    overflow: hidden;

    span {
      display: inline-block;
    }
  }
}

.tick-enter-active,
.tick-leave-active {
  transition:
    transform 0.16s $ease-out,
    opacity 0.16s $ease-out;
}
.tick-enter-from {
  opacity: 0;
  transform: translateY(60%);
}
.tick-leave-to {
  opacity: 0;
  transform: translateY(-60%);
}
</style>
