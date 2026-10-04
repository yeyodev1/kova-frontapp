<script setup lang="ts">
import { catalog } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import CatalogFilters from '@/components/store/CatalogFilters.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import EmptyState from '@/components/store/EmptyState.vue'
import GuaranteeStrip from '@/components/store/GuaranteeStrip.vue'

const { items, categories, loading, loadingMore, error, q, category, sort, hasMore, loadMore, setFilter, reload } =
  useCatalog()
</script>

<template>
  <div class="catalog">
    <header class="catalog__head">
      <h1 class="catalog__title">{{ q ? `"${q}"` : category || catalog.title }}</h1>
      <p class="catalog__subtitle">{{ catalog.subtitle }}</p>
    </header>

    <CatalogFilters :q="q" :category="category" :sort="sort" :categories="categories" @change="setFilter" />

    <ProductGrid :products="items" :loading="loading" :skeletons="6" class="catalog__grid" />

    <EmptyState
      v-if="!loading && !items.length"
      icon="fa-solid fa-magnifying-glass"
      :title="error || catalog.emptyTitle"
      :text="error ? '' : catalog.emptyText"
    >
      <button v-if="error" class="btn btn--primary" @click="reload">Reintentar</button>
      <button v-else-if="q || category" class="btn btn--primary" @click="setFilter({ q: '', categoria: '' })">
        Ver todos los productos
      </button>
    </EmptyState>

    <button v-if="hasMore && !loading" class="btn btn--ghost btn--lg catalog__more" :disabled="loadingMore" @click="loadMore">
      <i v-if="loadingMore" class="fa-solid fa-spinner fa-spin"></i>
      {{ catalog.loadMore }}
    </button>

    <GuaranteeStrip class="catalog__trust" />
  </div>
</template>

<style scoped lang="scss">
.catalog {
  @include container;
  @include flex(column, stretch, flex-start, 1.25rem);
  padding-block: 1.5rem $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.25rem);
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__subtitle {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__grid {
    margin-top: 0.25rem;
  }

  &__more {
    align-self: center;
    min-width: 220px;
  }

  &__trust {
    margin-top: $space-lg;
  }
}
</style>
