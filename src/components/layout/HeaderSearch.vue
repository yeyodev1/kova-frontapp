<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalog, layoutCopy } from '@/config/site'

const open = defineModel<boolean>({ required: true })
const route = useRoute()
const router = useRouter()
const term = ref('')
const input = ref<HTMLInputElement | null>(null)

watch(open, async (value) => {
  if (!value) return
  term.value = String(route.query.q || '')
  await nextTick()
  input.value?.focus()
})

function submit() {
  const q = term.value.trim()
  router.push({ path: '/tienda', query: q ? { q } : {} })
  open.value = false
}
</script>

<template>
  <Transition name="search">
    <div v-if="open" class="search">
      <form class="search__form" role="search" @submit.prevent="submit" @keydown.esc="open = false">
        <label for="header-search" class="visually-hidden">{{ catalog.searchPlaceholder }}</label>
        <i class="fa-solid fa-magnifying-glass search__icon" aria-hidden="true"></i>
        <input
          id="header-search"
          ref="input"
          v-model="term"
          type="search"
          enterkeyhint="search"
          :placeholder="catalog.searchPlaceholder"
          autocomplete="off"
          class="search__input"
        />
        <button type="submit" class="search__submit">{{ layoutCopy.search }}</button>
        <button type="button" class="search__close" :aria-label="layoutCopy.closeSearch" @click="open = false">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.search {
  @include container(760px);
  padding-block: 0.25rem 0.9rem;

  &__form {
    @include flex(row, center, flex-start, 0.25rem);
    position: relative;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.3rem 0.3rem 0.3rem 1rem;
    box-shadow: $shadow-md;
    transition: border-color $dur $ease-out, box-shadow $dur $ease-out;

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 4px rgba($accent, 0.12), $shadow-md;
    }
  }

  &__icon {
    color: $ink-muted;
    font-size: 0.95rem;
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 0.55rem 0.5rem;
    min-height: 2.75rem;

    // El foco lo marca el contenedor (focus-within), no el campo.
    &:focus,
    &:focus-visible {
      box-shadow: none;
      outline: none;
    }
  }

  &__submit {
    min-height: 2.6rem;
    padding-inline: 1.1rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
    font-weight: 700;
    font-size: $text-sm;
    transition: background-color $dur $ease-out;

    &:hover {
      background: $ink;
    }
  }

  &__close {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      color: $ink;
    }
  }
}

.search-enter-active,
.search-leave-active {
  transition:
    opacity $dur $ease-out,
    transform $dur $ease-out;
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
