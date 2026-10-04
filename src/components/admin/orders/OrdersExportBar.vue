<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from '../AdminButton.vue'
import { statusLabel } from '../orderLabels'

const props = defineProps<{
  status: string
  selecting: boolean
  count: number
  exporting: boolean
  pageAllChecked: boolean
}>()
const emit = defineEmits<{ export: []; select: []; selectPage: [] }>()

const scope = computed(() => {
  if (props.count)
    return `${props.count} ${props.count === 1 ? 'pedido marcado' : 'pedidos marcados'}`
  if (!props.status) return 'Confirmados que faltan crear en Dropi'
  return `Pedidos en estado "${statusLabel(props.status)}" con los filtros actuales`
})
</script>

<template>
  <div class="xbar">
    <div class="xbar__actions">
      <AdminButton
        variant="primary"
        icon="fa-solid fa-file-excel"
        :loading="exporting"
        @click="emit('export')"
      >
        {{ count ? `Exportar ${count} para Dropi` : 'Exportar para Dropi (Excel)' }}
      </AdminButton>
      <AdminButton
        :variant="selecting ? 'soft' : 'ghost'"
        :icon="selecting ? 'fa-solid fa-xmark' : 'fa-regular fa-square-check'"
        @click="emit('select')"
      >
        {{ selecting ? 'Terminar selección' : 'Seleccionar' }}
      </AdminButton>
      <AdminButton v-if="selecting" icon="fa-solid fa-list-check" @click="emit('selectPage')">
        {{ pageAllChecked ? 'Desmarcar página' : 'Marcar página' }}
      </AdminButton>
    </div>
    <p class="xbar__scope">
      <i class="fa-solid fa-circle-info"></i>
      Exporta: {{ scope }}. Una fila por producto, lista para copiar a la plantilla de carga masiva
      de Dropi.
    </p>
  </div>
</template>

<style scoped lang="scss">
.xbar {
  @include flex(column, stretch, flex-start, 0.5rem);
  margin-bottom: 1rem;
  padding: 0.8rem;
  border-radius: $radius-md;
  background: $alu-light;
  border: 1px solid $line;

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    > :first-child {
      flex: 1 1 100%;

      @include from('md') {
        flex: 0 0 auto;
      }
    }
  }

  &__scope {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.45;

    i {
      color: $ink-muted;
      margin-right: 0.25rem;
    }
  }
}
</style>
