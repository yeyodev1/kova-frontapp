<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue'
import BankLogo from '@/components/ui/BankLogo.vue'
import { orderCopy } from '@/config/site'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'
import type { AdminBankAccount } from '@/services/payments.service'

defineProps<{ accounts: AdminBankAccount[]; on: boolean }>()
</script>

<template>
  <AdminPanel :title="copy.previewTitle" icon="fa-solid fa-eye">
    <p class="pv__lead">{{ on ? copy.previewText : copy.switchOff }}</p>

    <div v-if="accounts.length" class="pv" :class="{ 'pv--off': !on }">
      <p class="pv__title">{{ orderCopy.bankTitle }}</p>
      <ul class="pv__list">
        <li v-for="account in accounts" :key="account._id" class="pv__account">
          <p class="pv__bank">
            <BankLogo :src="account.logoUrl" size="1.9rem" />
            <span>{{ account.bank }}</span>
            <em>{{ account.type }}</em>
          </p>
          <p class="pv__number">
            <small>{{ orderCopy.accountNumber }}</small>
            <strong>{{ account.number }}</strong>
          </p>
          <p class="pv__meta">
            {{ orderCopy.holder }}: <b>{{ account.holder }}</b> · {{ orderCopy.idNumber }}: <b>{{ account.idNumber }}</b>
          </p>
        </li>
      </ul>
    </div>
    <p v-else class="pv__empty">{{ copy.previewEmpty }}</p>
  </AdminPanel>
</template>

<style scoped lang="scss">
.pv {
  @include alu-border(18px);
  @include flex(column, stretch, flex-start, 0.7rem);
  padding: 1rem;
  @include transition(opacity);

  &--off {
    opacity: 0.45;
  }

  &__lead,
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display($text-base, 760, 110%);
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__account {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 0.8rem;
    border-radius: 14px;
    background: $surface;
    border: 1px solid $line;
  }

  &__bank {
    @include flex(row, center, flex-start, 0.55rem);
    font-weight: 700;

    em {
      margin-left: auto;
      font-style: normal;
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__number {
    @include flex(column, flex-start, flex-start);

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    strong {
      font-family: $font-mono;
      font-size: 1.05rem;
      letter-spacing: 0.05em;
    }
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-soft;
  }
}
</style>
