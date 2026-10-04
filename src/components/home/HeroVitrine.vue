<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { home, site } from '@/config/site'
import { formatCents } from '@/utils/format'
import { useRotator } from './useRotator'
import VitrineControls from './VitrineControls.vue'
import type { Product } from '@/types'

const props = defineProps<{ products: Product[]; loading: boolean }>()

const count = computed(() => props.products.length)
const { index, go, next, prev, pause, resume } = useRotator(count)
const current = computed(() => props.products[index.value])
const glinting = ref(false)
let touchX = 0

// El destello cruza la peana cada vez que entra un producto nuevo.
async function glint() {
  glinting.value = false
  await nextTick()
  requestAnimationFrame(() => (glinting.value = true))
}

watch(() => current.value?._id, (id) => id && glint(), { immediate: true })

function onTouchStart(event: TouchEvent) {
  touchX = event.touches[0]?.clientX ?? 0
  pause()
}

function onTouchEnd(event: TouchEvent) {
  const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX
  if (Math.abs(dx) > 40) {
    if (dx < 0) next()
    else prev()
  }
  // Tras tocar, la vitrina espera un rato antes de volver a girar sola.
  resume(6000)
}
</script>

<template>
  <div
    class="vitrine"
    :aria-busy="loading"
    @pointerenter="pause"
    @pointerleave="resume()"
    @focusin="pause"
    @focusout="resume()"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
  >
    <span class="vitrine__halo" aria-hidden="true"></span>

    <div class="vitrine__stage" :class="{ 'is-glinting': glinting }" @animationend="glinting = false">
      <p class="vitrine__label">
        <span>{{ home.vitrine.label }}</span>
        <span v-if="count > 1" class="vitrine__counter">{{ index + 1 }}/{{ count }}</span>
      </p>

      <Transition name="swap">
        <RouterLink
          v-if="current"
          :key="current._id"
          :to="`/producto/${current.slug}`"
          class="vitrine__product"
          :aria-label="`${home.vitrine.view}: ${current.title}`"
        >
          <img
            :src="current.images[0]"
            :alt="current.title"
            width="560"
            height="560"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
          />
        </RouterLink>
        <div v-else-if="!loading" class="vitrine__fallback">
          <img :src="site.logo" alt="" width="160" height="160" />
          <strong>{{ home.vitrine.fallbackTitle }}</strong>
          <span>{{ home.vitrine.fallbackText }}</span>
        </div>
        <span v-else class="vitrine__loading" aria-hidden="true"></span>
      </Transition>
      <span class="vitrine__floor" aria-hidden="true"></span>
    </div>
    <span class="vitrine__base" aria-hidden="true"></span>

    <Transition name="chip" mode="out-in">
      <RouterLink v-if="current" :key="current._id" :to="`/producto/${current.slug}`" class="vitrine__chip">
        <span class="vitrine__name">{{ current.title }}</span>
        <span class="vitrine__price">{{ formatCents(current.price) }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </Transition>

    <VitrineControls v-if="count > 1" :count="count" :index="index" @prev="prev" @next="next" @go="go" />
  </div>
</template>

<style scoped lang="scss">
.vitrine {
  position: relative;
  @include flex(column, stretch, flex-start);
  width: 100%;
  max-width: 520px;
  margin-inline: auto;

  &__halo {
    position: absolute;
    inset: -12% -18% 4%;
    background: radial-gradient(closest-side, rgba(#fff, 0.95), rgba(#fff, 0.35) 55%, transparent);
    pointer-events: none;
  }

  &__stage {
    @include plinth(28px);
    @include glint('&:hover', 1.3s, 0.65);
    aspect-ratio: 1 / 0.92;
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.95),
      inset 0 -2px 0 rgba($alu-dark, 0.35),
      0 30px 60px -30px rgba($accent-deep, 0.45);
  }

  &__label {
    @include eyebrow;
    @include flex(row, center, space-between);
    position: absolute;
    inset: 1rem 1.1rem auto;
    z-index: 3;
    color: $ink-muted;
  }

  &__counter {
    font-variant-numeric: tabular-nums;
  }

  &__product,
  &__fallback,
  &__loading {
    position: absolute;
    inset: 0;
    @include flex(column, center, center);
  }

  &__product {
    padding: 13% 12% 16%;
    z-index: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform $dur-slow $ease-out;
    }

    &:hover img {
      transform: scale(1.03) translateY(-4px);
    }
  }

  &__floor {
    position: absolute;
    left: 22%;
    right: 22%;
    bottom: 11%;
    height: 7%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba($accent-deep, 0.22), transparent);
  }

  &__fallback {
    gap: 0.4rem;
    padding: 2rem;
    text-align: center;

    img {
      width: 34%;
      border-radius: 18px;
      mix-blend-mode: normal;
      box-shadow: $shadow-md;
      margin-bottom: 0.6rem;
    }

    strong {
      @include display($text-lg, 750, 115%);
    }

    span {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &__loading::before {
    content: '';
    width: 46%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba($alu-dark, 0.25), transparent);
    animation: breathe 1.6s ease-in-out infinite alternate;
  }

  // El escalón de la peana: da volumen sin usar 3D.
  &__base {
    display: block;
    height: 14px;
    margin: 0 5%;
    border-radius: 0 0 14px 14px;
    background: linear-gradient(180deg, $alu 0%, $alu-dark 100%);
    box-shadow: 0 18px 30px -16px rgba($ink, 0.35);
  }

  &__chip {
    @include flex(row, center, flex-start, 0.6rem);
    align-self: center;
    max-width: calc(100% - 1rem);
    margin-top: -2.2rem;
    position: relative;
    z-index: 4;
    padding: 0.55rem 0.6rem 0.55rem 1rem;
    border-radius: $radius-pill;
    background: rgba($surface, 0.92);
    backdrop-filter: blur(10px);
    box-shadow: $shadow-md;
    border: 1px solid rgba($alu-dark, 0.35);

    i {
      @include flex(row, center, center);
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: $accent-deep;
      color: $surface;
      font-size: 0.75rem;
    }
  }

  &__name {
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  &__price {
    @include price($text-base);
    color: $accent-deep;
    flex-shrink: 0;
  }
}

.swap-enter-active {
  transition:
    opacity 0.7s $ease-out,
    transform 0.9s $ease-out;
}
.swap-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}
.swap-enter-from {
  opacity: 0;
  transform: scale(1.06);
}
.swap-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.chip-enter-active,
.chip-leave-active {
  transition:
    opacity 0.25s $ease-out,
    transform 0.35s $ease-out;
}
.chip-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.chip-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes breathe {
  to {
    opacity: 0.4;
    transform: scale(0.9);
  }
}
</style>
