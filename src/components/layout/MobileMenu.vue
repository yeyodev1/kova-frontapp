<script setup lang="ts">
import { toRef } from 'vue'
import { site, layoutCopy, policyLinks, whatsappLink } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import BrandMark from './BrandMark.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <!-- duration explícita: los links entran escalonados después del panel -->
    <Transition name="menu" :duration="{ enter: 760, leave: 260 }">
      <div
        v-if="open"
        id="mobile-menu"
        class="menu"
        role="dialog"
        aria-modal="true"
        :aria-label="layoutCopy.menu"
        @keydown.esc="emit('close')"
      >
        <div class="menu__top">
          <RouterLink to="/" :aria-label="layoutCopy.home" @click="emit('close')">
            <BrandMark light size="sm" />
          </RouterLink>
          <button class="menu__close" :aria-label="layoutCopy.closeMenu" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <nav class="menu__nav" aria-label="Principal">
          <RouterLink
            v-for="(link, i) in site.nav"
            :key="link.to"
            :to="link.to"
            class="menu__link"
            :style="{ '--i': i }"
            @click="emit('close')"
          >
            <span>{{ link.label }}</span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </nav>

        <div class="menu__foot" :style="{ '--i': site.nav.length }">
          <a :href="whatsappLink()" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ layoutCopy.whatsappFloat }}
          </a>
          <div class="menu__policies">
            <RouterLink v-for="link in policyLinks" :key="link.to" :to="link.to" @click="emit('close')">
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.menu {
  @include moss;
  position: fixed;
  inset: 0;
  z-index: 260;
  @include flex(column, stretch, flex-start);
  padding: env(safe-area-inset-top) 1.25rem calc(1.5rem + env(safe-area-inset-bottom));
  overflow-y: auto;

  &__top {
    @include flex(row, center, space-between);
    min-height: 4rem;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 1.25rem;
    color: $surface;
    border: 1px solid rgba($surface, 0.18);
  }

  &__nav {
    @include flex(column, stretch, flex-start);
    margin-top: 2.5rem;
  }

  &__link,
  &__foot {
    transition:
      opacity 0.5s $ease-out,
      transform 0.5s $ease-out;
    transition-delay: calc(var(--i) * 70ms + 140ms);
  }

  &__link {
    @include flex(row, center, space-between, 1rem);
    @include display(clamp(2rem, 9vw, 2.6rem), 780, 122%);
    padding-block: 1.05rem;
    border-bottom: 1px solid rgba($surface, 0.12);
    color: rgba($surface, 0.92);

    i {
      font-size: 1rem;
      color: $sage;
    }

    &.router-link-exact-active {
      color: $surface;

      span {
        background: linear-gradient(transparent 88%, $sage 88%);
      }
    }
  }

  &__foot {
    margin-top: auto;
    padding-top: 2.5rem;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__policies {
    @include flex(row, center, flex-start, 0.3rem 1.1rem);
    flex-wrap: wrap;
    font-size: $text-xs;

    a {
      color: rgba($surface, 0.6);
      padding-block: 0.4rem;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.32s $ease-out,
    transform 0.42s $ease-out;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.menu-enter-from {
  .menu__link,
  .menu__foot {
    opacity: 0;
    transform: translateY(28px);
  }
}

.menu-leave-active {
  .menu__link,
  .menu__foot {
    transition-delay: 0ms;
  }
}
</style>
