<script setup lang="ts">
import { botAdminCopy } from '@/config/site'
import { botChatCopy } from './chat/chatCopy'
import { formatEventTime } from '@/composables/useBotAdminEvents'
import type { BotEvent } from '@/types'

defineProps<{ event: BotEvent }>()
const emit = defineEmits<{ phone: [phone: string] }>()
const copy = botAdminCopy.events
</script>

<template>
  <li class="ber" :class="{ 'ber--error': event.error }">
    <header class="ber__head">
      <time class="ber__time" :datetime="event.createdAt">{{ formatEventTime(event.createdAt) }}</time>
      <RouterLink :to="`/admin/bot/chat/${encodeURIComponent(event.phone)}`" class="ber__phone" :title="botChatCopy.open">
        <i class="fa-solid fa-comments" aria-hidden="true"></i> {{ event.phone }}
      </RouterLink>
      <button type="button" class="ber__filter" :title="copy.phone" :aria-label="copy.phone" @click="emit('phone', event.phone)">
        <i class="fa-solid fa-filter" aria-hidden="true"></i>
      </button>
      <span class="ber__ms">{{ event.ms }} ms</span>
    </header>

    <div class="ber__chips">
      <span class="ber__chip ber__chip--endpoint"><i class="fa-solid fa-plug" aria-hidden="true"></i> {{ event.endpoint }}</span>
      <span v-if="event.route" class="ber__chip ber__chip--route">route: {{ event.route }}</span>
      <span v-if="event.decision" class="ber__chip">{{ event.decision }}</span>
    </div>

    <p v-if="event.error" class="ber__error" role="note">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ event.error }}
    </p>

    <details class="ber__fold">
      <summary>
        <span class="ber__who">{{ copy.client }}</span>
        <span class="ber__preview">{{ event.message || copy.noMessage }}</span>
        <i class="fa-solid fa-chevron-down ber__chev" aria-hidden="true"></i>
      </summary>
      <p class="ber__text">{{ event.message || copy.noMessage }}</p>
    </details>
    <details class="ber__fold ber__fold--bot">
      <summary>
        <span class="ber__who">{{ copy.bot }}</span>
        <span class="ber__preview">{{ event.reply || copy.noReply }}</span>
        <i class="fa-solid fa-chevron-down ber__chev" aria-hidden="true"></i>
      </summary>
      <p class="ber__text">{{ event.reply || copy.noReply }}</p>
    </details>
  </li>
</template>

<style scoped lang="scss">
.ber {
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 0.85rem 1rem;
  border-bottom: 1px solid $line;

  &:last-child {
    border-bottom: 0;
  }

  &--error {
    background: rgba($danger, 0.05);
    box-shadow: inset 3px 0 0 $danger;
  }

  &__head {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-mono;
    font-size: $text-xs;
  }

  &__time {
    color: $ink-soft;
    font-weight: 600;
  }

  &__phone {
    @include flex(row, center, flex-start, 0.3rem);
    color: $accent-deep;
    font-family: inherit;
    font-size: inherit;
    text-decoration: underline dotted;
    text-underline-offset: 3px;
    @include focus-ring;
  }

  &__filter {
    @include flex(row, center, center);
    @include focus-ring;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    color: $ink-muted;
    font-size: 0.65rem;

    &:hover {
      background: $sand;
      color: $accent-deep;
    }
  }

  &__ms {
    margin-left: auto;
    color: $ink-muted;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.3rem);
    padding: 0.18rem 0.55rem;
    border-radius: $radius-pill;
    background: $sand;
    color: $ink-soft;
    font-family: $font-mono;
    font-size: 0.68rem;

    &--endpoint {
      background: $accent-deep;
      color: #fff;
    }

    &--route {
      background: $accent-soft;
      color: $accent-deep;
      font-weight: 600;
    }
  }

  &__error {
    @include flex(row, baseline, flex-start, 0.4rem);
    padding: 0.45rem 0.65rem;
    border-radius: 10px;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__fold {
    font-size: $text-sm;

    summary {
      @include flex(row, baseline, flex-start, 0.5rem);
      cursor: pointer;
      list-style: none;
      min-width: 0;

      &::-webkit-details-marker {
        display: none;
      }
    }

    &[open] .ber__preview {
      visibility: hidden;
    }

    &[open] .ber__chev {
      transform: rotate(180deg);
    }
  }

  &__who {
    @include eyebrow;
    flex: 0 0 3.6rem;
    font-size: 0.6rem;
    color: $ink-muted;
  }

  &__fold--bot &__who {
    color: $accent;
  }

  &__preview {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $ink-soft;
  }

  &__chev {
    flex-shrink: 0;
    font-size: 0.6rem;
    color: $ink-muted;
    transition: transform $dur-fast ease;
  }

  &__text {
    margin: 0.3rem 0 0 4.1rem;
    padding: 0.55rem 0.7rem;
    border-radius: 10px;
    background: $alu-light;
    border: 1px solid $line;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.45;

    @include until('sm') {
      margin-left: 0;
    }
  }
}
</style>
