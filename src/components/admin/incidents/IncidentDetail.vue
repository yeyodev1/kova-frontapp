<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from '../AdminButton.vue'
import AdminStatusChip from '../AdminStatusChip.vue'
import IncidentNotes from './IncidentNotes.vue'
import { formatDateTime } from '@/composables/admin/format'
import { incidentCopy, severityMeta, statusMeta, timeAgo, typeMeta } from './incidentMeta'
import type { TeamMember } from '@/services/admin.service'
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types/incidents'

const props = defineProps<{ incident: Incident; team: TeamMember[]; busy: string }>()
const emit = defineEmits<{
  close: []
  status: [status: IncidentStatus]
  assign: [userId: string]
  severity: [severity: IncidentSeverity]
  note: [text: string, done: () => void]
}>()

const type = computed(() => typeMeta[props.incident.type] ?? typeMeta.manual)
const active = computed(() => ['open', 'in_progress'].includes(props.incident.status))
const assigneeId = computed(() => props.incident.assignee?._id ?? '')
</script>

<template>
  <div class="detail" :class="`detail--${incident.severity}`">
    <header class="detail__head">
      <span class="detail__icon" aria-hidden="true"><i :class="type.icon"></i></span>
      <div class="detail__heading">
        <p class="detail__eyebrow">{{ incident.number }} · {{ type.label }}</p>
        <h2 class="detail__title">{{ incident.title }}</h2>
      </div>
      <button type="button" class="detail__close" aria-label="Cerrar detalle" @click="emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>

    <div class="detail__chips">
      <AdminStatusChip :label="statusMeta[incident.status].label" :tone="statusMeta[incident.status].tone" :icon="statusMeta[incident.status].icon" />
      <AdminStatusChip :label="`Severidad ${severityMeta[incident.severity].label.toLowerCase()}`" :tone="severityMeta[incident.severity].tone" />
      <AdminStatusChip v-if="incident.occurrences > 1" :label="incidentCopy.times(incident.occurrences)" tone="danger" icon="fa-solid fa-repeat" />
    </div>

    <p v-if="incident.detail" class="detail__text">{{ incident.detail }}</p>

    <dl class="detail__facts">
      <div v-if="incident.customerName"><dt>Cliente</dt><dd>{{ incident.customerName }}</dd></div>
      <div v-if="incident.phone"><dt>Celular</dt><dd>{{ incident.phone }}</dd></div>
      <div><dt>Primera vez</dt><dd>{{ formatDateTime(incident.createdAt) }}</dd></div>
      <div><dt>Última vez</dt><dd>{{ timeAgo(incident.lastSeenAt) }}</dd></div>
    </dl>

    <div v-if="incident.order || incident.phone" class="detail__links">
      <AdminButton v-if="incident.order" variant="soft" icon="fa-solid fa-receipt" :to="`/admin/pedidos/${incident.order}`">
        {{ incident.orderNumber || incidentCopy.order }}
      </AdminButton>
      <AdminButton v-if="incident.phone" variant="soft" icon="fa-brands fa-whatsapp" :to="`/admin/bot/chat/${incident.phone}`">
        {{ incidentCopy.chat }}
      </AdminButton>
    </div>

    <div class="detail__actions">
      <template v-if="active">
        <AdminButton
          v-if="incident.status === 'open'"
          variant="primary"
          icon="fa-solid fa-hand"
          :loading="busy === 'in_progress'"
          @click="emit('status', 'in_progress')"
        >
          {{ incidentCopy.take }}
        </AdminButton>
        <AdminButton variant="primary" icon="fa-solid fa-check" :loading="busy === 'resolved'" @click="emit('status', 'resolved')">
          {{ incidentCopy.resolve }}
        </AdminButton>
        <AdminButton icon="fa-solid fa-ban" :loading="busy === 'dismissed'" @click="emit('status', 'dismissed')">
          {{ incidentCopy.dismiss }}
        </AdminButton>
      </template>
      <AdminButton v-else icon="fa-solid fa-rotate-left" :loading="busy === 'open'" @click="emit('status', 'open')">
        {{ incidentCopy.reopen }}
      </AdminButton>
    </div>

    <div class="detail__fields">
      <label class="detail__field">
        <span>{{ incidentCopy.assignee }}</span>
        <select :value="assigneeId" :disabled="busy === 'assignee'" @change="emit('assign', ($event.target as HTMLSelectElement).value)">
          <option value="">{{ incidentCopy.nobody }}</option>
          <option v-for="member in team" :key="member._id" :value="member._id">{{ member.name || member.email }}</option>
        </select>
      </label>
      <label class="detail__field">
        <span>{{ incidentCopy.severity }}</span>
        <select
          :value="incident.severity"
          :disabled="busy === 'severity'"
          @change="emit('severity', ($event.target as HTMLSelectElement).value as IncidentSeverity)"
        >
          <option v-for="(meta, key) in severityMeta" :key="key" :value="key">{{ meta.label }}</option>
        </select>
      </label>
    </div>

    <IncidentNotes :notes="incident.notes || []" :busy="busy === 'note'" @add="(text, done) => emit('note', text, done)" />
  </div>
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 1rem);

  &__head {
    @include flex(row, flex-start, flex-start, 0.75rem);
  }

  &__icon {
    @include plinth(13px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.8rem;
    height: 2.8rem;
    font-size: 1.05rem;
    color: $accent-deep;
  }
  &--high &__icon {
    color: $danger;
  }
  &--medium &__icon {
    color: darken($warning, 18%);
  }

  &__heading {
    flex: 1;
    min-width: 0;
  }

  &__eyebrow {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__title {
    @include display(1.2rem, 780, 108%);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  &__close {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    color: $ink-muted;
    transition: background-color $dur $ease-out;

    &:hover {
      background: $paper;
      color: $ink;
    }
  }

  &__chips,
  &__links,
  &__actions {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }

  &__text {
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $paper;
    font-size: $text-sm;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  &__facts {
    @include flex-cards(140px, 0.6rem);

    div {
      min-width: 0;
    }

    dt {
      @include eyebrow;
      font-size: 0.62rem;
      color: $ink-muted;
    }

    dd {
      font-size: $text-sm;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
  }

  &__actions {
    padding-top: 0.2rem;
  }

  &__fields {
    @include flex(row, flex-end, flex-start, 0.6rem);
    flex-wrap: wrap;
    padding: 0.9rem 0;
    border-block: 1px solid $line;
  }

  &__field {
    flex: 1 1 160px;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.3rem);
    margin: 0;

    span {
      font-size: $text-xs;
      font-weight: 600;
      color: $ink-muted;
    }

    select {
      width: 100%;
    }
  }
}
</style>
