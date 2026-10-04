<script setup lang="ts">
import { computed } from 'vue'
import type { DropiManualInput, Order, ShippingInput } from '@/types'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import DropiManualForm from './orders/DropiManualForm.vue'
import ShippingEditor from './orders/ShippingEditor.vue'
import { formatDateTime } from '@/composables/admin/format'
import { useDropiCopy } from '@/composables/admin/useDropiCopy'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{ order: Order; canSend: boolean; busy: string | null }>()
const emit = defineEmits<{
  send: []
  manual: [body: DropiManualInput, done: (ok: boolean) => void]
  shipping: [body: ShippingInput]
}>()

const toast = useToastStore()
const { copied, copy } = useDropiCopy()

const SHIPPING = ['sent_to_dropi', 'shipped', 'delivered', 'returned']
const inDropi = computed(
  () => !!props.order.dropi?.orderId || SHIPPING.includes(props.order.status),
)
const canMark = computed(() => props.order.status === 'confirmed')
const canShip = computed(() => SHIPPING.includes(props.order.status))
const canCopy = computed(
  () => !['cancelled', 'failed', 'pending_payment'].includes(props.order.status),
)

async function copyData() {
  if (!(await copy(props.order))) toast.error('No se pudo copiar. Selecciona el texto a mano.')
}
</script>

<template>
  <AdminPanel title="Dropi" icon="fa-solid fa-truck-fast">
    <div class="dropi">
      <div v-if="order.dropi?.error && !inDropi" class="dropi__notice">
        <i class="fa-solid fa-circle-info"></i>
        <div>
          <p>
            La conexión automática con Dropi aún no está activa. Crea el pedido en Dropi con "Copiar
            datos" y márcalo aquí.
          </p>
          <details class="dropi__tech">
            <summary>Detalle técnico</summary>
            {{ order.dropi.error }}
          </details>
        </div>
      </div>

      <dl v-if="inDropi" class="dropi__data">
        <div>
          <dt>ID en Dropi</dt>
          <dd>{{ order.dropi?.orderId || 'Sin ID' }}</dd>
        </div>
        <div>
          <dt>Guía</dt>
          <dd>{{ order.dropi?.guide || 'Pendiente' }}</dd>
        </div>
        <div>
          <dt>Transportadora</dt>
          <dd>{{ order.dropi?.carrier || 'Pendiente' }}</dd>
        </div>
        <div v-if="order.dropi?.status">
          <dt>Estado en Dropi</dt>
          <dd>{{ order.dropi.status }}</dd>
        </div>
        <div v-if="order.dropi?.lastSyncAt">
          <dt>Actualizado</dt>
          <dd>{{ formatDateTime(order.dropi.lastSyncAt) }}</dd>
        </div>
      </dl>
      <p v-else-if="!order.dropi?.error" class="dropi__muted">
        Este pedido aún no está creado en Dropi.
      </p>

      <AdminButton
        v-if="canCopy"
        :variant="canMark ? 'primary' : 'soft'"
        :icon="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"
        block
        @click="copyData"
      >
        {{ copied ? 'Copiado' : 'Copiar datos para Dropi' }}
      </AdminButton>

      <DropiManualForm
        v-if="canMark"
        :busy="busy === 'dropi-manual'"
        @submit="(body, done) => emit('manual', body, done)"
      />

      <ShippingEditor
        v-if="canShip"
        :order="order"
        :busy="busy === 'shipping'"
        @save="(body) => emit('shipping', body)"
      />

      <AdminButton
        v-if="canSend"
        variant="ghost"
        icon="fa-solid fa-rotate-right"
        block
        :loading="busy === 'send-to-dropi'"
        @click="emit('send')"
      >
        Probar envío automático
      </AdminButton>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.dropi {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__notice {
    @include flex(row, flex-start, flex-start, 0.55rem);
    font-size: $text-sm;
    line-height: 1.5;
    color: $ink;
    background: $info-bg;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;

    > i {
      color: $info;
      margin-top: 0.25rem;
    }
  }

  &__tech {
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $ink-muted;
    word-break: break-word;

    summary {
      cursor: pointer;
    }
  }

  &__data {
    @include flex-cards(130px, 0.6rem 1rem);
    font-size: $text-sm;

    dt {
      font-size: $text-xs;
      color: $ink-muted;
    }

    dd {
      font-family: $font-mono;
      font-weight: 500;
      word-break: break-word;
    }
  }

  &__muted {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
