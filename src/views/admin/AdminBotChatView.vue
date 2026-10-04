<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ChatHeader from '@/components/bot/chat/ChatHeader.vue'
import ChatControls from '@/components/bot/chat/ChatControls.vue'
import ChatThread from '@/components/bot/chat/ChatThread.vue'
import { botChatCopy as copy } from '@/components/bot/chat/chatCopy'
import { botAdminCopy } from '@/config/site'
import { useBotConversation } from '@/composables/useBotConversation'
import type { BotSessionAction } from '@/composables/useBotAdminSessions'

const route = useRoute()
const phone = computed(() => String(route.params.phone || ''))
const {
  messages,
  session,
  loading,
  loadingOlder,
  error,
  notFound,
  hasMore,
  syncedAt,
  unseen,
  busy,
  live,
  empty,
  showDecisions,
  load,
  loadOlder,
  run,
  scrollToBottom,
} = useBotConversation(phone)

const clock = new Intl.DateTimeFormat('es-EC', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})
const updated = computed(() => (syncedAt.value ? clock.format(syncedAt.value) : ''))

// Reiniciar borra carrito y paso: pasa por confirmación como en la lista de conversaciones.
const confirming = ref(false)
const sessionsCopy = botAdminCopy.sessions

function onAction(action: BotSessionAction) {
  if (action === 'reset') confirming.value = true
  else run(action)
}

function confirmReset() {
  confirming.value = false
  run('reset')
}
</script>

<template>
  <div class="bchat">
    <ChatHeader
      :phone="session?.phone || phone"
      :session="session"
      :busy="busy"
      @action="onAction"
    />

    <ChatControls v-model="showDecisions" :live="live" :updated="updated" :loading="loading" />

    <AdminSkeleton v-if="loading && !messages.length" :rows="6" height="3.5rem" />

    <AdminEmpty
      v-else-if="error && !messages.length"
      :icon="notFound ? 'fa-solid fa-comment-slash' : 'fa-solid fa-plug-circle-xmark'"
      :title="notFound ? copy.notFound : botAdminCopy.loadError"
      :text="notFound ? '' : error"
    >
      <AdminButton v-if="!notFound" variant="primary" @click="load()">{{
        botAdminCopy.retry
      }}</AdminButton>
      <AdminButton v-else to="/admin/bot" icon="fa-solid fa-arrow-left">{{
        copy.back
      }}</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="empty"
      icon="fa-solid fa-comments"
      :title="copy.emptyTitle"
      :text="copy.emptyText"
    />

    <template v-else>
      <p v-if="error" class="bchat__stale" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ error }}
      </p>
      <ChatThread
        :messages="messages"
        :show-decisions="showDecisions"
        :has-more="hasMore"
        :loading-older="loadingOlder"
        @older="loadOlder"
      />
    </template>

    <Transition name="slide-up">
      <button v-if="unseen" type="button" class="bchat__new" @click="scrollToBottom(true)">
        <i class="fa-solid fa-arrow-down" aria-hidden="true"></i> {{ copy.newMessages(unseen) }}
      </button>
    </Transition>

    <BaseModal
      :open="confirming"
      :title="sessionsCopy.confirmTitle"
      :message="sessionsCopy.confirmText(phone)"
      :confirm-label="sessionsCopy.confirmCta"
      :cancel-label="sessionsCopy.cancel"
      danger
      @confirm="confirmReset"
      @cancel="confirming = false"
    />
  </div>
</template>

<style scoped lang="scss">
.bchat {
  @include flex(column, stretch, flex-start, 0.75rem);
  max-width: 52rem;
  min-width: 0;

  &__stale {
    @include flex(row, baseline, flex-start, 0.4rem);
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: $warning-bg;
    color: darken($warning, 25%);
    font-size: $text-sm;
    font-weight: 600;
  }

  &__new {
    position: fixed;
    inset: auto 0 calc(5.2rem + env(safe-area-inset-bottom));
    z-index: 30;
    width: fit-content;
    margin-inline: auto;
    @include flex(row, center, center, 0.45rem);
    @include focus-ring;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    @include moss;
    font-size: $text-sm;
    font-weight: 700;
    box-shadow: $shadow-md;

    @include from('md') {
      bottom: 1.5rem;
    }
  }
}
</style>
