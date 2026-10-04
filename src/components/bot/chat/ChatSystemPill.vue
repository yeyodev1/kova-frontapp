<script setup lang="ts">
import type { BotChatMessage } from '@/services/bot.service'
import { botChatCopy as copy, systemIcons } from './chatCopy'

defineProps<{ message: BotChatMessage; time: string; showDecisions: boolean }>()
</script>

<template>
  <li class="cpill" :class="`cpill--${message.kind || 'info'}`">
    <span class="cpill__body">
      <i
        :class="message.kind ? systemIcons[message.kind] : 'fa-solid fa-circle-info'"
        aria-hidden="true"
      ></i>
      <RouterLink
        v-if="message.kind === 'order_created' && message.meta?.orderNumber"
        :to="{ path: '/admin/pedidos', query: { q: message.meta.orderNumber } }"
        class="cpill__link"
      >
        {{ message.text }}
      </RouterLink>
      <a
        v-else-if="message.kind === 'payment_link' && message.meta?.paymentLink"
        :href="message.meta.paymentLink"
        target="_blank"
        rel="noopener"
        class="cpill__link"
        :title="copy.paymentLink"
      >
        {{ message.text }}
      </a>
      <span v-else>{{ message.text }}</span>
      <time class="cpill__time" :datetime="message.at">{{ time }}</time>
    </span>
    <span
      v-if="showDecisions && message.kind === 'error' && message.meta?.error"
      class="cpill__error"
    >
      {{ message.meta.endpoint }} · {{ message.meta.error }}
    </span>
  </li>
</template>

<style scoped lang="scss">
.cpill {
  @include flex(column, center, flex-start, 0.25rem);
  margin: 0.35rem 0;
  text-align: center;

  &__body {
    @include flex(row, center, center, 0.45rem);
    flex-wrap: wrap;
    max-width: 92%;
    padding: 0.3rem 0.8rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 1px solid $line;
    box-shadow: $shadow-sm;
    font-size: 0.75rem;
    font-weight: 700;
    color: $ink-soft;

    i {
      color: $accent;
    }
  }

  &__link {
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
    @include focus-ring;
  }

  &__time {
    font-family: $font-mono;
    font-size: 0.62rem;
    font-weight: 500;
    color: $ink-muted;
  }

  &--order_created &__body,
  &--payment_confirmed &__body {
    background: $accent-soft;
    border-color: rgba($accent, 0.35);
    font-family: $font-mono;
  }

  &--human_request &__body {
    background: $cta-soft;
    border-color: rgba($cta, 0.4);

    i {
      color: $cta-deep;
    }
  }

  &--silenced &__body,
  &--duplicated &__body {
    background: $alu-light;
    font-weight: 600;
    color: $ink-muted;

    i {
      color: $ink-muted;
    }
  }

  &--error &__body {
    background: $danger-bg;
    border-color: rgba($danger, 0.4);
    color: $danger;

    i {
      color: $danger;
    }
  }

  &__error {
    max-width: 92%;
    font-family: $font-mono;
    font-size: 0.66rem;
    color: $danger;
    overflow-wrap: anywhere;
  }
}
</style>
