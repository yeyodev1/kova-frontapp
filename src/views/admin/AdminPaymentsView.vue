<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import TransfersSwitch from '@/components/admin/payments/TransfersSwitch.vue'
import TransferSurcharge from '@/components/admin/payments/TransferSurcharge.vue'
import BankAccountCard from '@/components/admin/payments/BankAccountCard.vue'
import BankAccountForm from '@/components/admin/payments/BankAccountForm.vue'
import BankPreview from '@/components/admin/payments/BankPreview.vue'
import { usePayments } from '@/composables/admin/usePayments'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'

const p = usePayments()
const on = computed(() => Boolean(p.state.value?.acceptTransfers))
const deleteText = computed(() => {
  const target = p.toDelete.value
  return target ? copy.deleteText(target.bank, target.number.slice(-4)) : ''
})
</script>

<template>
  <div class="payments">
    <AdminPageHead :title="copy.title" :subtitle="copy.subtitle" />

    <AdminSkeleton v-if="p.loading.value" :rows="3" height="7rem" />

    <AdminEmpty
      v-else-if="p.loadError.value"
      icon="fa-solid fa-plug-circle-xmark"
      title="No se pudo cargar"
      :text="p.loadError.value"
    >
      <AdminButton variant="primary" @click="p.load">Reintentar</AdminButton>
    </AdminEmpty>

    <div v-else class="payments__layout">
      <div class="payments__main">
        <TransfersSwitch
          :on="on"
          :busy="p.switching.value"
          :active-count="p.activeAccounts.value.length"
          @change="p.setTransfers"
        />

        <AdminPanel :title="copy.accountsTitle" icon="fa-solid fa-building-columns">
          <template v-if="p.accounts.value.length" #actions>
            <AdminButton variant="soft" icon="fa-solid fa-plus" @click="p.openForm(null)">
              {{ copy.addAccount }}
            </AdminButton>
          </template>

          <div v-if="p.accounts.value.length" class="payments__accounts">
            <BankAccountCard
              v-for="account in p.accounts.value"
              :key="account._id"
              :account="account"
              :busy="p.busyId.value === account._id"
              @toggle="p.toggleAccount(account)"
              @edit="p.openForm(account)"
              @remove="p.toDelete.value = account"
            />
          </div>
          <AdminEmpty v-else icon="fa-solid fa-building-columns" :title="copy.emptyTitle" :text="copy.emptyText">
            <AdminButton variant="primary" icon="fa-solid fa-plus" @click="p.openForm(null)">
              {{ copy.addAccount }}
            </AdminButton>
          </AdminEmpty>
        </AdminPanel>

        <TransferSurcharge v-model="p.surcharge.value" :saving="p.savingSurcharge.value" @save="p.saveSurcharge" />
      </div>

      <aside class="payments__side">
        <BankPreview :accounts="p.activeAccounts.value" :on="on" />
      </aside>
    </div>

    <BankAccountForm
      :open="p.formOpen.value"
      :editing="!!p.editing.value"
      :draft="p.draft"
      :errors="p.visibleErrors.value"
      :banks="p.state.value?.banks || []"
      :notice="p.formNotice.value"
      :saving="p.saving.value"
      @close="p.closeForm"
      @save="p.saveAccount"
    />

    <BaseModal
      :open="!!p.toDelete.value"
      :title="copy.deleteTitle"
      :message="deleteText"
      :confirm-label="copy.deleteConfirm"
      danger
      @confirm="p.confirmDelete"
      @cancel="p.toDelete.value = null"
    />
  </div>
</template>

<style scoped lang="scss">
.payments {
  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1 1 auto;
    min-width: 0;
    max-width: 760px;
  }

  &__side {
    flex: 0 0 auto;

    @include from('lg') {
      flex-basis: 340px;
      position: sticky;
      top: 1rem;
    }
  }

  &__accounts {
    @include flex-cards(300px, 0.8rem);
  }
}
</style>
