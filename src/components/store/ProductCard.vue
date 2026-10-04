<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { productCopy } from '@/config/site'
import PriceTag from './PriceTag.vue'
import CardBadges from '@/components/catalog/CardBadges.vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; eager?: boolean }>()

const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()

const link = computed(() => `/producto/${props.product.slug}`)
const soldOut = computed(() => props.product.stock <= 0)
const needsOption = computed(
  () => props.product.type === 'VARIABLE' && props.product.variants.length > 0,
)

// El destello cruza la peana al pasar el puntero o al tocar; se reinicia quitando la clase.
const glinting = ref(false)
const added = ref(false)
let glintTimer = 0
let addedTimer = 0

function glint() {
  if (glinting.value) return
  glinting.value = true
  glintTimer = window.setTimeout(() => (glinting.value = false), 1100)
}

function quickAdd() {
  // Con variantes hay que elegir talla/color: se lleva a la ficha.
  if (needsOption.value) {
    router.push(link.value)
    return
  }
  cart.add(props.product, null, 1, false)
  toast.success(productCopy.added)
  added.value = true
  glint()
  window.clearTimeout(addedTimer)
  addedTimer = window.setTimeout(() => (added.value = false), 1800)
}

onBeforeUnmount(() => {
  window.clearTimeout(glintTimer)
  window.clearTimeout(addedTimer)
})
</script>

<template>
  <article class="card" :class="{ 'card--soldout': soldOut }" @pointerenter="glint">
    <div class="card__stage">
      <div class="card__media" :class="{ 'is-glinting': glinting }">
        <img
          v-if="product.images[0]"
          :src="product.images[0]"
          alt=""
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          width="400"
          height="400"
        />
        <span v-else class="card__placeholder"
          ><i class="fa-solid fa-image" aria-hidden="true"></i
        ></span>
      </div>

      <CardBadges :product="product" />

      <button
        v-if="!soldOut"
        class="card__add"
        :class="{ 'card__add--done': added }"
        :aria-label="`${needsOption ? productCopy.chooseOptions : productCopy.quickAdd}: ${product.title}`"
        @click="quickAdd"
      >
        <i
          :key="added ? 'ok' : 'add'"
          :class="added ? 'fa-solid fa-check' : 'fa-solid fa-plus'"
          aria-hidden="true"
        ></i>
      </button>
    </div>

    <div class="card__body">
      <RouterLink :to="link" class="card__title">{{ product.title }}</RouterLink>
      <PriceTag :price="product.price" :compare-at="product.compareAtPrice" hide-off />
      <p v-if="product.soldCount > 0" class="card__sold">
        {{ productCopy.sold(product.soldCount) }}
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  @include flex(column, stretch, flex-start);
  padding: 0.35rem;
  background: $surface;
  border: 1px solid rgba($line, 0.8);
  border-radius: 20px;
  transition: transform $dur $ease-out;
  -webkit-tap-highlight-color: transparent;

  // La sombra de hover vive en un pseudo y solo anima opacity.
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: $shadow-md;
    opacity: 0;
    transition: opacity $dur $ease-out;
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);

      &::after {
        opacity: 1;
      }
    }

    &:hover .card__media img {
      transform: scale(1.045);
    }
  }

  &:has(.card__title:focus-visible) {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &__stage {
    position: relative;
  }

  &__media {
    @include plinth(16px);
    @include glint('&.is-glinting', 1s, 0.7);
    display: block;
    aspect-ratio: 1 / 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 9%;
      transition: transform $dur-slow $ease-out;
    }
  }

  &--soldout &__media img {
    opacity: 0.45;
    filter: grayscale(1);
  }

  &__placeholder {
    @include flex(row, center, center);
    height: 100%;
    color: $alu-dark;
    font-size: 2rem;
  }

  // Botón rápido sobre la esquina de la peana: cobre porque es compra.
  &__add {
    @include tap-target;
    position: absolute;
    right: 0.55rem;
    bottom: 0.55rem;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    @include flex(row, center, center);
    background: linear-gradient(180deg, lighten($cta, 4%), $cta 60%, $cta-deep);
    color: $surface;
    font-size: 0.95rem;
    box-shadow:
      inset 0 1px 0 rgba(#fff, 0.3),
      0 6px 14px -4px rgba($cta-deep, 0.6);
    transition: transform $dur-fast $ease-out;
    z-index: 3;

    &:active {
      transform: scale(0.9);
    }

    i {
      animation: pop 0.42s $ease-spring;
    }

    &--done {
      background: $accent;
      box-shadow: 0 6px 14px -4px rgba($accent-deep, 0.6);
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.3rem);
    padding: 0.7rem 0.45rem 0.5rem;
    flex: 1;

    @include from('md') {
      padding: 0.85rem 0.6rem 0.6rem;
    }
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
    outline: none;

    // Toda la tarjeta es clickeable sin anidar enlaces.
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
    }
  }

  &__sold {
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  @include reduced-motion {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
