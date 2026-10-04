<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BotSearch from './BotSearch.vue'
import BotSessionCard from './BotSessionCard.vue'
import { botAdminCopy } from '@/config/site'
import { useBotAdminSessions, type BotSessionAction } from '@/composables/useBotAdminSessions'

const copy = botAdminCopy.sessions
const { items, page, pages, total, q, loading, error, busy, load, search, run } = useBotAdminSessions()

// Reiniciar borra carrito y paso: siempre pasa por confirmación.
const confirming = ref('')

function onAction(action: BotSessionAction, phone: string) {
  if (action === 'reset') confirming.value = phone
  else run(action, phone)
}

function confirmReset() {
  const phone = confirming.value
  confirming.value = ''
  if (phone) run('reset', phone)
}

onMounted(() => load())
</script>

<template>
  <div class="bsp">
    <div class="bsp__tools">
      <BotSearch :model-value="q" :placeholder="copy.search" @update:model-value="search" />
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="load()">{{ botAdminCopy.refresh }}</AdminButton>
    </div>

    <AdminSkeleton v-if="loading && !items.length" :rows="4" height="9rem" />

    <AdminEmpty v-else-if="error" icon="fa-solid fa-plug-circle-xmark" :title="botAdminCopy.loadError" :text="error">
      <AdminButton variant="primary" @click="load()">{{ botAdminCopy.retry }}</AdminButton>
    </AdminEmpty>

    <AdminEmpty v-else-if="!items.length" icon="fa-solid fa-comments" :title="copy.emptyTitle" :text="copy.emptyText" />

    <ul v-else class="bsp__list" :class="{ 'bsp__list--busy': loading }">
      <BotSessionCard v-for="s in items" :key="s.phone" :session="s" :busy="busy" @action="onAction" />
    </ul>

    <AdminPager :page="page" :pages="pages" :total="total" @change="load" />

    <BaseModal
      :open="!!confirming"
      :title="copy.confirmTitle"
      :message="copy.confirmText(confirming)"
      :confirm-label="copy.confirmCta"
      :cancel-label="copy.cancel"
      danger
      @confirm="confirmReset"
      @cancel="confirming = ''"
    />
  </div>
</template>

<style scoped lang="scss">
.bsp {
  @include flex(column, stretch, flex-start, 1rem);

  &__tools {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__list {
    list-style: none;
    @include flex-cards(340px, 0.75rem);
    @include transition(opacity);

    &--busy {
      opacity: 0.55;
    }
  }
}
</style>
