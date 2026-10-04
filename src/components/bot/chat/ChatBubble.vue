<script setup lang="ts">
import { computed } from 'vue'
import type { BotChatMessage } from '@/services/bot.service'
import ChatDecision from './ChatDecision.vue'
import { botChatCopy as copy } from './chatCopy'

const props = defineProps<{ message: BotChatMessage; time: string; showDecisions: boolean }>()

const mine = computed(() => props.message.role === 'bot')
const FILE_PLACEHOLDER = '[archivo adjunto]'
const url = computed(() => props.message.mediaUrl || '')
const isImage = computed(
  () => /\.(jpe?g|png|gif|webp|heic)(\?|$)/i.test(url.value) || /\/image\/upload\//.test(url.value),
)
const fileName = computed(() =>
  decodeURIComponent((url.value.split('?')[0] ?? '').split('/').pop() || copy.file),
)

// *negrita* de WhatsApp sin v-html: el texto del cliente nunca se interpreta como HTML.
const parts = computed(() => {
  const text = url.value && props.message.text === FILE_PLACEHOLDER ? '' : props.message.text
  return text
    .split(/(\*[^*\n]+\*)/g)
    .filter(Boolean)
    .map((chunk) =>
      /^\*[^*\n]+\*$/.test(chunk)
        ? { bold: true, text: chunk.slice(1, -1) }
        : { bold: false, text: chunk },
    )
})

// Solo se muestra la franja si hay algo que decir: en el cliente, cuando /brain no tuvo flujo.
const decision = computed(() => (props.showDecisions ? props.message.meta : undefined))
</script>

<template>
  <li class="cb" :class="mine ? 'cb--bot' : 'cb--client'">
    <div class="cb__bubble" :class="{ 'cb__bubble--history': message.source === 'history' }">
      <a
        v-if="url && isImage"
        :href="url"
        target="_blank"
        rel="noopener"
        class="cb__media"
        :title="copy.openFile"
      >
        <img :src="url" :alt="copy.file" loading="lazy" />
      </a>
      <a
        v-else-if="url"
        :href="url"
        target="_blank"
        rel="noopener"
        class="cb__file"
        :title="copy.openFile"
      >
        <i class="fa-solid fa-file-lines" aria-hidden="true"></i>
        <span>{{ fileName }}</span>
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
      </a>
      <p v-if="parts.length" class="cb__text">
        <template v-for="(part, i) in parts" :key="i"
          ><b v-if="part.bold">{{ part.text }}</b
          ><template v-else>{{ part.text }}</template></template
        >
      </p>
      <p v-else-if="!url" class="cb__text cb__text--empty">{{ copy.noReply }}</p>
      <span class="cb__foot">
        <i
          v-if="message.source === 'history'"
          class="fa-solid fa-clock-rotate-left"
          :title="copy.fromHistory"
          aria-hidden="true"
        ></i>
        <time :datetime="message.at">{{ time }}</time>
        <i v-if="mine" class="fa-solid fa-robot" aria-hidden="true"></i>
      </span>
    </div>
    <ChatDecision v-if="decision" :meta="decision" :align="mine ? 'end' : 'start'" />
  </li>
</template>

<style scoped lang="scss">
.cb {
  @include flex(column, flex-start, flex-start, 0);
  margin-top: 0.2rem;

  &--bot {
    align-items: flex-end;
  }

  &__bubble {
    position: relative;
    @include flex(column, stretch, flex-start, 0.35rem);
    max-width: min(86%, 30rem);
    padding: 0.5rem 0.7rem 0.35rem;
    border-radius: 16px;
    box-shadow: $shadow-sm;
    overflow-wrap: anywhere;

    &--history {
      border-style: dashed;
    }
  }

  &--client &__bubble {
    background: $surface;
    border: 1px solid $line;
    border-top-left-radius: 4px;
    color: $ink;
  }

  &--bot &__bubble {
    @include moss;
    border: 1px solid rgba(#fff, 0.06);
    border-top-right-radius: 4px;
  }

  &__text {
    white-space: pre-wrap;
    font-size: $text-sm;
    line-height: 1.45;

    &--empty {
      opacity: 0.6;
      font-style: italic;
    }
  }

  &__media {
    display: block;
    border-radius: 10px;
    overflow: hidden;
    @include focus-ring;

    img {
      display: block;
      width: 100%;
      max-width: 15rem;
      max-height: 15rem;
      object-fit: cover;
      background: $alu-light;
    }
  }

  &__file {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.5rem 0.65rem;
    border-radius: 10px;
    background: rgba($ink, 0.06);
    font-size: $text-xs;
    font-weight: 600;
    color: inherit;
    @include focus-ring;

    span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &--bot &__file {
    background: rgba(#fff, 0.1);
  }

  &__foot {
    @include flex(row, center, flex-end, 0.35rem);
    font-family: $font-mono;
    font-size: 0.6rem;
    opacity: 0.65;
  }
}
</style>
