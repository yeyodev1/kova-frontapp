<script setup lang="ts">
import { computed } from 'vue'
import AdminStatusChip from '../AdminStatusChip.vue'
import { incidentCopy, severityMeta, statusMeta, timeAgo, typeMeta } from './incidentMeta'
import type { Incident } from '@/types/incidents'

const props = defineProps<{ incident: Incident; active?: boolean }>()
const emit = defineEmits<{ open: [id: string] }>()

const type = computed(() => typeMeta[props.incident.type] ?? typeMeta.manual)
const who = computed(() => [props.incident.customerName, props.incident.phone].filter(Boolean).join(' · '))
const closed = computed(() => ['resolved', 'dismissed'].includes(props.incident.status))
</script>

<template>
  <article
    class="card"
    :class="[`card--${incident.severity}`, { 'card--active': active, 'card--closed': closed }]"
  >
    <button type="button" class="card__hit" :aria-label="`Abrir ${incident.number}`" @click="emit('open', incident._id)"></button>
    <span class="card__icon" aria-hidden="true"><i :class="type.icon"></i></span>
    <div class="card__body">
      <p class="card__top">
        <span class="card__number">{{ incident.number }}</span>
        <span class="card__type">{{ type.label }}</span>
        <span class="card__ago">{{ timeAgo(incident.lastSeenAt) }}</span>
      </p>
      <h3 class="card__title">{{ incident.title }}</h3>
      <p v-if="who" class="card__who"><i class="fa-solid fa-user"></i> {{ who }}</p>
      <div class="card__meta">
        <AdminStatusChip :label="severityMeta[incident.severity].label" :tone="severityMeta[incident.severity].tone" />
        <AdminStatusChip
          v-if="incident.status !== 'open'"
          :label="statusMeta[incident.status].label"
          :tone="statusMeta[incident.status].tone"
          :icon="statusMeta[incident.status].icon"
        />
        <span v-if="incident.occurrences > 1" class="card__times">
          <i class="fa-solid fa-repeat"></i> {{ incidentCopy.times(incident.occurrences) }}
        </span>
        <span v-if="incident.assignee" class="card__assignee">
          <i class="fa-solid fa-user-check"></i> {{ incident.assignee.name || incident.assignee.email }}
        </span>
      </div>
      <div v-if="incident.order || incident.phone" class="card__links">
        <RouterLink v-if="incident.order" :to="`/admin/pedidos/${incident.order}`" class="card__link">
          <i class="fa-solid fa-receipt"></i> {{ incident.orderNumber || incidentCopy.order }}
        </RouterLink>
        <RouterLink v-if="incident.phone" :to="`/admin/bot/chat/${incident.phone}`" class="card__link">
          <i class="fa-brands fa-whatsapp"></i> {{ incidentCopy.chat }}
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  @include card;
  position: relative;
  @include flex(row, flex-start, flex-start, 0.8rem);
  padding: 0.85rem 0.9rem 0.85rem 1rem;
  border-radius: $radius-md;
  overflow: hidden;
  transition:
    border-color $dur $ease-out,
    box-shadow $dur $ease-out,
    transform $dur-fast $ease-out;

  // Franja de severidad: se lee de reojo al bajar por la bandeja.
  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: $line;
  }
  &--high::before {
    background: $danger;
  }
  &--medium::before {
    background: $warning;
  }

  &:hover {
    border-color: $alu-dark;
    box-shadow: $shadow-sm;
  }
  &:active {
    transform: scale(0.995);
  }
  &--active {
    border-color: $accent;
    box-shadow: 0 0 0 1px $accent;
  }
  &--closed {
    opacity: 0.72;
  }

  &__hit {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    @include focus-ring;
  }

  &__icon {
    @include plinth(12px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    color: $accent-deep;
  }
  &--high &__icon {
    color: $danger;
  }
  &--medium &__icon {
    color: darken($warning, 18%);
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.35rem);
  }

  &__top {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xs;
    color: $ink-muted;
  }
  &__number {
    font-family: $font-mono;
    font-weight: 700;
    color: $ink-soft;
  }
  &__type {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__ago {
    margin-left: auto;
    flex-shrink: 0;
  }

  &__title {
    font-size: $text-base;
    font-weight: 650;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__who {
    font-size: $text-sm;
    color: $ink-soft;
    overflow-wrap: anywhere;

    i {
      font-size: 0.7rem;
      color: $ink-muted;
    }
  }

  &__meta,
  &__links {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__times,
  &__assignee {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }
  &__times {
    font-family: $font-mono;
    color: $danger;
  }

  // Los links quedan por encima del botón que abre la tarjeta.
  &__link {
    position: relative;
    z-index: 1;
    @include flex(row, center, flex-start, 0.35rem);
    display: inline-flex;
    padding: 0.3rem 0.6rem;
    border-radius: $radius-pill;
    background: $paper;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    transition: background-color $dur $ease-out;

    &:hover {
      background: $accent-soft;
    }
  }

  @include reduced-motion {
    transition: none;
  }
}
</style>
