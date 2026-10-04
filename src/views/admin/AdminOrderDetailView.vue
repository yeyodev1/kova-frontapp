<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import AdminStatusChip from '@/components/admin/AdminStatusChip.vue'
import OrderCustomerCard from '@/components/admin/OrderCustomerCard.vue'
import OrderItemsCard from '@/components/admin/OrderItemsCard.vue'
import OrderPaymentCard from '@/components/admin/OrderPaymentCard.vue'
import OrderDropiCard from '@/components/admin/OrderDropiCard.vue'
import OrderTimeline from '@/components/admin/OrderTimeline.vue'
import { useOrderDetail } from '@/composables/admin/useOrderDetail'
import { formatDateTime } from '@/composables/admin/format'

const {
  order,
  loading,
  error,
  busy,
  confirmCancel,
  load,
  run,
  cancelOrder,
  canConfirmTransfer,
  canSendToDropi,
  canCancel,
  whatsappMessage,
  timeline,
} = useOrderDetail()
</script>

<template>
  <div class="detail">
    <AdminSkeleton v-if="loading && !order" :rows="5" height="8rem" />

    <AdminEmpty v-else-if="error && !order" icon="fa-solid fa-receipt" title="No se pudo cargar el pedido" :text="error">
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
      <AdminButton to="/admin/pedidos">Volver a pedidos</AdminButton>
    </AdminEmpty>

    <template v-else-if="order">
      <AdminPageHead :title="`Pedido ${order.number}`" :subtitle="formatDateTime(order.createdAt)" back="/admin/pedidos">
        <AdminStatusChip :status="order.status" />
      </AdminPageHead>

      <div class="detail__cols">
        <div class="detail__col detail__col--main">
          <OrderCustomerCard :order="order" :message="whatsappMessage" />
          <OrderItemsCard :order="order" />
        </div>
        <div class="detail__col">
          <OrderPaymentCard
            :order="order"
            :can-confirm="canConfirmTransfer"
            :busy="busy === 'confirm-transfer'"
            @confirm="run('confirm-transfer')"
          />
          <OrderDropiCard
            :order="order"
            :can-send="canSendToDropi"
            :busy="busy === 'send-to-dropi'"
            @send="run('send-to-dropi')"
          />
          <OrderTimeline :events="timeline" />
          <AdminButton
            v-if="canCancel"
            variant="danger"
            icon="fa-solid fa-ban"
            block
            :loading="busy === 'cancel'"
            @click="confirmCancel = true"
          >
            Cancelar pedido
          </AdminButton>
        </div>
      </div>

      <BaseModal
        :open="confirmCancel"
        title="¿Cancelar este pedido?"
        :message="`El pedido ${order.number} quedará cancelado${order.dropi?.orderId ? ' y también se cancelará en Dropi' : ''}. No se puede deshacer.`"
        confirm-label="Sí, cancelar"
        cancel-label="No"
        danger
        @confirm="cancelOrder"
        @cancel="confirmCancel = false"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.detail {
  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1 1 0;
    min-width: 0;

    &--main {
      @include from('lg') {
        flex: 1.4 1 0;
      }
    }
  }
}
</style>
