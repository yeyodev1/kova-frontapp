<script setup lang="ts">
import { ref } from 'vue'
import AdminButton from '../AdminButton.vue'
import { formatDateTime } from '@/composables/admin/format'
import { incidentCopy } from './incidentMeta'
import type { IncidentNote } from '@/types/incidents'

defineProps<{ notes: IncidentNote[]; busy: boolean }>()
const emit = defineEmits<{ add: [text: string, done: () => void] }>()

const text = ref('')

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('add', value, () => (text.value = ''))
}
</script>

<template>
  <section class="notes">
    <h3 class="notes__title"><i class="fa-solid fa-clock-rotate-left"></i> {{ incidentCopy.notes }}</h3>

    <form class="notes__form" @submit.prevent="submit">
      <label class="visually-hidden" for="incident-note">{{ incidentCopy.addNote }}</label>
      <textarea
        id="incident-note"
        v-model="text"
        rows="2"
        maxlength="2000"
        :placeholder="incidentCopy.notePlaceholder"
        @keydown.meta.enter="submit"
        @keydown.ctrl.enter="submit"
      ></textarea>
      <AdminButton type="submit" variant="primary" icon="fa-solid fa-paper-plane" :loading="busy" :disabled="!text.trim()">
        {{ incidentCopy.addNote }}
      </AdminButton>
    </form>

    <ol class="notes__list">
      <li
        v-for="note in [...notes].reverse()"
        :key="note._id"
        class="notes__item"
        :class="{ 'notes__item--system': !note.by }"
      >
        <span class="notes__dot" aria-hidden="true">
          <i :class="note.by ? 'fa-solid fa-user' : 'fa-solid fa-gear'"></i>
        </span>
        <div class="notes__body">
          <p class="notes__meta">
            <strong>{{ note.byName || 'Sistema' }}</strong> · {{ formatDateTime(note.at) }}
          </p>
          <p class="notes__text">{{ note.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.notes {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__title {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.45rem);
    color: $ink-muted;
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.5rem);

    textarea {
      width: 100%;
      resize: vertical;
      min-height: 4.2rem;
    }

    :deep(.abtn) {
      align-self: flex-end;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
  }

  &__item {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.7rem);
    padding-bottom: 0.9rem;

    // Hilo vertical que une las notas.
    &::before {
      content: '';
      position: absolute;
      left: 0.85rem;
      top: 1.8rem;
      bottom: 0;
      width: 1px;
      background: $line;
    }

    &:last-child::before {
      display: none;
    }

    &--system .notes__text {
      color: $ink-soft;
    }
  }

  &__dot {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 0.7rem;
  }

  &__item--system &__dot {
    background: $paper;
    color: $ink-muted;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__text {
    font-size: $text-sm;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
}
</style>
