<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminChips from '@/components/admin/AdminChips.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import ProductRow from '@/components/admin/ProductRow.vue'
import ProductCreateForm from '@/components/admin/ProductCreateForm.vue'
import { useProductsList } from '@/composables/admin/useProductsList'

const { filters, items, total, pages, loading, error, toggling, load, goTo, toggle } = useProductsList()

// ?nuevo=1 llega desde el acceso rápido del panel.
const creating = ref(useRoute().query.nuevo === '1')

const publishedOptions = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Publicados' },
  { value: 'false', label: 'Borradores' },
]
</script>

<template>
  <div class="products">
    <AdminPageHead title="Productos" :subtitle="loading ? 'Cargando…' : `${total} productos`">
      <AdminButton icon="fa-solid fa-cloud-arrow-down" to="/admin/dropi">Importar de Dropi</AdminButton>
      <AdminButton variant="primary" icon="fa-solid fa-plus" @click="creating = !creating">Crear producto</AdminButton>
    </AdminPageHead>

    <ProductCreateForm v-model:open="creating" />

    <div class="products__filters">
      <label class="products__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="visually-hidden">Buscar productos</span>
        <input v-model="filters.q" type="search" placeholder="Buscar por nombre" />
      </label>
      <AdminChips v-model="filters.published" :options="publishedOptions" label="Estado de publicación" />
    </div>

    <AdminSkeleton v-if="loading && !items.length" :rows="6" height="5.5rem" />

    <AdminEmpty v-else-if="error" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="error">
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-box-open"
      title="No hay productos"
      text="Crea uno a mano con su ID de Dropi o impórtalo del catálogo para empezar a vender."
    >
      <AdminButton variant="primary" icon="fa-solid fa-plus" @click="creating = true">Crear producto</AdminButton>
      <AdminButton icon="fa-solid fa-cloud-arrow-down" to="/admin/dropi">Importar de Dropi</AdminButton>
    </AdminEmpty>

    <div v-else class="products__list" :class="{ 'products__list--busy': loading }">
      <div class="products__head" aria-hidden="true">
        <span class="products__head-main">Producto</span>
        <span class="products__head-money">Precio / costo / margen</span>
        <span class="products__head-flags">Publicado · Destacado</span>
      </div>
      <ProductRow
        v-for="p in items"
        :key="p._id"
        :product="p"
        :busy="toggling"
        @toggle="(field) => toggle(p, field)"
      />
    </div>

    <AdminPager :page="filters.page" :pages="pages" @change="goTo" />
  </div>
</template>

<style scoped lang="scss">
.products {
  &__filters {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-bottom: 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__search {
    position: relative;
    margin: 0;
    flex: 1;

    i {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      padding-left: 2.4rem;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
    @include transition(opacity);

    @include from('lg') {
      @include card;
      gap: 0;
      overflow: hidden;
      border-radius: $radius-md;
      box-shadow: $shadow-sm;
    }

    &--busy {
      opacity: 0.55;
    }
  }

  &__head {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-start, 0.8rem);
      padding: 0.6rem 0.8rem;
      background: $paper;
      border-bottom: 1px solid $line;
      font-size: $text-xs;
      font-weight: 600;
      color: $ink-muted;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  }

  &__head-main {
    flex: 1;
  }

  &__head-money {
    flex: 0 0 170px;
    text-align: right;
  }

  &__head-flags {
    flex: 0 0 170px;
    text-align: right;
  }
}
</style>
