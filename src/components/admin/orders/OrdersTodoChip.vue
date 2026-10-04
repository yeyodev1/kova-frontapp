<script setup lang="ts">
defineProps<{ active: boolean; count: number }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="todo"
    :class="{ 'todo--active': active, 'todo--busy': count > 0 }"
    :aria-pressed="active"
    @click="emit('select')"
  >
    <i class="fa-solid fa-list-check" aria-hidden="true"></i>
    Por gestionar
    <span class="todo__count" :aria-label="`${count} pedidos por gestionar`">{{ count }}</span>
  </button>
</template>

<style scoped lang="scss">
// Filtro principal de Pedidos: se distingue de los chips de estado sin usar el cobre de compra.
.todo {
  @include flex(row, center, flex-start, 0.45rem);
  flex-shrink: 0;
  font-size: $text-xs;
  font-weight: 700;
  padding: 0.42rem 0.5rem 0.42rem 0.8rem;
  border-radius: $radius-pill;
  border: 1.5px solid $accent-deep;
  background: $surface;
  color: $accent-deep;
  white-space: nowrap;
  transition:
    background-color $dur $ease-out,
    color $dur $ease-out,
    transform $dur-fast $ease-out;

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    @include focus-ring;
  }

  &__count {
    min-width: 1.5rem;
    padding: 0.2rem 0.45rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
    font-family: $font-mono;
    font-size: 0.72rem;
    text-align: center;
  }

  &--busy &__count {
    background: $warning-bg;
    color: darken($warning, 22%);
  }

  &--active {
    background: $accent-deep;
    color: $surface;
  }

  &--active#{&}--busy &__count {
    background: $warning;
    color: $accent-deep;
  }

  @include reduced-motion {
    &:active {
      transform: none;
    }
  }
}
</style>
