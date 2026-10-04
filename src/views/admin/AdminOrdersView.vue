<script setup lang="ts">
import { computed, onMounted, reactive, toRef } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminChips from '@/components/admin/AdminChips.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import OrderPickRow from '@/components/admin/orders/OrderPickRow.vue'
import OrdersExportBar from '@/components/admin/orders/OrdersExportBar.vue'
import OrdersTodoChip from '@/components/admin/orders/OrdersTodoChip.vue'
import { methodLabels, statusLabels, statusOrder } from '@/components/admin/orderLabels'
import { ALL, TODO, useOrdersList } from '@/composables/admin/useOrdersList'
import { useOrdersExport } from '@/composables/admin/useOrdersExport'
import { useAdminBadges } from '@/composables/admin/useAdminBadges'

const { filters, isTodo, apiStatus, items, total, pages, loading, error, load, goTo } =
  useOrdersList()
const { stats, refresh: refreshBadges } = useAdminBadges()
// La exportación solo entiende estados reales: "por gestionar" y "todos" exportan lo pendiente de Dropi.
const exportFilters = reactive({
  status: apiStatus,
  paymentMethod: toRef(filters, 'paymentMethod'),
  q: toRef(filters, 'q'),
})
const { selecting, selected, count, exporting, toggle, selectAll, toggleSelecting, exportCsv } =
  useOrdersExport(exportFilters)

onMounted(refreshBadges)

function reload() {
  load()
  refreshBadges()
}

const todoCount = computed(() => stats.value?.todoCount ?? 0)
const allClear = computed(() => isTodo.value && !filters.q && !filters.paymentMethod)

const pageIds = computed(() => items.value.map((o) => o._id))
const pageAllChecked = computed(
  () => !!pageIds.value.length && pageIds.value.every((id) => selected.value.has(id)),
)

const hasFilters = computed(
  () =>
    !!(filters.q || filters.paymentMethod || filters.dropiError) ||
    (filters.status !== ALL && !isTodo.value),
)

function clearFilters() {
  Object.assign(filters, { q: '', status: ALL, paymentMethod: '', dropiError: false })
  goTo(1)
}

const statusOptions = [
  { value: ALL, label: 'Todos' },
  ...statusOrder.map((s) => ({ value: s, label: statusLabels[s] })),
]
const methodOptions = [
  { value: '', label: 'Todos los pagos' },
  ...(Object.keys(methodLabels) as (keyof typeof methodLabels)[]).map((m) => ({
    value: m,
    label: methodLabels[m],
  })),
]
</script>

<template>
  <div class="orders">
    <AdminPageHead
      title="Pedidos"
      :subtitle="loading ? 'Cargando…' : `${total} ${isTodo ? 'por gestionar' : 'pedidos'}`"
    >
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="reload"
        >Actualizar</AdminButton
      >
    </AdminPageHead>

    <div class="orders__filters">
      <label class="orders__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="visually-hidden">Buscar pedidos</span>
        <input v-model="filters.q" type="search" placeholder="Número, nombre o celular" />
      </label>
      <div class="orders__status">
        <OrdersTodoChip :active="isTodo" :count="todoCount" @select="filters.status = TODO" />
        <AdminChips
          class="orders__chips"
          :model-value="isTodo ? '' : filters.status"
          :options="statusOptions"
          label="Estado"
          @update:model-value="(value: string) => (filters.status = value)"
        />
      </div>
      <AdminChips v-model="filters.paymentMethod" :options="methodOptions" label="Método de pago" />
    </div>

    <OrdersExportBar
      :status="apiStatus"
      :selecting="selecting"
      :count="count"
      :exporting="exporting"
      :page-all-checked="pageAllChecked"
      @export="exportCsv"
      @select="toggleSelecting"
      @select-page="selectAll(pageIds)"
    />

    <AdminSkeleton v-if="loading && !items.length" :rows="6" />

    <AdminEmpty
      v-else-if="error"
      icon="fa-solid fa-plug-circle-xmark"
      title="No se pudo cargar"
      :text="error"
    >
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length && allClear"
      icon="fa-solid fa-circle-check"
      title="Todo al día"
      text="No hay pedidos esperando una acción del equipo."
    >
      <AdminButton icon="fa-solid fa-receipt" @click="filters.status = ALL"
        >Ver todos los pedidos</AdminButton
      >
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-receipt"
      title="Sin pedidos"
      :text="
        hasFilters
          ? 'No hay pedidos con estos filtros.'
          : 'Cuando entre el primer pedido lo verás aquí.'
      "
    >
      <AdminButton
        v-if="hasFilters"
        variant="primary"
        icon="fa-solid fa-filter-circle-xmark"
        @click="clearFilters"
      >
        Quitar filtros
      </AdminButton>
      <AdminButton v-else icon="fa-solid fa-box" to="/admin/productos"
        >Revisar productos</AdminButton
      >
    </AdminEmpty>

    <div v-else class="orders__list" :class="{ 'orders__list--busy': loading }">
      <OrderPickRow
        v-for="order in items"
        :key="order._id"
        :order="order"
        :selecting="selecting"
        :checked="selected.has(order._id)"
        @toggle="toggle(order._id)"
      />
    </div>

    <AdminPager :page="filters.page" :pages="pages" @change="goTo" />
  </div>
</template>

<style scoped lang="scss">
.orders {
  &__filters {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-bottom: 1rem;
  }

  &__status {
    @include flex(row, flex-start, flex-start, 0.4rem);
    min-width: 0;
  }

  &__chips {
    flex: 1 1 0;
    min-width: 0;
  }

  &__search {
    position: relative;
    margin: 0;

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
}
</style>
