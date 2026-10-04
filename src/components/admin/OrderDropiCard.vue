<script setup lang="ts">
import type { Order } from '@/types'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import { formatDateTime } from '@/composables/admin/format'

defineProps<{ order: Order; canSend: boolean; busy: boolean }>()
const emit = defineEmits<{ send: [] }>()
</script>

<template>
  <AdminPanel title="Dropi" icon="fa-solid fa-truck-fast">
    <p v-if="order.dropi?.error" class="dropi__error">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <span>{{ order.dropi.error }}</span>
    </p>

    <dl v-if="order.dropi?.orderId" class="dropi__data">
      <div><dt>ID en Dropi</dt><dd>{{ order.dropi.orderId }}</dd></div>
      <div><dt>Estado</dt><dd>{{ order.dropi.status || 'Sin estado' }}</dd></div>
      <div><dt>Guía</dt><dd>{{ order.dropi.guide || 'Pendiente' }}</dd></div>
      <div><dt>Transportadora</dt><dd>{{ order.dropi.carrier || 'Pendiente' }}</dd></div>
      <div v-if="order.dropi.lastSyncAt"><dt>Última sincronización</dt><dd>{{ formatDateTime(order.dropi.lastSyncAt) }}</dd></div>
    </dl>
    <p v-else class="dropi__muted">Este pedido aún no está creado en Dropi.</p>

    <AdminButton
      v-if="canSend"
      :variant="order.dropi?.error ? 'cta' : 'primary'"
      :icon="order.dropi?.error ? 'fa-solid fa-rotate-right' : 'fa-solid fa-paper-plane'"
      block
      :loading="busy"
      class="dropi__btn"
      @click="emit('send')"
    >
      {{ order.dropi?.error ? 'Reintentar' : 'Enviar a Dropi' }}
    </AdminButton>
  </AdminPanel>
</template>

<style scoped lang="scss">
.dropi {
  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    margin-bottom: 0.8rem;
    word-break: break-word;

    i {
      margin-top: 0.2rem;
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
      font-weight: 500;
      word-break: break-word;
    }
  }

  &__muted {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__btn {
    margin-top: 0.9rem;
  }
}
</style>
