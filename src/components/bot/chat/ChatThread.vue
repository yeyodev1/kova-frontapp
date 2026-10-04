<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import type { BotChatMessage } from '@/services/bot.service'
import ChatBubble from './ChatBubble.vue'
import ChatSystemPill from './ChatSystemPill.vue'
import { botChatCopy as copy } from './chatCopy'

const props = defineProps<{
  messages: BotChatMessage[]
  showDecisions: boolean
  hasMore: boolean
  loadingOlder: boolean
}>()
const emit = defineEmits<{ older: [] }>()

const clock = new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' })
const longDay = new Intl.DateTimeFormat('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

function dayLabel(d: Date) {
  const today = new Date()
  const yesterday = new Date(Date.now() - 86_400_000)
  if (dayKey(d) === dayKey(today)) return copy.today
  if (dayKey(d) === dayKey(yesterday)) return copy.yesterday
  return longDay.format(d)
}

// Los avisos de duplicado solo sirven para depurar: con las decisiones ocultas, fuera.
const days = computed(() => {
  const groups: {
    key: string
    label: string
    items: { message: BotChatMessage; time: string }[]
  }[] = []
  for (const message of props.messages) {
    if (!props.showDecisions && message.kind === 'duplicated') continue
    const date = new Date(message.at)
    const key = dayKey(date)
    let group = groups[groups.length - 1]
    if (!group || group.key !== key) {
      group = { key, label: dayLabel(date), items: [] }
      groups.push(group)
    }
    group.items.push({ message, time: clock.format(date) })
  }
  return groups
})
</script>

<template>
  <div class="cthread">
    <div v-if="hasMore" class="cthread__older">
      <AdminButton icon="fa-solid fa-arrow-up" :loading="loadingOlder" @click="emit('older')">{{
        copy.older
      }}</AdminButton>
    </div>

    <section v-for="day in days" :key="day.key" class="cthread__day" :aria-label="day.label">
      <p class="cthread__sep">
        <span>{{ day.label }}</span>
      </p>
      <ol class="cthread__list">
        <template v-for="item in day.items" :key="item.message.id">
          <ChatSystemPill
            v-if="item.message.role === 'system'"
            :message="item.message"
            :time="item.time"
            :show-decisions="showDecisions"
          />
          <ChatBubble
            v-else
            :message="item.message"
            :time="item.time"
            :show-decisions="showDecisions"
          />
        </template>
      </ol>
    </section>
  </div>
</template>

<style scoped lang="scss">
.cthread {
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 0.75rem 0.6rem 1rem;
  border-radius: $radius-md;
  background-color: $paper;
  background-image: radial-gradient(rgba($alu-dark, 0.35) 1px, transparent 1px);
  background-size: 14px 14px;
  border: 1px solid $line;

  @include from('md') {
    padding: 1rem 1.25rem 1.25rem;
  }

  &__older {
    @include flex(row, center, center);
  }

  &__sep {
    position: sticky;
    top: calc(58px + 3.6rem);
    z-index: 2;

    @include from('md') {
      top: 4.1rem;
    }

    @include flex(row, center, center);
    margin: 0.4rem 0;

    span {
      @include eyebrow;
      padding: 0.2rem 0.7rem;
      border-radius: $radius-pill;
      background: rgba($surface, 0.92);
      border: 1px solid $line;
      font-size: 0.6rem;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.3rem);
  }
}
</style>
