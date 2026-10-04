<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { catalog } from '@/config/site'

const props = defineProps<{ q: string; category: string; sort: string; categories: string[] }>()
const emit = defineEmits<{ change: [patch: { q?: string; categoria?: string; orden?: string }] }>()

const term = ref(props.q)
watch(
  () => props.q,
  (value) => (term.value = value),
)

function submit() {
  emit('change', { q: term.value.trim() })
}

function clear() {
  term.value = ''
  if (props.q) emit('change', { q: '' })
}

// El chip activo se centra en la fila para que en móvil siempre se vea qué filtro está puesto.
const chips = ref<HTMLElement | null>(null)
watch(
  () => [props.category, props.categories.length],
  async () => {
    await nextTick()
    const active = chips.value?.querySelector<HTMLElement>('[aria-pressed="true"]')
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  },
)
</script>

<template>
  <div class="filters">
    <form class="filters__search" role="search" @submit.prevent="submit">
      <label for="catalog-search" class="visually-hidden">{{ catalog.searchPlaceholder }}</label>
      <i class="fa-solid fa-magnifying-glass filters__icon" aria-hidden="true"></i>
      <input
        id="catalog-search"
        v-model="term"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        :placeholder="catalog.searchPlaceholder"
        @search="submit"
      />
      <Transition name="fade">
        <button
          v-if="term"
          type="button"
          class="filters__clear"
          :aria-label="catalog.clearSearch"
          @click="clear"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </Transition>
    </form>

    <div class="filters__row">
      <div
        v-if="categories.length"
        ref="chips"
        class="filters__chips"
        role="group"
        :aria-label="catalog.categoriesLabel"
      >
        <button
          v-for="item in ['', ...categories]"
          :key="item || 'all'"
          class="filters__chip"
          :class="{ 'filters__chip--active': category === item }"
          :aria-pressed="category === item"
          @click="emit('change', { categoria: item })"
        >
          <span>{{ item || catalog.allCategories }}</span>
        </button>
      </div>

      <div class="filters__sort">
        <label for="catalog-sort">{{ catalog.sortLabel }}</label>
        <div class="filters__select">
          <select
            id="catalog-sort"
            :value="sort"
            @change="emit('change', { orden: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="option in catalog.sorts" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__search {
    position: relative;

    input {
      min-height: 3.25rem;
      border-radius: $radius-pill;
      padding-inline: 3rem 3rem;
      border-color: transparent;
      box-shadow:
        $shadow-sm,
        inset 0 0 0 1px rgba($line, 0.9);

      &::-webkit-search-cancel-button {
        display: none;
      }

      &:focus {
        border-color: $accent;
      }
    }
  }

  &__icon {
    position: absolute;
    left: 1.15rem;
    top: 50%;
    transform: translateY(-50%);
    color: $accent;
    pointer-events: none;
  }

  &__clear {
    @include tap-target;
    position: absolute;
    right: 0.55rem;
    top: 50%;
    width: 2.2rem;
    height: 2.2rem;
    margin-top: -1.1rem;
    border-radius: 50%;
    background: $sand;
    color: $ink-soft;
    @include flex(row, center, center);
  }

  &__row {
    @include flex(column, stretch, flex-start, 0.8rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  // Chips con scroll horizontal y snap en móvil: no empujan los productos hacia abajo.
  &__chips {
    @include flex(row, center, flex-start, 0.45rem);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scroll-padding-inline: 1.25rem;
    scrollbar-width: none;
    margin-inline: -1.25rem;
    padding: 0.15rem 1.25rem;
    min-width: 0;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      flex-wrap: wrap;
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  &__chip {
    position: relative;
    flex-shrink: 0;
    scroll-snap-align: start;
    min-height: 2.6rem;
    padding: 0.4rem 1.05rem;
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: inset 0 0 0 1px $line;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    isolation: isolate;
    transition:
      color $dur $ease-out,
      transform $dur-fast $ease-out;

    // Fondo activo: crece desde el centro con un leve rebote.
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      background: $accent-deep;
      opacity: 0;
      transform: scale(0.6);
      transition:
        opacity $dur $ease-out,
        transform $dur $ease-spring;
    }

    &:active {
      transform: scale(0.95);
    }

    &--active {
      color: $surface;

      &::before {
        opacity: 1;
        transform: none;
      }
    }
  }

  &__sort {
    @include flex(row, center, space-between, 0.6rem);
    flex-shrink: 0;

    label {
      @include eyebrow;
      color: $ink-muted;
      margin: 0;
      white-space: nowrap;
    }
  }

  &__select {
    position: relative;

    select {
      appearance: none;
      width: auto;
      min-height: 2.75rem;
      padding: 0.4rem 2.4rem 0.4rem 1rem;
      border-radius: $radius-pill;
      font-weight: 600;
      cursor: pointer;
    }

    i {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.7rem;
      color: $accent;
      pointer-events: none;
    }
  }
}
</style>
