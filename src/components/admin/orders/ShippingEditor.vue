<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import AdminButton from '../AdminButton.vue'
import type { Order, ShippingInput, ShippingStatus } from '@/types'
import { carriers } from './carriers'

const props = defineProps<{ order: Order; busy: boolean }>()
const emit = defineEmits<{ save: [body: ShippingInput] }>()

const options: { value: ShippingStatus; label: string; icon: string }[] = [
  { value: 'shipped', label: 'Enviado', icon: 'fa-solid fa-truck' },
  { value: 'delivered', label: 'Entregado', icon: 'fa-solid fa-house-circle-check' },
  { value: 'returned', label: 'Devuelto', icon: 'fa-solid fa-rotate-left' },
]

const form = reactive({ guide: '', carrier: '', status: '' as ShippingStatus | '' })

function reset() {
  form.guide = props.order.dropi?.guide || ''
  form.carrier = props.order.dropi?.carrier || ''
  const current = props.order.status as ShippingStatus
  form.status = options.some((o) => o.value === current) ? current : ''
}
watch(() => [props.order.status, props.order.dropi?.guide, props.order.dropi?.carrier], reset, {
  immediate: true,
})

const dirty = computed(
  () =>
    form.guide.trim() !== (props.order.dropi?.guide || '') ||
    form.carrier.trim() !== (props.order.dropi?.carrier || '') ||
    (!!form.status && form.status !== props.order.status),
)

function pick(value: ShippingStatus) {
  form.status = form.status === value && value !== props.order.status ? '' : value
}

function save() {
  const body: ShippingInput = { guide: form.guide.trim(), carrier: form.carrier.trim() }
  if (form.status && form.status !== props.order.status) body.status = form.status
  emit('save', body)
}
</script>

<template>
  <form class="ship" @submit.prevent="save">
    <p class="ship__title">Envío</p>
    <div class="ship__status" role="group" aria-label="Estado del envío">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="ship__opt"
        :class="{ 'ship__opt--active': form.status === opt.value }"
        :aria-pressed="form.status === opt.value"
        @click="pick(opt.value)"
      >
        <i :class="opt.icon"></i>
        {{ opt.label }}
      </button>
    </div>
    <div class="ship__row">
      <div class="ship__field">
        <label for="sh-guide">Guía</label>
        <input
          id="sh-guide"
          v-model="form.guide"
          type="text"
          autocomplete="off"
          placeholder="Número de guía"
        />
      </div>
      <div class="ship__field">
        <label for="sh-carrier">Transportadora</label>
        <input
          id="sh-carrier"
          v-model="form.carrier"
          type="text"
          list="sh-carriers"
          autocomplete="off"
        />
        <datalist id="sh-carriers">
          <option v-for="c in carriers" :key="c" :value="c" />
        </datalist>
      </div>
    </div>
    <div v-if="dirty" class="ship__actions">
      <AdminButton type="submit" variant="primary" icon="fa-solid fa-floppy-disk" :loading="busy">
        Guardar envío
      </AdminButton>
      <AdminButton :disabled="busy" @click="reset">Descartar</AdminButton>
    </div>
    <small v-else class="ship__hint">El cliente ve la guía y el estado en Rastrear pedido.</small>
  </form>
</template>

<style scoped lang="scss">
.ship {
  @include flex(column, stretch, flex-start, 0.7rem);
  padding-top: 0.9rem;
  border-top: 1px solid $line;

  &__title {
    @include eyebrow;
  }

  &__status {
    @include flex(row, stretch, flex-start, 0.4rem);
  }

  &__opt {
    @include flex(column, center, center, 0.25rem);
    flex: 1 1 0;
    min-width: 0;
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.6rem 0.3rem;
    border-radius: $radius-sm;
    border: 1px solid $line;
    background: $surface;
    color: $ink-soft;
    @include transition(background);

    i {
      font-size: 0.95rem;
      color: $ink-muted;
    }

    &--active {
      background: $accent;
      border-color: $accent;
      color: $surface;

      i {
        color: $surface;
      }
    }
  }

  &__row {
    @include flex-cards(140px, 0.7rem);
  }

  &__field {
    @include flex(column, stretch, flex-start);
    min-width: 0;

    input {
      padding-block: 0.6rem;
      font-family: $font-mono;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
