<script setup lang="ts">
import { computed } from 'vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import AdminToggle from '@/components/admin/AdminToggle.vue'
import BotSearch from './BotSearch.vue'
import BotEventRow from './BotEventRow.vue'
import { botAdminCopy } from '@/config/site'
import { useBotAdminEvents, formatEventTime } from '@/composables/useBotAdminEvents'

const copy = botAdminCopy.events
const { items, page, pages, total, phone, onlyErrors, live, loading, error, syncedAt, load } = useBotAdminEvents()

const syncLabel = computed(() => (syncedAt.value ? copy.updated(formatEventTime(syncedAt.value.toISOString())) : ''))
</script>

<template>
  <div class="bep">
    <div class="bep__tools">
      <BotSearch v-model="phone" :placeholder="copy.phone" />
      <AdminToggle v-model="onlyErrors" :label="copy.onlyErrors" />
      <button type="button" class="bep__live" :class="{ 'bep__live--on': live }" :aria-pressed="live" @click="live = !live">
        <span class="bep__dot" aria-hidden="true"></span>
        {{ live ? copy.live : copy.paused }}
        <small v-if="syncLabel">{{ syncLabel }}</small>
      </button>
    </div>

    <AdminSkeleton v-if="loading && !items.length" :rows="5" height="6rem" />

    <AdminEmpty v-else-if="error && !items.length" icon="fa-solid fa-plug-circle-xmark" :title="botAdminCopy.loadError" :text="error">
      <AdminButton variant="primary" @click="load(1)">{{ botAdminCopy.retry }}</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length"
      :icon="onlyErrors ? 'fa-solid fa-circle-check' : 'fa-solid fa-wave-square'"
      :title="copy.emptyTitle"
      :text="onlyErrors ? copy.emptyErrors : copy.emptyText"
    />

    <template v-else>
      <p v-if="error" class="bep__stale" role="alert"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ error }}</p>
      <ul class="bep__list" :class="{ 'bep__list--busy': loading }" aria-live="polite">
        <BotEventRow v-for="ev in items" :key="ev._id" :event="ev" @phone="phone = $event" />
      </ul>
    </template>

    <AdminPager :page="page" :pages="pages" :total="total" @change="load" />
  </div>
</template>

<style scoped lang="scss">
.bep {
  @include flex(column, stretch, flex-start, 1rem);

  &__tools {
    @include flex(row, center, flex-start, 0.6rem 1rem);
    flex-wrap: wrap;
  }

  &__live {
    @include flex(row, center, flex-start, 0.45rem);
    @include focus-ring;
    min-height: 2.5rem;
    padding: 0.4rem 0.85rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;

    small {
      font-family: $font-mono;
      font-size: 0.68rem;
      font-weight: 500;
      color: $ink-muted;
    }

    &--on {
      color: $accent-deep;
      border-color: rgba($success, 0.4);
    }
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: $alu-dark;
  }

  &__live--on &__dot {
    background: $success;
    animation: bep-pulse 1.8s ease-in-out infinite;
  }

  &__stale {
    @include flex(row, baseline, flex-start, 0.45rem);
    padding: 0.55rem 0.8rem;
    border-radius: 12px;
    background: $warning-bg;
    color: darken($warning, 24%);
    font-size: $text-sm;
  }

  &__list {
    @include card;
    list-style: none;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;
    overflow: hidden;
    @include transition(opacity);

    &--busy {
      opacity: 0.6;
    }
  }
}

@keyframes bep-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@include reduced-motion {
  .bep__dot {
    animation: none !important;
  }
}
</style>
