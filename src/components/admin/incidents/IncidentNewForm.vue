<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { incidentCopy, severityMeta } from './incidentMeta'
import type { NewIncidentInput } from '@/types/incidents'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; submit: [input: NewIncidentInput, done: (ok: boolean) => void] }>()

const blank = (): NewIncidentInput => ({ title: '', detail: '', severity: 'medium', orderNumber: '', phone: '' })
const form = reactive<NewIncidentInput>(blank())
const missing = ref(false)
const sending = ref(false)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    Object.assign(form, blank())
    missing.value = false
  },
)

function submit() {
  if (sending.value) return
  if (!form.title.trim()) {
    missing.value = true
    return
  }
  sending.value = true
  emit('submit', { ...form, title: form.title.trim() }, (ok) => {
    sending.value = false
    if (ok) emit('close')
  })
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="incidentCopy.form.title"
    :confirm-label="sending ? 'Creando…' : incidentCopy.form.submit"
    :cancel-label="incidentCopy.form.cancel"
    @confirm="submit"
    @cancel="emit('close')"
  >
    <form class="new" @submit.prevent="submit">
      <label class="field" :class="{ 'field--invalid': missing && !form.title.trim() }">
        <span class="new__label">{{ incidentCopy.form.what }}</span>
        <input v-model="form.title" type="text" maxlength="200" :placeholder="incidentCopy.form.whatHint" />
        <span v-if="missing && !form.title.trim()" class="field__error">Escribe qué pasó</span>
      </label>
      <label class="field">
        <span class="new__label">{{ incidentCopy.form.detail }}</span>
        <textarea v-model="form.detail" rows="3" maxlength="2000"></textarea>
      </label>
      <div class="new__row">
        <label class="field new__half">
          <span class="new__label">{{ incidentCopy.form.order }}</span>
          <input v-model="form.orderNumber" type="text" placeholder="KV-1001" autocapitalize="characters" />
        </label>
        <label class="field new__half">
          <span class="new__label">{{ incidentCopy.form.phone }}</span>
          <input v-model="form.phone" type="tel" inputmode="tel" placeholder="09XXXXXXXX" />
        </label>
      </div>
      <fieldset class="new__severity">
        <legend class="new__label">{{ incidentCopy.severity }}</legend>
        <label v-for="(meta, key) in severityMeta" :key="key" class="new__pill" :class="{ [`new__pill--${key}`]: form.severity === key }">
          <input v-model="form.severity" type="radio" name="incident-severity" :value="key" class="visually-hidden" />
          {{ meta.label }}
        </label>
      </fieldset>
    </form>
  </BaseModal>
</template>

<style scoped lang="scss">
.new {
  @include flex(column, stretch, flex-start, 0.8rem);
  margin: 0.4rem 0 0.6rem;
  text-align: left;

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
    margin-bottom: 0.3rem;
  }

  textarea {
    resize: vertical;
  }

  &__row {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__half {
    flex: 1 1 140px;
  }

  &__severity {
    border: 0;
    padding: 0;
    margin: 0;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;

    legend {
      width: 100%;
    }
  }

  &__pill {
    cursor: pointer;
    padding: 0.45rem 0.9rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    @include transition(background);

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--high {
      background: $danger-bg;
      border-color: $danger;
      color: $danger;
    }
    &--medium {
      background: $warning-bg;
      border-color: $warning;
      color: darken($warning, 22%);
    }
    &--low {
      background: $accent-soft;
      border-color: $accent;
      color: $accent-deep;
    }
  }
}
</style>
