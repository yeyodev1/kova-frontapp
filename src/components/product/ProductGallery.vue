<script setup lang="ts">
import { ref, watch } from 'vue'
import { productCopy } from '@/config/site'
import GalleryZoom from './GalleryZoom.vue'
import GalleryThumbs from './GalleryThumbs.vue'

const props = defineProps<{ images: string[]; title: string }>()

const track = ref<HTMLElement | null>(null)
const active = ref(0)
const glinting = ref(false)
const zoomOpen = ref(false)
let frame = 0

// Swipe nativo con scroll-snap: el índice activo sale de la posición del scroll.
function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const el = track.value
    if (!el || !el.clientWidth) return
    active.value = Math.round(el.scrollLeft / el.clientWidth)
  })
}

function go(index: number) {
  const el = track.value
  if (!el) return
  el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  active.value = index
}

// Firma de la marca: un destello cruza la peana cuando llega la primera foto.
function onFirstLoad(i: number) {
  if (i === 0) glinting.value = true
}

watch(
  () => props.images,
  () => {
    active.value = 0
    glinting.value = false
    track.value?.scrollTo({ left: 0 })
  },
)
</script>

<template>
  <div class="gallery">
    <div class="gallery__frame" :class="{ 'is-glinting': glinting }">
      <div
        ref="track"
        class="gallery__track"
        tabindex="0"
        role="region"
        :aria-label="productCopy.photos(title)"
        @scroll.passive="onScroll"
      >
        <div v-for="(src, i) in images" :key="src + i" class="gallery__slide">
          <img
            :src="src"
            :alt="i === 0 ? title : productCopy.photoAlt(title, i + 1)"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'auto'"
            decoding="async"
            width="800"
            height="800"
            @load="onFirstLoad(i)"
            @click="zoomOpen = true"
          />
        </div>
        <div v-if="!images.length" class="gallery__slide gallery__slide--empty">
          <i class="fa-solid fa-image" aria-hidden="true"></i>
        </div>
      </div>

      <button
        v-if="images.length"
        class="gallery__zoom"
        :aria-label="productCopy.zoom"
        @click="zoomOpen = true"
      >
        <i class="fa-solid fa-expand" aria-hidden="true"></i>
      </button>

      <template v-if="images.length > 1">
        <button
          class="gallery__arrow gallery__arrow--prev"
          :aria-label="productCopy.prevPhoto"
          :disabled="active === 0"
          @click="go(active - 1)"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          class="gallery__arrow gallery__arrow--next"
          :aria-label="productCopy.nextPhoto"
          :disabled="active === images.length - 1"
          @click="go(active + 1)"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
        <div class="gallery__dots" aria-hidden="true">
          <span v-for="(_, i) in images" :key="i" :class="{ 'is-active': i === active }"></span>
        </div>
        <span class="gallery__counter">{{ active + 1 }} / {{ images.length }}</span>
      </template>
    </div>

    <GalleryThumbs v-if="images.length > 1" :images="images" :active="active" @pick="go" />

    <GalleryZoom
      :index="active"
      :open="zoomOpen"
      :images="images"
      :title="title"
      @close="zoomOpen = false"
      @update:index="go"
    />
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);
  min-width: 0;

  &__frame {
    @include plinth(0);
    @include glint('&.is-glinting', 1.3s, 0.75);
    // En móvil la galería va a sangre, con la base redondeada como una peana.
    margin-inline: -1.25rem;
    border-radius: 0 0 28px 28px;

    @include from('md') {
      margin-inline: 0;
      border-radius: 28px;
    }
  }

  &__track {
    @include flex(row, stretch, flex-start);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    overscroll-behavior-x: contain;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__slide {
    flex: 0 0 100%;
    aspect-ratio: 1 / 1;
    scroll-snap-align: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10%;
      cursor: zoom-in;
      animation: gallery-in $dur-slow $ease-out both;
    }

    &--empty {
      @include flex(row, center, center);
      font-size: 3rem;
      color: $alu-dark;
    }
  }

  %round {
    @include flex(row, center, center);
    position: absolute;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: rgba($surface, 0.85);
    backdrop-filter: blur(6px);
    box-shadow: $shadow-sm;
    color: $ink;
    z-index: 3;
    transition:
      transform $dur-fast $ease-out,
      opacity $dur $ease-out;

    &:active {
      transform: scale(0.92);
    }
  }

  &__zoom {
    @extend %round;
    top: 0.85rem;
    right: 0.85rem;
    font-size: 0.9rem;
  }

  &__arrow {
    @extend %round;
    top: 50%;
    margin-top: -1.375rem;

    @include until('lg') {
      display: none;
    }

    &--prev {
      left: 0.85rem;
    }

    &--next {
      right: 0.85rem;
    }

    &:disabled {
      opacity: 0;
    }
  }

  &__dots {
    position: absolute;
    left: 50%;
    bottom: 1rem;
    transform: translateX(-50%);
    @include flex(row, center, center, 0.35rem);
    z-index: 3;

    span {
      width: 16px;
      height: 3px;
      border-radius: 3px;
      background: $accent-deep;
      opacity: 0.22;
      transform: scaleX(0.45);
      transition:
        transform $dur $ease-out,
        opacity $dur $ease-out;

      &.is-active {
        opacity: 1;
        transform: none;
      }
    }
  }

  &__counter {
    position: absolute;
    left: 1rem;
    bottom: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: $ink-muted;
    z-index: 3;
  }
}

@keyframes gallery-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}
</style>
