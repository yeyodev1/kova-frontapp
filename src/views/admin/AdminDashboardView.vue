<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminWeekBars from '@/components/admin/AdminWeekBars.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminStatusChip from '@/components/admin/AdminStatusChip.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import { statusOrder } from '@/components/admin/orderLabels'
import { useAdminBadges } from '@/composables/admin/useAdminBadges'
import { formatCents } from '@/utils/money'

const { stats, loading, error, refresh } = useAdminBadges()

onMounted(refresh)

const byStatus = computed(() => {
  const counts = stats.value?.ordersByStatus ?? {}
  const known = statusOrder.filter((s) => counts[s]).map((s) => ({ status: s, count: counts[s] ?? 0 }))
  const extra = Object.keys(counts)
    .filter((s) => !statusOrder.includes(s as never) && counts[s])
    .map((s) => ({ status: s, count: counts[s] ?? 0 }))
  return [...known, ...extra]
})

const shortcuts = [
  { to: '/admin/pedidos?status=transfer_review', label: 'Revisar transferencias', icon: 'fa-solid fa-building-columns' },
  { to: '/admin/pedidos', label: 'Ver pedidos', icon: 'fa-solid fa-receipt' },
  { to: '/admin/dropi', label: 'Importar de Dropi', icon: 'fa-solid fa-cloud-arrow-down' },
  { to: '/admin/carritos', label: 'Recuperar carritos', icon: 'fa-brands fa-whatsapp' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box' },
  { to: '/admin/ajustes', label: 'Ajustes', icon: 'fa-solid fa-sliders' },
]
</script>

<template>
  <div class="dash">
    <AdminPageHead title="Panel" subtitle="Lo que pasa hoy en Kova">
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="refresh">Actualizar</AdminButton>
    </AdminPageHead>

    <AdminSkeleton v-if="loading && !stats" :rows="4" />

    <AdminEmpty v-else-if="error && !stats" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="error">
      <AdminButton variant="primary" @click="refresh">Reintentar</AdminButton>
    </AdminEmpty>

    <template v-else-if="stats">
      <div class="dash__stats">
        <AdminStatCard label="Pedidos hoy" :value="stats.ordersToday" icon="fa-solid fa-receipt" />
        <AdminStatCard label="Ventas hoy" :value="formatCents(stats.revenueToday)" icon="fa-solid fa-dollar-sign" tone="success" />
        <AdminStatCard
          label="Transferencias por revisar"
          :value="stats.pendingTransfers"
          icon="fa-solid fa-building-columns"
          :tone="stats.pendingTransfers ? 'warning' : 'accent'"
          to="/admin/pedidos?status=transfer_review"
        />
        <AdminStatCard
          label="Errores de Dropi"
          :value="stats.dropiErrors"
          icon="fa-solid fa-triangle-exclamation"
          :tone="stats.dropiErrors ? 'danger' : 'accent'"
          to="/admin/pedidos?dropiError=1"
        />
      </div>

      <div class="dash__row">
        <AdminPanel title="Últimos 7 días" icon="fa-solid fa-chart-column" class="dash__week">
          <AdminWeekBars v-if="stats.last7Days?.length" :days="stats.last7Days" />
          <p v-else class="dash__muted">Aún no hay ventas registradas.</p>
        </AdminPanel>

        <AdminPanel title="Pedidos por estado" icon="fa-solid fa-layer-group" class="dash__status">
          <ul v-if="byStatus.length" class="dash__list">
            <li v-for="row in byStatus" :key="row.status">
              <RouterLink :to="`/admin/pedidos?status=${row.status}`" class="dash__list-link">
                <AdminStatusChip :status="row.status" />
                <strong>{{ row.count }}</strong>
              </RouterLink>
            </li>
          </ul>
          <p v-else class="dash__muted">Todavía no hay pedidos.</p>
        </AdminPanel>
      </div>

      <AdminPanel title="Accesos rápidos" icon="fa-solid fa-bolt">
        <div class="dash__shortcuts">
          <RouterLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="dash__shortcut">
            <i :class="s.icon"></i>
            <span>{{ s.label }}</span>
          </RouterLink>
        </div>
      </AdminPanel>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1rem);

  &__stats {
    @include flex-cards(140px, 0.7rem);

    @include from('lg') {
      @include flex-cards(200px, 1rem);
    }
  }

  &__row {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__week {
    flex: 3 1 0;
    min-width: 0;
  }

  &__status {
    flex: 2 1 0;
    min-width: 0;
  }

  &__muted {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.15rem);
  }

  &__list-link {
    @include flex(row, center, space-between, 0.5rem);
    padding: 0.5rem 0.3rem;
    border-bottom: 1px solid $paper;
    font-size: $text-sm;
  }

  &__shortcuts {
    @include flex-cards(140px, 0.6rem);
  }

  &__shortcut {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $paper;
    font-size: $text-sm;
    font-weight: 500;
    @include transition(background);

    i {
      color: $accent;
    }

    &:hover {
      background: $accent-soft;
    }
  }
}
</style>
