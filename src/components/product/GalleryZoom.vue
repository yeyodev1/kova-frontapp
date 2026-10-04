<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { productCopy } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'

/**
 * Foto a pantalla completa. BaseModal trae botones de confirmar/cancelar,
 * así que esto es una capa propia mínima: swipe con scroll-snap, Esc y flechas.
 */
const props = defineProps<{ open: boolean; images: string[]; title: string; index: number }>()
const emit = defineEmits<{ close: []; 'update:index': [index: number] }>()

useBodyScroll(toRef(props, 'open'))

const track = ref<HTMLElement | null>(null)
const current = ref(props.index)
let frame = 0

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const el = track.value
    if (!el?.clientWidth) return
    current.value = Math.round(el.scrollLeft / el.clientWidth)
  })
}

function go(i: number) {
  const el = track.value
  if (!el || i < 0 || i >= props.images.length) return
  el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
}

function close() {
  emit('update:index', current.value)
  emit('close')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') go(current.value + 1)
  if (e.key === 'ArrowLeft') go(current.value - 1)
}

watch(
  () => props.open,
  async (open) => {
    if (!open) return window.removeEventListener('keydown', onKey)
    window.addEventListener('keydown', onKey)
    current.value = props.index
    await nextTick()
    const el = track.value
    if (el) el.scrollLeft = props.index * el.clientWidth
    el?.focus()
  },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="zoom">
      <div
        v-if="open"
        class="zoom"
        role="dialog"
        aria-modal="true"
        :aria-label="productCopy.photos(title)"
      >
        <div ref="track" class="zoom__track" tabindex="-1" @scroll.passive="onScroll">
          <div v-for="(src, i) in images" :key="src + i" class="zoom__slide" @click.self="close">
            <img :src="src" :alt="productCopy.photoAlt(title, i + 1)" decoding="async" />
          </div>
        </div>

        <button class="zoom__close" :aria-label="productCopy.closeZoom" @click="close">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <span v-if="images.length > 1" class="zoom__counter"
          >{{ current + 1 }} / {{ images.length }}</span
        >
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.zoom {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: radial-gradient(120% 80% at 50% 0%, #ffffff 0%, $alu-light 50%, $alu 100%);

  &__track {
    @include flex(row, stretch, flex-start);
    height: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    outline: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__slide {
    flex: 0 0 100%;
    @include flex(row, center, center);
    scroll-snap-align: center;
    padding: 4.5rem 1rem;

    img {
      max-height: 100%;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
  }

  &__close {
    @include flex(row, center, center);
    position: absolute;
    top: calc(1rem + env(safe-area-inset-top));
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $ink;
    color: $surface;
    font-size: 1.1rem;
    transition: transform $dur-fast $ease-out;

    &:active {
      transform: scale(0.92);
    }
  }

  &__counter {
    position: absolute;
    left: 50%;
    bottom: calc(1.5rem + env(safe-area-inset-bottom));
    transform: translateX(-50%);
    font-family: $font-mono;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    color: $ink-soft;
  }
}

.zoom-enter-active,
.zoom-leave-active {
  transition: opacity $dur $ease-out;

  .zoom__track {
    transition: transform $dur $ease-out;
  }
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;

  .zoom__track {
    transform: scale(0.94);
  }
}
</style>
