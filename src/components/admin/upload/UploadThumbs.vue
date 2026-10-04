<script setup lang="ts">
import type { useUploadPhotos } from '@/composables/admin/useUploadPhotos'

defineProps<{ photos: ReturnType<typeof useUploadPhotos> }>()
</script>

<template>
  <TransitionGroup v-if="photos.photos.value.length" tag="ul" name="thumb" class="thumbs" aria-label="Fotos del producto">
    <li
      v-for="(p, i) in photos.photos.value"
      :key="p.id"
      class="thumbs__item"
      :class="{ 'thumbs__item--error': p.status === 'error' }"
    >
      <div class="thumbs__plinth">
        <img :src="p.preview" :alt="`Foto ${i + 1}`" />
        <span v-if="i === 0" class="thumbs__cover">Portada</span>

        <div v-if="p.status === 'uploading'" class="thumbs__veil" role="status">
          <span class="thumbs__pct">{{ p.progress }}%</span>
          <span class="thumbs__bar"><span :style="{ transform: `scaleX(${p.progress / 100})` }"></span></span>
        </div>
        <button v-else-if="p.status === 'error'" type="button" class="thumbs__veil thumbs__retry" @click="photos.retry(p.id)">
          <i class="fa-solid fa-rotate-right"></i>
          <span>Reintentar</span>
        </button>

        <button type="button" class="thumbs__remove" :aria-label="`Quitar foto ${i + 1}`" @click="photos.remove(p.id)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <button
        v-if="i > 0"
        type="button"
        class="thumbs__make"
        :disabled="p.status !== 'done'"
        @click="photos.makeCover(p.id)"
      >
        Hacer portada
      </button>
      <span v-else class="thumbs__make thumbs__make--on"><i class="fa-solid fa-star"></i> Portada</span>
    </li>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.thumbs {
  list-style: none;
  @include flex(row, flex-start, flex-start, 0.6rem);
  overflow-x: auto;
  padding: 0.2rem 0.1rem 0.4rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;

  &__item {
    flex: 0 0 116px;
    @include flex(column, stretch, flex-start, 0.35rem);
    scroll-snap-align: start;
  }

  &__plinth {
    @include plinth(14px);
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;

    img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__item--error &__plinth {
    outline: 2px solid $danger;
    outline-offset: -2px;
  }

  &__cover {
    position: absolute;
    left: 0.35rem;
    bottom: 0.35rem;
    z-index: 3;
    font-family: $font-mono;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.2rem 0.45rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    text-transform: uppercase;
  }

  &__veil {
    position: absolute;
    inset: 0;
    z-index: 2;
    @include flex(column, center, center, 0.4rem);
    padding: 0.6rem;
    background: rgba($accent-deep, 0.55);
    color: $surface;
  }

  &__pct {
    font-family: $font-mono;
    font-size: 0.82rem;
    font-weight: 700;
  }

  &__bar {
    width: 80%;
    height: 4px;
    border-radius: $radius-pill;
    background: rgba(#fff, 0.3);
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: #fff;
      transform-origin: left;
      transition: transform $dur $ease-out;
    }
  }

  &__retry {
    background: rgba($danger, 0.78);
    font-size: 0.8rem;
    font-weight: 600;
  }

  &__remove {
    // tap-target primero: pone position relative y aquí se pisa con absolute.
    @include tap-target;
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    z-index: 4;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba($ink, 0.68);
    color: $surface;
    font-size: 0.85rem;
  }

  &__make {
    min-height: 44px;
    border-radius: $radius-sm;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.78rem;
    font-weight: 600;
    color: $ink-soft;

    &:disabled {
      opacity: 0.4;
    }

    &--on {
      @include flex(row, center, center, 0.3rem);
      border-color: transparent;
      background: $accent-soft;
      color: $accent-deep;
    }
  }
}

.thumb-move,
.thumb-enter-active,
.thumb-leave-active {
  transition:
    transform $dur $ease-out,
    opacity $dur $ease-out;
}
.thumb-enter-from,
.thumb-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.thumb-leave-active {
  position: absolute;
}

@include reduced-motion {
  .thumb-move,
  .thumb-enter-active,
  .thumb-leave-active {
    transition: none;
  }
}
</style>
