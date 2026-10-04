<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import AdminStatusChip from './AdminStatusChip.vue'
import { methodIcons, methodLabels, paymentStatusLabels } from './orderLabels'
import { formatDateTime } from '@/composables/admin/format'

const props = defineProps<{ order: Order; canConfirm: boolean; busy: boolean }>()
const emit = defineEmits<{ confirm: [] }>()

const receipt = computed(() => props.order.transfer?.receiptUrl || '')
const isPdf = computed(() => /\.pdf($|\?)/i.test(receipt.value) || receipt.value.includes('/raw/'))
const paymentTone = computed(() => {
  const s = props.order.paymentStatus
  if (s === 'paid') return 'success'
  if (s === 'failed' || s === 'refunded') return 'danger'
  if (s === 'cod') return 'info'
  return 'warning'
})
</script>

<template>
  <AdminPanel title="Pago" icon="fa-solid fa-wallet">
    <div class="pay__row">
      <span class="pay__method">
        <i :class="methodIcons[order.paymentMethod]"></i>
        {{ methodLabels[order.paymentMethod] ?? order.paymentMethod }}
      </span>
      <AdminStatusChip :label="paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus" :tone="paymentTone" />
    </div>

    <template v-if="order.paymentMethod === 'transfer'">
      <h3 class="pay__sub">Comprobante</h3>
      <template v-if="receipt">
        <a v-if="isPdf" :href="receipt" target="_blank" rel="noopener" class="pay__pdf">
          <i class="fa-regular fa-file-pdf"></i> Ver comprobante (PDF)
        </a>
        <a v-else :href="receipt" target="_blank" rel="noopener" class="pay__img-link">
          <img :src="receipt" alt="Comprobante de transferencia" class="pay__img" />
        </a>
        <p v-if="order.transfer.uploadedAt" class="pay__muted">Subido {{ formatDateTime(order.transfer.uploadedAt) }}</p>
      </template>
      <p v-else class="pay__muted">El cliente aún no sube el comprobante.</p>
      <p v-if="order.transfer?.confirmedAt" class="pay__ok">
        <i class="fa-solid fa-circle-check"></i> Confirmada {{ formatDateTime(order.transfer.confirmedAt) }}
      </p>

      <AdminButton
        v-if="canConfirm"
        variant="primary"
        icon="fa-solid fa-check"
        block
        :loading="busy"
        class="pay__confirm"
        @click="emit('confirm')"
      >
        Confirmar transferencia
      </AdminButton>
      <p v-if="canConfirm && !receipt" class="pay__muted">
        Puedes confirmarla si el cliente te envió el comprobante por WhatsApp.
      </p>
    </template>
  </AdminPanel>
</template>

<style scoped lang="scss">
.pay {
  &__row {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__method {
    font-weight: 500;

    i {
      color: $accent;
      margin-right: 0.3rem;
    }
  }

  &__sub {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
  }

  &__img-link {
    display: block;
  }

  &__img {
    width: 100%;
    max-height: 360px;
    object-fit: contain;
    border-radius: $radius-sm;
    border: 1px solid $line;
    background: $paper;
  }

  &__pdf {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
    background: $paper;
    font-weight: 500;

    i {
      color: $danger;
      font-size: 1.2rem;
    }
  }

  &__muted {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.4rem;
  }

  &__ok {
    font-size: $text-sm;
    color: $success;
    margin-top: 0.5rem;
  }

  &__confirm {
    margin-top: 0.9rem;
  }
}
</style>
