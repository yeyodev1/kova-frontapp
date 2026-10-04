<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminToggle from '@/components/admin/AdminToggle.vue'
import BankLogo from '@/components/ui/BankLogo.vue'
import CopyButton from '@/components/order/CopyButton.vue'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'
import type { AdminBankAccount } from '@/services/payments.service'

const props = defineProps<{ account: AdminBankAccount; busy?: boolean }>()
const emit = defineEmits<{ toggle: []; edit: []; remove: [] }>()

// El número se esconde por defecto: el panel se abre en público (local, celular prestado).
const revealed = ref(false)
const shown = computed(() =>
  revealed.value ? props.account.number : `•••• ${props.account.number.slice(-4)}`,
)
</script>

<template>
  <article class="acc" :class="{ 'acc--paused': !account.active }">
    <header class="acc__head">
      <BankLogo :src="account.logoUrl" size="2.75rem" />
      <div class="acc__title">
        <strong>{{ account.bank }}</strong>
        <span>{{ copy.account(account.type) }}</span>
      </div>
      <AdminToggle
        :model-value="account.active"
        :label="account.active ? copy.active : copy.paused"
        :busy="busy"
        @update:model-value="emit('toggle')"
      />
    </header>

    <div class="acc__number">
      <span class="acc__digits">{{ shown }}</span>
      <button
        type="button"
        class="acc__icon"
        :aria-label="revealed ? copy.hide : copy.show"
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <i :class="revealed ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
      </button>
      <CopyButton :value="account.number" :label="account.bank" />
    </div>

    <dl class="acc__meta">
      <div>
        <dt>{{ copy.holder }}</dt>
        <dd>{{ account.holder }}</dd>
      </div>
      <div>
        <dt>{{ copy.idNumber }}</dt>
        <dd>{{ account.idNumber }}</dd>
      </div>
    </dl>

    <footer class="acc__actions">
      <button type="button" class="acc__action" @click="emit('edit')">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> {{ copy.edit }}
      </button>
      <button type="button" class="acc__action acc__action--danger" @click="emit('remove')">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i> {{ copy.remove }}
      </button>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.acc {
  @include card;
  @include flex(column, stretch, flex-start, 0.8rem);
  border-radius: $radius-md;
  padding: 1rem;
  box-shadow: $shadow-sm;
  @include transition(opacity);

  &--paused {
    background: $paper;

    .acc__head :deep(.bank-logo),
    .acc__number,
    .acc__meta {
      opacity: 0.6;
    }
  }

  &__head {
    @include flex(row, center, flex-start, 0.75rem);
  }

  &__title {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1 1 auto;
    min-width: 0;

    strong {
      @include display(0.98rem, 740, 106%);
      overflow-wrap: break-word;
    }

    span {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__number {
    @include flex(row, center, flex-start, 0.4rem);
    padding: 0.55rem 0.6rem 0.55rem 0.85rem;
    border-radius: 12px;
    background: $paper;
  }

  &__digits {
    flex: 1 1 auto;
    font-family: $font-mono;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 10px;
    color: $ink-soft;
    @include transition(background);

    &:hover {
      background: $surface;
    }
  }

  &__meta {
    @include flex(row, flex-start, flex-start, 1.2rem);
    flex-wrap: wrap;
    margin: 0;

    dt {
      font-size: $text-xs;
      color: $ink-muted;
    }

    dd {
      margin: 0;
      font-size: $text-sm;
      font-weight: 600;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
    border-top: 1px solid $line;
    padding-top: 0.6rem;
  }

  &__action {
    @include flex(row, center, center, 0.4rem);
    min-height: 2.5rem;
    padding: 0 0.85rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    @include transition(background);

    &:hover {
      background: $paper;
    }

    &--danger {
      color: $danger;

      &:hover {
        background: $danger-bg;
      }
    }
  }
}
</style>
