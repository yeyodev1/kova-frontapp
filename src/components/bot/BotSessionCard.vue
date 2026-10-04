<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import { botAdminCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import { formatDateTime } from '@/composables/admin/format'
import { waLink } from '@/composables/admin/whatsapp'
import { isSilenced, type BotSessionAction } from '@/composables/useBotAdminSessions'
import type { BotSession } from '@/types'

const props = defineProps<{ session: BotSession; busy: string }>()
const emit = defineEmits<{ action: [action: BotSessionAction, phone: string] }>()

const copy = botAdminCopy.sessions
const silenced = computed(() => isSilenced(props.session))
const cartTotal = computed(() => props.session.cart.reduce((sum, line) => sum + line.price * line.quantity, 0))
const isBusy = (action: BotSessionAction) => props.busy === `${action}:${props.session.phone}`
</script>

<template>
  <li class="bsc" :class="{ 'bsc--human': session.humanRequested && !silenced }">
    <header class="bsc__head">
      <div class="bsc__who">
        <p class="bsc__name">{{ session.name || copy.noName }}</p>
        <p class="bsc__phone">{{ session.phone }}</p>
      </div>
      <time v-if="session.lastMessageAt" class="bsc__time" :datetime="session.lastMessageAt">
        {{ formatDateTime(session.lastMessageAt) }}
      </time>
    </header>

    <div class="bsc__chips">
      <span v-if="session.humanRequested" class="bsc__chip bsc__chip--human">
        <i class="fa-solid fa-headset" aria-hidden="true"></i> {{ copy.human }}
      </span>
      <span v-if="silenced" class="bsc__chip bsc__chip--muted">
        <i class="fa-solid fa-volume-xmark" aria-hidden="true"></i> {{ copy.silencedUntil(formatDateTime(session.silencedUntil)) }}
      </span>
      <span v-if="session.optOut" class="bsc__chip bsc__chip--danger">
        <i class="fa-solid fa-ban" aria-hidden="true"></i> {{ copy.optOut }}
      </span>
      <span class="bsc__chip bsc__chip--step">{{ copy.step }}: {{ session.step || 'idle' }}</span>
      <RouterLink
        v-if="session.orderNumber"
        :to="{ path: '/admin/pedidos', query: { q: session.orderNumber } }"
        class="bsc__chip bsc__chip--order"
      >
        <i class="fa-solid fa-receipt" aria-hidden="true"></i> {{ session.orderNumber }}
      </RouterLink>
    </div>

    <p v-if="session.lastMessage" class="bsc__last">
      <span class="visually-hidden">{{ copy.lastMessage }}:</span>"{{ session.lastMessage }}"
    </p>

    <div class="bsc__cart">
      <p class="bsc__label">{{ copy.cart }}</p>
      <ul v-if="session.cart.length">
        <li v-for="(line, i) in session.cart" :key="i">
          <span>{{ line.quantity }} x {{ line.name }}</span>
          <b>{{ formatCents(line.price * line.quantity) }}</b>
        </li>
        <li v-if="session.cart.length > 1" class="bsc__sum">
          <span>{{ copy.cartTotal }}</span><b>{{ formatCents(cartTotal) }}</b>
        </li>
      </ul>
      <p v-else class="bsc__empty">{{ copy.emptyCart }}</p>
    </div>

    <footer class="bsc__actions">
      <AdminButton variant="whatsapp" icon="fa-brands fa-whatsapp" :href="waLink(session.phone, copy.waMessage)">
        {{ copy.openWhatsapp }}
      </AdminButton>
      <AdminButton
        v-if="silenced"
        variant="soft"
        icon="fa-solid fa-volume-high"
        :loading="isBusy('unsilence')"
        :disabled="!!busy"
        @click="emit('action', 'unsilence', session.phone)"
      >
        {{ copy.unsilence }}
      </AdminButton>
      <AdminButton
        v-else
        variant="soft"
        icon="fa-solid fa-volume-xmark"
        :loading="isBusy('silence')"
        :disabled="!!busy"
        @click="emit('action', 'silence', session.phone)"
      >
        {{ copy.silence }}
      </AdminButton>
      <AdminButton
        variant="ghost"
        icon="fa-solid fa-rotate-left"
        :loading="isBusy('reset')"
        :disabled="!!busy"
        @click="emit('action', 'reset', session.phone)"
      >
        {{ copy.reset }}
      </AdminButton>
    </footer>
  </li>
</template>

<style scoped lang="scss">
.bsc {
  @include card;
  @include flex(column, stretch, flex-start, 0.75rem);
  padding: 0.95rem 1rem;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;

  &--human {
    border-color: rgba($cta, 0.45);
    box-shadow:
      0 0 0 3px rgba($cta, 0.1),
      $shadow-sm;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
  }

  &__who {
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__phone,
  &__time {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__time {
    flex-shrink: 0;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.35rem);
    padding: 0.22rem 0.6rem;
    border-radius: $radius-pill;
    background: $sand;
    color: $ink-soft;
    font-size: 0.72rem;
    font-weight: 600;

    &--human {
      background: $cta;
      color: #fff;
    }

    &--muted {
      background: $warning-bg;
      color: darken($warning, 22%);
    }

    &--danger {
      background: $danger-bg;
      color: $danger;
    }

    &--step {
      font-family: $font-mono;
      font-weight: 500;
    }

    &--order {
      background: $accent-soft;
      color: $accent-deep;
      font-family: $font-mono;
      @include focus-ring;

      &:hover {
        background: darken($accent-soft, 4%);
      }
    }
  }

  &__last {
    font-size: $text-sm;
    color: $ink-soft;
    font-style: italic;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__cart {
    padding: 0.65rem 0.8rem;
    border-radius: 12px;
    background: $alu-light;
    border: 1px solid $line;

    ul {
      list-style: none;
      @include flex(column, stretch, flex-start, 0.25rem);
      margin-top: 0.3rem;
    }

    li {
      @include flex(row, baseline, space-between, 0.75rem);
      font-size: $text-sm;

      b {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    }
  }

  &__label {
    @include eyebrow;
    font-size: 0.62rem;
  }

  &__sum {
    padding-top: 0.25rem;
    border-top: 1px dashed $line;
    font-weight: 700;
  }

  &__empty {
    margin-top: 0.2rem;
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }
}
</style>
