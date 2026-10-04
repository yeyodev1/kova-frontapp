<script setup lang="ts">
import { ref } from 'vue'
import { orderCopy, whatsappLink } from '@/config/site'
import { formatCents } from '@/utils/format'
import { useStoreSettings } from '@/composables/useStoreSettings'
import ReceiptUploader from './ReceiptUploader.vue'
import type { Order } from '@/types'

const props = defineProps<{ order: Order; phone: string }>()
const emit = defineEmits<{ uploaded: [order: Order] }>()

const { bankAccounts } = useStoreSettings()
const copied = ref('')

async function copy(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copied.value = value
    setTimeout(() => (copied.value = ''), 2000)
  } catch {
    /* sin permiso de portapapeles: el número igual está a la vista */
  }
}

const amount = () => (props.order.total / 100).toFixed(2)
</script>

<template>
  <section class="bt">
    <h2 class="bt__title">{{ orderCopy.bankTitle }}</h2>

    <div class="bt__amount">
      <span>{{ orderCopy.amountToPay }}</span>
      <strong>{{ formatCents(order.total) }}</strong>
      <button type="button" class="bt__copy" @click="copy(amount())">
        <i :class="copied === amount() ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
        {{ copied === amount() ? orderCopy.copied : orderCopy.copy }}
      </button>
    </div>

    <ul class="bt__accounts">
      <li v-for="account in bankAccounts" :key="account.number" class="bt__account">
        <p class="bt__bank">{{ account.bank }} · {{ account.type }}</p>
        <div class="bt__number">
          <span>
            <small>{{ orderCopy.accountNumber }}</small>
            <strong>{{ account.number }}</strong>
          </span>
          <button type="button" class="bt__copy" :aria-label="`${orderCopy.copy} ${account.number}`" @click="copy(account.number)">
            <i :class="copied === account.number ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
            {{ copied === account.number ? orderCopy.copied : orderCopy.copy }}
          </button>
        </div>
        <p class="bt__meta">{{ orderCopy.holder }}: {{ account.holder }}</p>
        <p v-if="account.idNumber" class="bt__meta">{{ orderCopy.idNumber }}: {{ account.idNumber }}</p>
      </li>
    </ul>

    <ReceiptUploader v-if="phone" :number="order.number" :phone="phone" @uploaded="emit('uploaded', $event)" />

    <a :href="whatsappLink(orderCopy.whatsappReceipt(order.number))" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ orderCopy.sendReceiptWhatsapp }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.bt {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.1rem;

  &__title {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__amount {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $cta-soft;

    span {
      flex-basis: 100%;
      font-size: $text-xs;
      color: $ink-soft;
    }

    strong {
      font-family: $font-display;
      font-size: $display-sm;
      line-height: 1.1;
    }
  }

  &__accounts {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__account {
    border: 1px solid $line;
    border-radius: $radius-sm;
    padding: 0.9rem 1rem;
  }

  &__bank {
    font-weight: 600;
  }

  &__number {
    @include flex(row, center, space-between, 0.5rem);
    margin-block: 0.35rem;

    span {
      @include flex(column, flex-start, flex-start);
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    strong {
      font-family: $font-display;
      font-size: $text-lg;
      letter-spacing: 0.03em;
    }
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__copy {
    @include flex(row, center, center, 0.35rem);
    flex-shrink: 0;
    min-height: 2.5rem;
    padding: 0.35rem 0.85rem;
    border-radius: $radius-pill;
    border: 1px solid $accent;
    background: $surface;
    color: $accent-deep;
    font-size: $text-xs;
    font-weight: 600;
  }
}
</style>
