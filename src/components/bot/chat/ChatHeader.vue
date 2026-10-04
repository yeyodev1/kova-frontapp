<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import { botAdminCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import { formatDateTime } from '@/composables/admin/format'
import { waLink } from '@/composables/admin/whatsapp'
import { isSilenced, type BotSessionAction } from '@/composables/useBotAdminSessions'
import type { BotSession } from '@/types'
import { botChatCopy } from './chatCopy'

const props = defineProps<{ phone: string; session: BotSession | null; busy: string }>()
const emit = defineEmits<{ action: [action: BotSessionAction] }>()

const copy = botAdminCopy.sessions
const silenced = computed(() => !!props.session && isSilenced(props.session))
const cart = computed(() => {
  const s = props.session
  if (!s) return null
  if (s.cart.length)
    return {
      summary: s.cart.map((line) => `${line.quantity} x ${line.name}`).join(', '),
      total: s.cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    }
  return s.cartSummary ? { summary: s.cartSummary, total: s.cartTotal || 0 } : null
})
</script>

<template>
  <header class="chead">
    <RouterLink to="/admin/bot" class="chead__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ botChatCopy.back }}
    </RouterLink>

    <div class="chead__who">
      <span class="chead__avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
      <div class="chead__id">
        <h1 class="chead__name">{{ session?.name || copy.noName }}</h1>
        <a
          class="chead__phone"
          :href="waLink(phone, copy.waMessage)"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ phone }}
        </a>
      </div>
    </div>

    <div class="chead__chips">
      <span v-if="!session" class="chead__chip">{{ botChatCopy.noSession }}</span>
      <template v-else>
        <span class="chead__chip chead__chip--step"
          >{{ copy.step }}: {{ session.step || 'idle' }}</span
        >
        <span v-if="session.humanRequested" class="chead__chip chead__chip--human">
          <i class="fa-solid fa-headset" aria-hidden="true"></i> {{ copy.human }}
        </span>
        <span v-if="silenced" class="chead__chip chead__chip--muted">
          <i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
          {{ copy.silencedUntil(formatDateTime(session.silencedUntil)) }}
        </span>
        <span v-if="session.optOut" class="chead__chip chead__chip--danger">
          <i class="fa-solid fa-ban" aria-hidden="true"></i> {{ copy.optOut }}
        </span>
        <RouterLink
          v-if="session.orderNumber"
          :to="{ path: '/admin/pedidos', query: { q: session.orderNumber } }"
          class="chead__chip chead__chip--order"
        >
          <i class="fa-solid fa-receipt" aria-hidden="true"></i> {{ session.orderNumber }}
        </RouterLink>
      </template>
    </div>

    <p v-if="session" class="chead__cart">
      <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
      <span v-if="cart"
        >{{ cart.summary }} <b>{{ formatCents(cart.total) }}</b></span
      >
      <span v-else class="chead__muted">{{ copy.emptyCart }}</span>
    </p>
    <p v-else class="chead__muted">{{ botChatCopy.expired }}</p>

    <div v-if="session" class="chead__actions">
      <AdminButton
        v-if="silenced"
        variant="soft"
        icon="fa-solid fa-volume-high"
        :loading="busy === 'unsilence'"
        :disabled="!!busy"
        @click="emit('action', 'unsilence')"
      >
        {{ copy.unsilence }}
      </AdminButton>
      <AdminButton
        v-else
        variant="soft"
        icon="fa-solid fa-volume-xmark"
        :loading="busy === 'silence'"
        :disabled="!!busy"
        @click="emit('action', 'silence')"
      >
        {{ copy.silence }}
      </AdminButton>
      <AdminButton
        variant="ghost"
        icon="fa-solid fa-rotate-left"
        :loading="busy === 'reset'"
        :disabled="!!busy"
        @click="emit('action', 'reset')"
      >
        {{ copy.reset }}
      </AdminButton>
    </div>
  </header>
</template>

<style scoped lang="scss">
.chead {
  @include card;
  @include flex(column, stretch, flex-start, 0.65rem);
  padding: 0.9rem 1rem;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;

  &__back {
    align-self: flex-start;
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 700;
    color: $accent;
    @include focus-ring;
  }

  &__who {
    @include flex(row, center, flex-start, 0.7rem);
    min-width: 0;
  }

  &__avatar {
    @include flex(row, center, center);
    flex: 0 0 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    @include alu-border(50%);
    color: $accent-deep;
  }

  &__id {
    min-width: 0;
  }

  &__name {
    @include display($text-lg, 750, 112%);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__phone {
    @include flex(row, center, flex-start, 0.35rem);
    font-family: $font-mono;
    font-size: $text-xs;
    color: $accent;
    @include focus-ring;
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

    &--step {
      font-family: $font-mono;
      font-weight: 500;
    }

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

    &--order {
      background: $accent-soft;
      color: $accent-deep;
      font-family: $font-mono;
      @include focus-ring;
    }
  }

  &__cart {
    @include flex(row, baseline, flex-start, 0.5rem);
    padding: 0.5rem 0.7rem;
    border-radius: 12px;
    background: $alu-light;
    border: 1px solid $line;
    font-size: $text-sm;

    i {
      color: $ink-muted;
    }

    b {
      margin-left: 0.3rem;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &__muted {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }
}
</style>
