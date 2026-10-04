<script setup lang="ts">
import { ref, watch } from 'vue'
import { catalog } from '@/config/site'

const props = defineProps<{ q: string; category: string; sort: string; categories: string[] }>()
const emit = defineEmits<{ change: [patch: { q?: string; categoria?: string; orden?: string }] }>()

const term = ref(props.q)
watch(() => props.q, (value) => (term.value = value))

function submit() {
  emit('change', { q: term.value.trim() })
}
</script>

<template>
  <div class="filters">
    <form class="filters__search" role="search" @submit.prevent="submit">
      <label for="catalog-search" class="visually-hidden">{{ catalog.searchPlaceholder }}</label>
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input
        id="catalog-search"
        v-model="term"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        :placeholder="catalog.searchPlaceholder"
        @search="submit"
      />
    </form>

    <div v-if="categories.length" class="filters__chips" role="group" aria-label="Categorías">
      <button
        class="filters__chip"
        :class="{ 'filters__chip--active': !category }"
        :aria-pressed="!category"
        @click="emit('change', { categoria: '' })"
      >
        {{ catalog.allCategories }}
      </button>
      <button
        v-for="item in categories"
        :key="item"
        class="filters__chip"
        :class="{ 'filters__chip--active': category === item }"
        :aria-pressed="category === item"
        @click="emit('change', { categoria: item })"
      >
        {{ item }}
      </button>
    </div>

    <div class="filters__sort">
      <label for="catalog-sort">Ordenar</label>
      <select id="catalog-sort" :value="sort" @change="emit('change', { orden: ($event.target as HTMLSelectElement).value })">
        <option v-for="option in catalog.sorts" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(column, stretch, flex-start, 0.85rem);

  &__search {
    position: relative;

    i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      min-height: 3rem;
      border-radius: $radius-pill;
      padding-left: 2.7rem;
    }
  }

  // Chips con scroll horizontal en móvil: no empujan los productos hacia abajo.
  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: -1.25rem;
    padding-inline: 1.25rem;

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
    flex-shrink: 0;
    min-height: 2.5rem;
    padding: 0.4rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    white-space: nowrap;
    @include transition;

    &--active {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__sort {
    @include flex(row, center, flex-end, 0.6rem);

    label {
      margin: 0;
      white-space: nowrap;
    }

    select {
      width: auto;
      min-height: 2.75rem;
      padding-block: 0.4rem;
    }
  }
}
</style>
