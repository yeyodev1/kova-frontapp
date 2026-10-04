<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { orderCopy } from '@/config/site'

const props = defineProps<{ value: string; label?: string; dark?: boolean }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
  } catch {
    // Sin permiso de portapapeles (iOS viejo, http): el dato igual está a la vista.
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <button
    type="button"
    class="copy"
    :class="{ 'copy--done': copied, 'copy--dark': dark }"
    :aria-label="`${orderCopy.copy} ${label || value}`"
    @click="copy"
  >
    <Transition name="copy-swap" mode="out-in">
      <span v-if="copied" key="ok" class="copy__inner">
        <i class="fa-solid fa-check" aria-hidden="true"></i> {{ orderCopy.copied }}
      </span>
      <span v-else key="copy" class="copy__inner">
        <i class="fa-regular fa-copy" aria-hidden="true"></i> {{ orderCopy.copy }}
      </span>
    </Transition>
    <span class="visually-hidden" aria-live="polite">{{ copied ? orderCopy.copied : '' }}</span>
  </button>
</template>

<style scoped lang="scss">
.copy {
  @include flex(row, center, center);
  @include focus-ring;
  flex-shrink: 0;
  min-width: 6.25rem;
  min-height: 2.75rem;
  padding: 0.35rem 0.9rem;
  border-radius: $radius-pill;
  border: 1px solid $alu-dark;
  background: $surface;
  color: $accent-deep;
  font-size: $text-sm;
  font-weight: 700;
  transition:
    transform $dur-fast $ease-out,
    background-color $dur ease,
    border-color $dur ease,
    color $dur ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.95);
  }

  &__inner {
    @include flex(row, center, center, 0.4rem);
  }

  &--done {
    background: $success;
    border-color: $success;
    color: $surface;

    i {
      animation: pop 0.38s $ease-spring;
    }
  }

}

.copy--dark:not(.copy--done) {
  background: rgba(#fff, 0.1);
  border-color: rgba(#fff, 0.35);
  color: #fff;
}

.copy-swap-enter-active,
.copy-swap-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s $ease-out;
}
.copy-swap-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.copy-swap-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
