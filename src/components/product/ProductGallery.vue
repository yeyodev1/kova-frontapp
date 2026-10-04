<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ images: string[]; title: string }>()

const track = ref<HTMLElement | null>(null)
const active = ref(0)
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

watch(
  () => props.images,
  () => {
    active.value = 0
    track.value?.scrollTo({ left: 0 })
  },
)
</script>

<template>
  <div class="gallery">
    <div class="gallery__frame">
      <div
        ref="track"
        class="gallery__track"
        tabindex="0"
        role="region"
        :aria-label="`Fotos de ${title}`"
        @scroll.passive="onScroll"
      >
        <div v-for="(src, i) in images" :key="src + i" class="gallery__slide">
          <img
            :src="src"
            :alt="i === 0 ? title : `${title}, foto ${i + 1}`"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'auto'"
            decoding="async"
            width="800"
            height="800"
          />
        </div>
        <div v-if="!images.length" class="gallery__slide gallery__slide--empty">
          <i class="fa-solid fa-image" aria-hidden="true"></i>
        </div>
      </div>

      <template v-if="images.length > 1">
        <button class="gallery__arrow gallery__arrow--prev" aria-label="Foto anterior" :disabled="active === 0" @click="go(active - 1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          class="gallery__arrow gallery__arrow--next"
          aria-label="Foto siguiente"
          :disabled="active === images.length - 1"
          @click="go(active + 1)"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <span class="gallery__counter">{{ active + 1 }} / {{ images.length }}</span>
      </template>
    </div>

    <div v-if="images.length > 1" class="gallery__thumbs">
      <button
        v-for="(src, i) in images"
        :key="'t' + src + i"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === active }"
        :aria-label="`Ver foto ${i + 1}`"
        :aria-current="i === active"
        @click="go(i)"
      >
        <img :src="src" alt="" loading="lazy" width="80" height="80" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;

  &__frame {
    position: relative;
    // En móvil la galería va de borde a borde para que la foto mande.
    margin-inline: -1.25rem;

    @include from('md') {
      margin-inline: 0;
      border-radius: $radius-md;
      overflow: hidden;
    }
  }

  &__track {
    @include flex(row, stretch, flex-start);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
    background: $sand;

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
      object-fit: cover;
    }

    &--empty {
      @include flex(row, center, center);
      font-size: 3rem;
      color: $ink-muted;
    }
  }

  &__arrow {
    display: none;

    @include from('md') {
      @include flex(row, center, center);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: rgba($surface, 0.92);
      box-shadow: $shadow-sm;
    }

    &--prev {
      left: 0.75rem;
    }

    &--next {
      right: 0.75rem;
    }

    &:disabled {
      opacity: 0;
    }
  }

  &__counter {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    font-size: $text-xs;
    font-weight: 600;
    background: rgba($ink, 0.65);
    color: $surface;
    padding: 0.2rem 0.6rem;
    border-radius: $radius-pill;
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
    padding-block: 0.15rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__thumb {
    flex: 0 0 3.75rem;
    height: 3.75rem;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 2px solid transparent;
    opacity: 0.65;
    @include transition;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--active {
      border-color: $accent;
      opacity: 1;
    }

    @include from('md') {
      flex-basis: 4.5rem;
      height: 4.5rem;
    }
  }
}
</style>
