<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import BotTabs from '@/components/bot/BotTabs.vue'
import BotSessionsPanel from '@/components/bot/BotSessionsPanel.vue'
import BotEventsPanel from '@/components/bot/BotEventsPanel.vue'
import BotConfigPanel from '@/components/bot/BotConfigPanel.vue'
import { botAdminCopy as copy } from '@/config/site'
import { useBotAdminSessions } from '@/composables/useBotAdminSessions'

type Tab = 'sessions' | 'events' | 'config'

const route = useRoute()
const router = useRouter()
const { humanPending } = useBotAdminSessions()

// La pestaña vive en la URL: recargar o compartir el link abre la misma vista.
const tab = computed<Tab>({
  get: () => {
    const value = String(route.query.tab || '')
    return value === 'events' || value === 'config' ? value : 'sessions'
  },
  set: (value) => router.replace({ query: value === 'sessions' ? {} : { tab: value } }),
})

const counts = computed(() => ({ sessions: humanPending.value }))
</script>

<template>
  <div class="bot">
    <AdminPageHead :title="copy.title" :subtitle="copy.subtitle" />

    <BotTabs v-model="tab" :tabs="copy.tabs" :counts="counts" />

    <div :id="`bot-panel-${tab}`" role="tabpanel" :aria-labelledby="`bot-tab-${tab}`" class="bot__panel">
      <BotSessionsPanel v-if="tab === 'sessions'" />
      <BotEventsPanel v-else-if="tab === 'events'" />
      <BotConfigPanel v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bot {
  @include flex(column, stretch, flex-start, 1rem);

  &__panel {
    min-width: 0;
  }
}
</style>
