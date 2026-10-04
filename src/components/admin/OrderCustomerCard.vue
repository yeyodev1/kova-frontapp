<script setup lang="ts">
import type { Order } from '@/types'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import { telLink, waLink } from '@/composables/admin/whatsapp'

const props = defineProps<{ order: Order; message: string }>()
</script>

<template>
  <AdminPanel title="Cliente" icon="fa-solid fa-user">
    <p class="cust__name">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
    <dl class="cust__data">
      <div>
        <dt>Celular</dt>
        <dd>{{ order.customer.phone }}</dd>
      </div>
      <div v-if="order.customer.email">
        <dt>Correo</dt>
        <dd>{{ order.customer.email }}</dd>
      </div>
      <div v-if="order.customer.idNumber">
        <dt>Cédula</dt>
        <dd>{{ order.customer.idNumber }}</dd>
      </div>
    </dl>
    <div class="cust__actions">
      <AdminButton variant="whatsapp" icon="fa-brands fa-whatsapp" :href="waLink(props.order.customer.phone, message)">
        WhatsApp
      </AdminButton>
      <a class="cust__call" :href="telLink(order.customer.phone)">
        <i class="fa-solid fa-phone"></i> Llamar
      </a>
    </div>

    <h3 class="cust__sub"><i class="fa-solid fa-location-dot"></i> Dirección de envío</h3>
    <p class="cust__addr">
      {{ order.address.street }}<br />
      {{ order.address.city }}, {{ order.address.province }}
    </p>
    <p v-if="order.address.reference" class="cust__ref">Referencia: {{ order.address.reference }}</p>
    <p v-if="order.notes" class="cust__notes"><i class="fa-regular fa-note-sticky"></i> {{ order.notes }}</p>
  </AdminPanel>
</template>

<style scoped lang="scss">
.cust {
  &__name {
    font-weight: 600;
    font-size: $text-lg;
  }

  &__data {
    @include flex(row, flex-start, flex-start, 0.4rem 1.4rem);
    flex-wrap: wrap;
    margin: 0.5rem 0 0.9rem;
    font-size: $text-sm;

    dt {
      font-size: $text-xs;
      color: $ink-muted;
    }

    dd {
      word-break: break-all;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__call {
    @include flex(row, center, center, 0.45rem);
    min-height: 2.5rem;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__sub {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 600;
    margin: 1.2rem 0 0.4rem;

    i {
      color: $accent;
    }
  }

  &__addr {
    font-size: $text-sm;
  }

  &__ref,
  &__notes {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__notes {
    background: $warning-bg;
    padding: 0.5rem 0.7rem;
    border-radius: $radius-sm;
  }
}
</style>
