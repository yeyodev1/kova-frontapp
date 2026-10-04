<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminChips from '@/components/admin/AdminChips.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import OrderRow from '@/components/admin/OrderRow.vue'
import { methodLabels, statusLabels, statusOrder } from '@/components/admin/orderLabels'
import { useOrdersList } from '@/composables/admin/useOrdersList'

const { filters, items, total, pages, loading, error, load, goTo } = useOrdersList()

const statusOptions = [{ value: '', label: 'Todos' }, ...statusOrder.map((s) => ({ value: s, label: statusLabels[s] }))]
const methodOptions = [
  { value: '', label: 'Todos los pagos' },
  ...(Object.keys(methodLabels) as (keyof typeof methodLabels)[]).map((m) => ({ value: m, label: methodLabels[m] })),
]
</script>

<template>
  <div class="orders">
    <AdminPageHead title="Pedidos" :subtitle="loading ? 'Cargando…' : `${total} pedidos`">
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="load">Actualizar</AdminButton>
    </AdminPageHead>

    <div class="orders__filters">
      <label class="orders__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="visually-hidden">Buscar pedidos</span>
        <input v-model="filters.q" type="search" placeholder="Número, nombre o celular" />
      </label>
      <AdminChips v-model="filters.status" :options="statusOptions" label="Estado" />
      <AdminChips v-model="filters.paymentMethod" :options="methodOptions" label="Método de pago" />
    </div>

    <AdminSkeleton v-if="loading && !items.length" :rows="6" />

    <AdminEmpty v-else-if="error" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="error">
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-receipt"
      title="Sin pedidos"
      text="No hay pedidos con estos filtros."
    />

    <div v-else class="orders__list" :class="{ 'orders__list--busy': loading }">
      <OrderRow v-for="order in items" :key="order._id" :order="order" />
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
    }

    &--busy {
      opacity: 0.55;
    }
  }
}
</style>
