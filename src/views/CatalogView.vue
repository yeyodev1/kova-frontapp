<script setup lang="ts">
import { computed } from 'vue'
import { catalog } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import CatalogFilters from '@/components/store/CatalogFilters.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import CatalogEmpty from '@/components/catalog/CatalogEmpty.vue'
import GuaranteeStrip from '@/components/store/GuaranteeStrip.vue'

const {
  items,
  categories,
  total,
  loading,
  loadingMore,
  error,
  q,
  category,
  sort,
  hasMore,
  loadMore,
  setFilter,
  reload,
} = useCatalog()

const heading = computed(() =>
  q.value ? catalog.resultsFor(q.value) : category.value || catalog.title,
)
const filtered = computed(() => Boolean(q.value || category.value))
</script>

<template>
  <div class="catalog">
    <header class="catalog__head">
      <p class="catalog__eyebrow">
        <span>{{ catalog.eyebrow }}</span>
        <span class="catalog__dot" aria-hidden="true"></span>
        <Transition name="fade" mode="out-in">
          <span :key="loading ? 'l' : total" class="catalog__count">
            {{ loading ? '···' : catalog.count(total) }}
          </span>
        </Transition>
      </p>
      <Transition name="swap" mode="out-in">
        <h1 :key="heading" class="catalog__title">{{ heading }}</h1>
      </Transition>
      <p v-if="!filtered" class="catalog__subtitle">{{ catalog.subtitle }}</p>
    </header>

    <CatalogFilters
      :q="q"
      :category="category"
      :sort="sort"
      :categories="categories"
      class="catalog__filters"
      @change="setFilter"
    />

    <ProductGrid :products="items" :loading="loading" :skeletons="8" />

    <CatalogEmpty
      v-if="!loading && !items.length"
      :error="error"
      :filtered="filtered"
      :categories="categories"
      @retry="reload"
      @reset="setFilter({ q: '', categoria: '' })"
      @pick="setFilter({ q: '', categoria: $event })"
    />

    <div v-if="items.length && !loading" class="catalog__more">
      <p class="catalog__shown">{{ catalog.shown(items.length, total) }}</p>
      <span class="catalog__bar" aria-hidden="true">
        <span :style="{ transform: `scaleX(${total ? items.length / total : 1})` }"></span>
      </span>
      <button
        v-if="hasMore"
        class="btn btn--outline btn--lg catalog__load"
        :disabled="loadingMore"
        :aria-busy="loadingMore"
        @click="loadMore"
      >
        <i v-if="loadingMore" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
        {{ loadingMore ? catalog.loadingMore : catalog.loadMore }}
      </button>
    </div>

    <GuaranteeStrip class="catalog__trust" />
  </div>
</template>

<style scoped lang="scss">
.catalog {
  @include container;
  @include flex(column, stretch, flex-start, 1.4rem);
  padding-block: 1.75rem $space-xl;

  @include from('md') {
    padding-top: 3rem;
    gap: 1.75rem;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
    max-width: 46rem;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
  }

  &__dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: $alu-dark;
  }

  &__count {
    color: $ink-muted;
  }

  &__title {
    @include display(clamp(2.1rem, 1.4rem + 3.4vw, 3.9rem), 800, 125%);
    overflow-wrap: anywhere;
  }

  &__subtitle {
    color: $ink-soft;
    font-size: $text-base;
    max-width: 38ch;
  }

  &__filters {
    position: relative;
    z-index: 2;
  }

  &__more {
    @include flex(column, center, flex-start, 0.6rem);
    margin-top: 0.75rem;
  }

  &__shown {
    font-family: $font-mono;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: $ink-muted;
  }

  &__bar {
    width: 140px;
    height: 3px;
    border-radius: 3px;
    background: $alu;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: $accent;
      transform-origin: left;
      transition: transform $dur-slow $ease-out;
    }
  }

  &__load {
    margin-top: 0.4rem;
    min-width: 220px;
  }

  &__trust {
    margin-top: $space-lg;
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity $dur $ease-out,
    transform $dur $ease-out;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
