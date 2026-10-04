<script setup lang="ts">
import { computed } from 'vue'
import { orderCopy, whatsappLink } from '@/config/site'
import { formatCents } from '@/utils/format'
import { useStoreSettings } from '@/composables/useStoreSettings'
import ReceiptUploader from './ReceiptUploader.vue'
import CopyButton from './CopyButton.vue'
import type { Order } from '@/types'

const props = defineProps<{ order: Order; phone: string }>()
const emit = defineEmits<{ uploaded: [order: Order] }>()

const { bankAccounts } = useStoreSettings()
// Lo que se copia es el número tal cual lo pide la app del banco: 24.40, sin símbolo.
const amount = computed(() => (props.order.total / 100).toFixed(2))
</script>

<template>
  <section class="bt" aria-labelledby="bt-title">
    <header class="bt__head">
      <h2 id="bt-title" class="bt__title">{{ orderCopy.bankTitle }}</h2>
      <p class="bt__text">{{ orderCopy.bankText }}</p>
    </header>

    <div class="bt__amount">
      <span class="bt__amount-label">{{ orderCopy.amountToPay }}</span>
      <div class="bt__amount-row">
        <strong class="bt__amount-value">{{ formatCents(order.total) }}</strong>
        <CopyButton :value="amount" :label="orderCopy.amountToPay" dark />
      </div>
    </div>

    <ul v-if="bankAccounts.length" class="bt__accounts">
      <li v-for="(account, i) in bankAccounts" :key="account.number" v-reveal="i * 80" class="bt__account">
        <p class="bt__bank">
          <i class="fa-solid fa-building-columns" aria-hidden="true"></i>
          <span>{{ account.bank }}</span>
          <em>{{ account.type }}</em>
        </p>
        <div class="bt__number">
          <span>
            <small>{{ orderCopy.accountNumber }}</small>
            <strong>{{ account.number }}</strong>
          </span>
          <CopyButton :value="account.number" :label="`${orderCopy.accountNumber} ${account.bank}`" />
        </div>
        <dl class="bt__meta">
          <div>
            <dt>{{ orderCopy.holder }}</dt>
            <dd>{{ account.holder }}</dd>
          </div>
          <div v-if="account.idNumber">
            <dt>{{ orderCopy.idNumber }}</dt>
            <dd>{{ account.idNumber }}</dd>
          </div>
        </dl>
      </li>
    </ul>
    <p v-else class="bt__empty">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ orderCopy.bankEmpty }}
    </p>

    <ReceiptUploader v-if="phone" :number="order.number" :phone="phone" @uploaded="emit('uploaded', $event)" />

    <a :href="whatsappLink(orderCopy.whatsappReceipt(order.number))" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ orderCopy.sendReceiptWhatsapp }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.bt {
  @include alu-border(20px);
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.25rem 1.1rem;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 1.6rem;
  }

  &__title {
    @include display($text-xl, 760, 112%);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__amount {
    @include moss;
    padding: 1rem 1.1rem;
    border-radius: 16px;
  }

  &__amount-label {
    @include eyebrow;
    color: rgba(#fff, 0.72);
  }

  &__amount-row {
    @include flex(row, center, space-between, 0.75rem);
    margin-top: 0.3rem;
  }

  &__amount-value {
    @include price($display-md, 850);
    line-height: 1;
    color: #fff;
  }

  &__accounts {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__account {
    padding: 1rem;
    border: 1px solid $line;
    border-radius: 16px;
    background: linear-gradient(180deg, $surface, $alu-light);
  }

  &__bank {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 700;

    i {
      color: $accent;
    }

    em {
      @include eyebrow;
      font-style: normal;
      font-size: 0.6rem;
      margin-left: auto;
      color: $ink-muted;
    }
  }

  &__number {
    @include flex(row, center, space-between, 0.75rem);
    margin-block: 0.6rem 0.7rem;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    background: $surface;
    border: 1px solid $line;

    span {
      @include flex(column, flex-start, flex-start);
      min-width: 0;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    strong {
      font-family: $font-mono;
      font-size: 1.1rem;
      letter-spacing: 0.04em;
      overflow-wrap: anywhere;
    }
  }

  &__meta {
    @include flex(column, stretch, flex-start, 0.2rem);
    font-size: $text-sm;

    div {
      @include flex(row, baseline, space-between, 1rem);
    }

    dt {
      color: $ink-muted;
    }

    dd {
      font-weight: 600;
      text-align: right;
    }
  }

  &__empty {
    @include flex(row, baseline, flex-start, 0.5rem);
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: $info-bg;
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
