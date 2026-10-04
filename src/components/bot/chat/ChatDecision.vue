<script setup lang="ts">
import { computed } from 'vue'
import type { BotChatMeta } from '@/services/bot.service'
import { endpointIcon } from './chatCopy'

const props = defineProps<{ meta: BotChatMeta; align: 'start' | 'end' }>()

const join = (parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' · ')

// /brain decide la ruta; el flujo responde. Un turno sin flujo (bot en silencio) solo trae /brain.
const brainLine = computed(() => {
  const brain = props.meta.brain
  if (!brain) return ''
  return `brain → ${join([brain.route, brain.decision, `${brain.ms} ms`])}`
})

const flowLine = computed(() => {
  const m = props.meta
  return `${m.endpoint || 'flujo'} → ${join([m.route, m.decision, m.step && `paso ${m.step}`, `${m.ms} ms`])}`
})
</script>

<template>
  <div class="cdec" :class="[`cdec--${align}`, { 'cdec--error': meta.error }]">
    <p v-if="brainLine" class="cdec__line">
      <i :class="endpointIcon('brain')" aria-hidden="true"></i><span>{{ brainLine }}</span>
    </p>
    <p class="cdec__line">
      <i :class="endpointIcon(meta.endpoint)" aria-hidden="true"></i><span>{{ flowLine }}</span>
    </p>
    <p v-if="meta.error" class="cdec__line cdec__line--error" role="note">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i><span>{{ meta.error }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.cdec {
  @include flex(column, flex-start, flex-start, 0.15rem);
  max-width: min(100%, 34rem);
  margin-top: 0.3rem;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  border: 1px dashed $alu-dark;
  background: rgba($surface, 0.6);
  font-family: $font-mono;
  font-size: 0.66rem;
  line-height: 1.4;
  color: $ink-muted;

  &--end {
    align-self: flex-end;
  }

  &--start {
    align-self: flex-start;
  }

  &--error {
    border-color: rgba($danger, 0.5);
    background: $danger-bg;
  }

  &__line {
    @include flex(row, baseline, flex-start, 0.4rem);
    overflow-wrap: anywhere;

    i {
      flex-shrink: 0;
      width: 0.9rem;
      text-align: center;
      color: $accent;
    }

    &--error {
      color: $danger;
      font-weight: 600;

      i {
        color: $danger;
      }
    }
  }
}
</style>
