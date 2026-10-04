<script setup lang="ts">
import { ref } from 'vue'
import { orderCopy } from '@/config/site'

// Zona para tocar (abre el selector) o arrastrar el comprobante en escritorio.
const emit = defineEmits<{ pick: [file: File | undefined] }>()
const dragging = ref(false)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('pick', target.files?.[0])
  target.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  emit('pick', event.dataTransfer?.files?.[0])
}
</script>

<template>
  <label
    class="dz"
    :class="{ 'dz--over': dragging }"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <span class="dz__icon" aria-hidden="true"><i class="fa-solid fa-cloud-arrow-up"></i></span>
    <span class="dz__text">{{ dragging ? orderCopy.uploadDropActive : orderCopy.uploadDrop }}</span>
    <span class="dz__cta">{{ orderCopy.uploadCta }}</span>
    <input type="file" accept="image/*,application/pdf" class="visually-hidden" @change="onChange" />
  </label>
</template>

<style scoped lang="scss">
.dz {
  @include flex(column, center, center, 0.45rem);
  margin: 0;
  padding: 1.5rem 1rem;
  border: 1.5px dashed $alu-dark;
  border-radius: 16px;
  background: $alu-light;
  text-align: center;
  cursor: pointer;
  transition:
    border-color $dur ease,
    background-color $dur ease,
    transform $dur-fast $ease-out;

  &:active {
    transform: scale(0.99);
  }

  &:has(input:focus-visible) {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &--over {
    border-color: $accent;
    background: $accent-soft;
  }

  &__icon {
    @include plinth(50%);
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    color: $accent-deep;
    font-size: 1.15rem;
    transition: transform $dur $ease-spring;
  }

  &--over &__icon {
    transform: translateY(-4px) scale(1.06);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 26ch;
  }

  &__cta {
    margin-top: 0.2rem;
    padding: 0.55rem 1.1rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    font-size: $text-sm;
    font-weight: 700;
  }
}
</style>
