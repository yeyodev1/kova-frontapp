<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site, layoutCopy, catalog } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const mobileOpen = ref(false)
const searchOpen = ref(false)
const term = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

useBodyScroll(mobileOpen)

// Al navegar se cierran el menú y el buscador.
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    searchOpen.value = false
  },
)

async function toggleSearch() {
  searchOpen.value = !searchOpen.value
  mobileOpen.value = false
  if (searchOpen.value) {
    term.value = String(route.query.q || '')
    await nextTick()
    searchInput.value?.focus()
  }
}

function submitSearch() {
  const q = term.value.trim()
  router.push({ path: '/tienda', query: q ? { q } : {} })
  searchOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <button
        class="header__icon header__burger"
        :aria-label="mobileOpen ? layoutCopy.closeMenu : layoutCopy.openMenu"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>

      <RouterLink to="/" class="header__logo" :aria-label="`${site.name}, inicio`">
        <img :src="site.logo" alt="" width="36" height="36" />
        <span>{{ site.name.toUpperCase() }}</span>
      </RouterLink>

      <nav class="header__nav" :class="{ 'header__nav--open': mobileOpen }" aria-label="Principal">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <button class="header__icon" :aria-label="layoutCopy.search" :aria-expanded="searchOpen" @click="toggleSearch">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button class="header__icon header__cart" :aria-label="`${layoutCopy.cart}: ${cart.count}`" @click="cart.isOpen = true">
          <i class="fa-solid fa-bag-shopping"></i>
          <span v-if="cart.count" class="header__count">{{ cart.count }}</span>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <form v-if="searchOpen" class="header__search" role="search" @submit.prevent="submitSearch">
        <label for="header-search" class="visually-hidden">{{ catalog.searchPlaceholder }}</label>
        <input
          id="header-search"
          ref="searchInput"
          v-model="term"
          type="search"
          enterkeyhint="search"
          :placeholder="catalog.searchPlaceholder"
          autocomplete="off"
        />
        <button type="submit" class="btn btn--primary">{{ layoutCopy.search }}</button>
      </form>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba($paper, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $line;

  &__inner {
    @include container;
    @include flex(row, center, space-between, 0.5rem);
    position: relative;
    min-height: 3.75rem;
  }

  &__logo {
    @include flex(row, center, flex-start, 0.55rem);
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: 0.14em;
    color: $accent-deep;

    img {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 9px;
      object-fit: cover;
    }

    // En móvil el logo queda centrado entre el menú y las acciones.
    @include until('md') {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, center, 1.75rem);
      flex: 1;
    }

    &--open {
      @include until('md') {
        @include flex(column, stretch, flex-start, 0.25rem);
        position: fixed;
        inset: 3.75rem 0 0;
        background: $paper;
        padding: 1rem 1.25rem;
        z-index: 90;
      }
    }
  }

  &__link {
    font-weight: 500;
    color: $ink-soft;
    padding: 0.85rem 0;
    border-bottom: 1px solid $line;
    @include transition(color);

    @include from('md') {
      @include eyebrow;
      color: $ink-soft;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
    }

    &:hover,
    &.router-link-exact-active {
      color: $accent-deep;
    }

    &.router-link-exact-active {
      border-color: $accent;
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
    font-size: 1.15rem;
    color: $ink;
    @include transition(background);

    &:hover {
      background: $sand;
    }
  }

  &__burger {
    @include from('md') {
      display: none;
    }
  }

  &__count {
    position: absolute;
    top: 0.2rem;
    right: 0.1rem;
    min-width: 1.15rem;
    height: 1.15rem;
    padding: 0 0.3rem;
    border-radius: $radius-pill;
    background: $cta;
    color: $surface;
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1.15rem;
    text-align: center;
  }

  &__search {
    @include container(720px);
    @include flex(row, center, flex-start, 0.5rem);
    padding-block: 0 0.85rem;

    input {
      flex: 1;
      min-height: 2.9rem;
      border-radius: $radius-pill;
      padding-inline: 1.1rem;
    }

    .btn {
      min-height: 2.9rem;
      padding-inline: 1.2rem;
    }
  }
}
</style>
