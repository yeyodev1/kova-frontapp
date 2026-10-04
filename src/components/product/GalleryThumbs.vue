<script setup lang="ts">
import { productCopy } from '@/config/site'

defineProps<{ images: string[]; active: number }>()
const emit = defineEmits<{ pick: [index: number] }>()
</script>

<template>
  <div class="thumbs">
    <button
      v-for="(src, i) in images"
      :key="'t' + src + i"
      class="thumbs__item"
      :class="{ 'thumbs__item--active': i === active }"
      :aria-label="productCopy.viewPhoto(i + 1)"
      :aria-current="i === active"
      @click="emit('pick', i)"
    >
      <img :src="src" alt="" loading="lazy" width="80" height="80" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.thumbs {
  @include flex(row, center, flex-start, 0.5rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: 0.2rem;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    @include plinth(12px);
    flex: 0 0 3.9rem;
    height: 3.9rem;
    opacity: 0.6;
    transition:
      opacity $dur $ease-out,
      transform $dur-fast $ease-out;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 2px $accent-deep;
      opacity: 0;
      transition: opacity $dur $ease-out;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 12%;
    }

    &:active {
      transform: scale(0.94);
    }

    &--active {
      opacity: 1;

      &::after {
        opacity: 1;
      }
    }

    @include from('md') {
      flex-basis: 4.75rem;
      height: 4.75rem;
    }
  }
}
</style>
