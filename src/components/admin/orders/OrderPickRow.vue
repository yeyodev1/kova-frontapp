<script setup lang="ts">
import type { Order } from '@/types'
import OrderRow from '../OrderRow.vue'

defineProps<{ order: Order; selecting: boolean; checked: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="pick" :class="{ 'pick--on': selecting, 'pick--checked': checked }">
    <label v-if="selecting" class="pick__box">
      <input type="checkbox" :checked="checked" @change="emit('toggle')" />
      <span class="visually-hidden">Seleccionar pedido {{ order.number }}</span>
      <i :class="checked ? 'fa-solid fa-square-check' : 'fa-regular fa-square'"></i>
    </label>
    <OrderRow :order="order" class="pick__row" />
  </div>
</template>

<style scoped lang="scss">
.pick {
  @include flex(row, stretch, flex-start, 0.4rem);

  &__row {
    flex: 1 1 0;
    min-width: 0;
  }

  &__box {
    @include flex(row, center, center);
    flex: 0 0 2.4rem;
    margin: 0;
    cursor: pointer;
    font-size: 1.25rem;
    color: $ink-muted;

    input {
      position: absolute;
      opacity: 0;
      width: 1px;
      height: 1px;
    }

    &:focus-within i {
      outline: 2px solid $accent;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &--checked &__box {
    color: $accent;
  }

  @include from('lg') {
    gap: 0;
    border-bottom: 1px solid $line;

    &__box {
      flex-basis: 3rem;
    }

    // La fila ya pone su borde inferior; aquí lo pone el contenedor para cubrir la casilla.
    & &__row {
      border-bottom-width: 0;
    }

    &--checked {
      background: $alu-light;
    }
  }
}
</style>
