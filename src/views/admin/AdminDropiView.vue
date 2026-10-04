<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import DropiCatalogCard from '@/components/admin/DropiCatalogCard.vue'
import DropiSyncPanel from '@/components/admin/DropiSyncPanel.vue'
import { useDropi } from '@/composables/admin/useDropi'

const {
  q,
  page,
  pages,
  items,
  total,
  loading,
  error,
  missingToken,
  markup,
  importing,
  importedIds,
  syncing,
  syncResults,
  search,
  importItem,
  sync,
} = useDropi()
</script>

<template>
  <div class="dropi">
    <AdminPageHead title="Importar de Dropi" subtitle="Busca en el catálogo y trae productos como borrador" />

    <div v-if="missingToken" class="dropi__token" role="alert">
      <i class="fa-solid fa-key"></i>
      <div>
        <p><strong>Falta configurar DROPI_INTEGRATION_KEY en el backend</strong></p>
        <p>Sin esa llave no se puede consultar el catálogo ni sincronizar. Agrégala en las variables de entorno del backapp y vuelve a intentar.</p>
      </div>
    </div>

    <DropiSyncPanel :syncing="syncing" :results="syncResults" @sync="sync" />

    <form class="dropi__search" @submit.prevent="search(1)">
      <label class="dropi__q">
        <span class="visually-hidden">Buscar en Dropi</span>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input v-model="q" type="search" placeholder="Buscar producto en Dropi" />
      </label>
      <label class="dropi__markup">
        <span>Margen %</span>
        <input v-model.number="markup" type="number" min="0" max="500" step="1" inputmode="numeric" />
      </label>
      <AdminButton type="submit" variant="primary" icon="fa-solid fa-magnifying-glass" :loading="loading">Buscar</AdminButton>
    </form>
    <p class="dropi__note">
      Si Dropi trae precio sugerido se usa ese; si no, costo + {{ markup || 0 }}%. Luego lo ajustas al editar.
    </p>

    <AdminSkeleton v-if="loading" :rows="4" height="6rem" />

    <AdminEmpty v-else-if="error && !missingToken" icon="fa-solid fa-plug-circle-xmark" title="Error con Dropi" :text="error">
      <AdminButton variant="primary" @click="search(page)">Reintentar</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length && !missingToken"
      icon="fa-solid fa-magnifying-glass"
      title="Sin resultados"
      text="Prueba con otra palabra o revisa la ortografía."
    />

    <template v-else-if="items.length">
      <p class="dropi__count">{{ total }} resultados</p>
      <div class="dropi__grid">
        <DropiCatalogCard
          v-for="item in items"
          :key="item.dropiId"
          :item="item"
          :markup="markup"
          :busy="importing === item.dropiId"
          :product-id="importedIds[item.dropiId]"
          @import="importItem(item)"
        />
      </div>
      <AdminPager :page="page" :pages="pages()" @change="search" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.dropi {
  @include flex(column, stretch, flex-start, 1rem);

  &__token {
    @include flex(row, flex-start, flex-start, 0.8rem);
    padding: 1rem;
    border-radius: $radius-md;
    background: $warning-bg;
    border: 1px solid rgba($warning, 0.5);
    font-size: $text-sm;

    > i {
      color: darken($warning, 15%);
      font-size: 1.2rem;
      margin-top: 0.15rem;
    }
  }

  &__search {
    @include flex(row, flex-end, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__q {
    position: relative;
    flex: 1 1 100%;
    margin: 0;

    @include from('md') {
      flex-basis: 0;
    }

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

  &__markup {
    @include flex(row, center, flex-start, 0.4rem);
    margin: 0;
    flex: 1 1 auto;

    @include from('md') {
      flex: 0 0 auto;
    }

    span {
      white-space: nowrap;
    }

    input {
      width: 5.5rem;
    }
  }

  &__note,
  &__count {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: -0.5rem;
  }

  &__count {
    margin-top: 0;
  }

  &__grid {
    @include flex-cards(150px, 0.7rem);

    @include from('md') {
      @include flex-cards(200px, 1rem);
    }

    > * {
      max-width: calc(50% - 0.35rem);

      @include from('md') {
        max-width: 280px;
      }
    }
  }
}
</style>
