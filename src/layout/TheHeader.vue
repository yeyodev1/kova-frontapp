<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site, layoutCopy } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import BrandMark from '@/components/layout/BrandMark.vue'
import HeaderSearch from '@/components/layout/HeaderSearch.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'

const route = useRoute()
const cart = useCartStore()
const mobileOpen = ref(false)
const searchOpen = ref(false)
const scrolled = ref(false)
// Cambia solo cuando el contador sube: reinicia la animación "pop" sin disparar al cargar.
const bump = ref(0)

watch(
  () => cart.count,
  (next, prev) => {
    if (next > prev) bump.value++
  },
)

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    searchOpen.value = false
  },
)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  mobileOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled || searchOpen }">
    <div class="header__inner">
      <button
        class="header__icon header__burger"
        :aria-label="layoutCopy.openMenu"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="mobileOpen = true"
      >
        <span class="header__bars" aria-hidden="true"><span></span><span></span></span>
      </button>

      <RouterLink to="/" class="header__logo" :aria-label="layoutCopy.home">
        <BrandMark />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <button
          class="header__icon"
          :class="{ 'is-active': searchOpen }"
          :aria-label="layoutCopy.search"
          :aria-expanded="searchOpen"
          @click="toggleSearch"
        >
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        </button>
        <button
          class="header__icon header__cart"
          :aria-label="`${layoutCopy.cart}: ${cart.count}`"
          @click="cart.isOpen = true"
        >
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <span v-if="cart.count" :key="bump" class="header__count" :class="{ 'is-pop': bump > 0 }">
            {{ cart.count }}
          </span>
        </button>
      </div>
    </div>

    <HeaderSearch v-model="searchOpen" />
    <MobileMenu :open="mobileOpen" @close="mobileOpen = false" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;

  // El fondo translúcido vive en un pseudo-elemento: así el blur no convierte
  // al header en contenedor de los hijos fijos y solo animamos opacidad.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: rgba($paper, 0.78);
    backdrop-filter: blur(16px) saturate(1.5);
    -webkit-backdrop-filter: blur(16px) saturate(1.5);
    border-bottom: 1px solid rgba($alu-dark, 0.35);
    box-shadow: 0 10px 30px -18px rgba($ink, 0.25);
    opacity: 0;
    transition: opacity $dur $ease-out;
  }

  &--scrolled::before {
    opacity: 1;
  }

  &__inner {
    @include container(1200px);
    @include flex(row, center, space-between, 0.5rem);
    position: relative;
    height: 4rem;

    @include from('md') {
      height: 4.5rem;
    }
  }

  &__logo {
    border-radius: 12px;
    transform-origin: left center;
    transition: transform $dur $ease-out;

    @include until('md') {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      transform-origin: center;
    }
  }

  &--scrolled &__logo {
    transform: scale(0.9);

    @include until('md') {
      transform: translateX(-50%) scale(0.9);
    }
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, center, 2.25rem);
      flex: 1;
    }
  }

  &__link {
    @include eyebrow;
    position: relative;
    color: $ink-soft;
    padding: 0.6rem 0;
    transition: color $dur $ease-out;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.25rem;
      height: 1.5px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform $dur $ease-out;
    }

    &:hover,
    &.router-link-exact-active {
      color: $accent-deep;

      &::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.15rem);
  }

  &__icon {
    position: relative;
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 1.1rem;
    color: $ink;
    transition:
      background-color $dur-fast $ease-out,
      transform $dur-fast $ease-out;
    -webkit-tap-highlight-color: transparent;

    &:hover,
    &.is-active {
      background: rgba($alu, 0.55);
    }

    &:active {
      transform: scale(0.92);
    }
  }

  &__burger {
    @include from('md') {
      display: none;
    }
  }

  &__bars {
    @include flex(column, flex-start, center, 5px);
    width: 1.2rem;

    span {
      display: block;
      height: 2px;
      width: 100%;
      border-radius: 2px;
      background: currentColor;
    }

    span:last-child {
      width: 65%;
    }
  }

  &__count {
    position: absolute;
    top: 0.15rem;
    right: 0;
    min-width: 1.2rem;
    height: 1.2rem;
    padding: 0 0.3rem;
    border-radius: $radius-pill;
    background: $cta;
    color: $surface;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 600;
    line-height: 1.2rem;
    text-align: center;
    box-shadow: 0 0 0 2px $paper;

    &.is-pop {
      animation: pop 0.45s $ease-spring;
    }
  }
}
</style>
