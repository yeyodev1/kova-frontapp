<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { checkoutCopy } from '@/config/site'

const props = defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
  valid?: boolean
  select?: boolean
}>()

const control = ref<HTMLElement | null>(null)

// Los atributos de accesibilidad se ponen aquí y no en cada input: así ningún
// campo se queda sin enlazar su mensaje de error o su ayuda.
onMounted(() => {
  watchEffect(() => {
    const el = control.value?.querySelector('input, select, textarea')
    if (!el) return
    const describedBy = props.error ? `${props.id}-error` : props.hint ? `${props.id}-hint` : ''
    if (describedBy) el.setAttribute('aria-describedby', describedBy)
    else el.removeAttribute('aria-describedby')
    el.setAttribute('aria-invalid', props.error ? 'true' : 'false')
  })
})
</script>

<template>
  <div class="ff" :class="{ 'ff--invalid': error, 'ff--valid': valid && !error, 'ff--select': select }">
    <label :for="id" class="ff__label">{{ label }}</label>
    <div ref="control" class="ff__control">
      <slot />
      <i v-if="select" class="fa-solid fa-chevron-down ff__chevron" aria-hidden="true"></i>
      <Transition name="ff-check">
        <span v-if="valid && !error" class="ff__check" role="img" :aria-label="checkoutCopy.validLabel">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg>
        </span>
      </Transition>
    </div>
    <Transition name="ff-msg" mode="out-in">
      <p v-if="error" :id="`${id}-error`" :key="error" class="ff__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
      </p>
      <p v-else-if="hint" :id="`${id}-hint`" class="ff__hint">{{ hint }}</p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.ff {
  @include flex(column, stretch, flex-start);
  min-width: 0;

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    margin-bottom: 0.4rem;
  }

  &__control {
    position: relative;

    :deep(input),
    :deep(select) {
      min-height: 3.25rem;
      padding-inline: 1rem 2.75rem;
      border-radius: 14px;
      border-color: $line;
      background: $surface;
      -webkit-appearance: none;
      appearance: none;

      &::placeholder {
        color: rgba($ink-muted, 0.75);
      }

      &:disabled {
        background: $alu-light;
        color: $ink-muted;
      }
    }

    :deep(select) {
      padding-right: 2.75rem;
      cursor: pointer;
      text-overflow: ellipsis;
    }
  }

  &--select.ff--valid &__control :deep(select) {
    padding-right: 4.25rem;
  }

  &__chevron {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    color: $ink-muted;
    pointer-events: none;
  }

  &__check {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    @include flex(row, center, center);
    width: 1.4rem;
    height: 1.4rem;
    margin-top: -0.7rem;
    border-radius: 50%;
    background: $success;
    pointer-events: none;

    svg {
      width: 0.95rem;
      height: 0.95rem;
      fill: none;
      stroke: $surface;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 16;
      stroke-dashoffset: 0;
      animation: ff-draw 0.36s 0.08s $ease-out backwards;
    }
  }

  &--select &__check {
    right: 2.5rem;
  }

  &--valid &__control :deep(input),
  &--valid &__control :deep(select) {
    border-color: rgba($success, 0.55);
  }

  &--invalid &__control :deep(input),
  &--invalid &__control :deep(select) {
    border-color: $danger;
    background: lighten($danger, 41%);

    &:focus {
      box-shadow: 0 0 0 4px rgba($danger, 0.14);
    }
  }

  &__error,
  &__hint {
    font-size: $text-sm;
    line-height: 1.4;
    margin-top: 0.4rem;
  }

  &__error {
    @include flex(row, baseline, flex-start, 0.4rem);
    color: darken($danger, 6%);
    font-weight: 500;

    i {
      font-size: 0.8rem;
    }
  }

  &__hint {
    color: $ink-muted;
  }
}

@keyframes ff-draw {
  from {
    stroke-dashoffset: 16;
  }
}

.ff-check-enter-active {
  transition:
    transform $dur $ease-spring,
    opacity $dur-fast ease;
}
.ff-check-leave-active {
  transition: opacity $dur-fast ease;
}
.ff-check-enter-from {
  transform: scale(0.4);
  opacity: 0;
}
.ff-check-leave-to {
  opacity: 0;
}

.ff-msg-enter-active,
.ff-msg-leave-active {
  transition:
    opacity $dur-fast ease,
    transform $dur-fast $ease-out;
}
.ff-msg-enter-from,
.ff-msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
