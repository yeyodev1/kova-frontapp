<script setup lang="ts">
import { reactive, ref } from 'vue'
import AdminButton from '../AdminButton.vue'
import type { DropiManualInput } from '@/types'
import { carriers } from './carriers'

defineProps<{ busy: boolean }>()
const emit = defineEmits<{ submit: [body: DropiManualInput, done: (ok: boolean) => void] }>()

const open = ref(false)
const form = reactive({ dropiOrderId: '', guide: '', carrier: '' })
const invalid = ref(false)

function submit() {
  const id = form.dropiOrderId.trim()
  invalid.value = !!id && !/^\d+$/.test(id)
  if (invalid.value) return
  const body: DropiManualInput = {}
  if (id) body.dropiOrderId = Number(id)
  if (form.guide.trim()) body.guide = form.guide.trim()
  if (form.carrier.trim()) body.carrier = form.carrier.trim()
  emit('submit', body, (ok) => {
    if (ok) open.value = false
  })
}
</script>

<template>
  <div class="manual">
    <AdminButton
      v-if="!open"
      variant="soft"
      icon="fa-solid fa-circle-check"
      block
      @click="open = true"
    >
      Ya lo creé en Dropi
    </AdminButton>

    <form v-else class="manual__form" @submit.prevent="submit">
      <p class="manual__title">Ya lo creé en Dropi</p>
      <div class="manual__field">
        <label for="dm-id">ID del pedido en Dropi <span>(opcional)</span></label>
        <input
          id="dm-id"
          v-model="form.dropiOrderId"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="Ej. 4587123"
          autocomplete="off"
          :aria-invalid="invalid"
        />
        <small v-if="invalid" class="manual__error"
          >Solo números, como aparece en Mis pedidos de Dropi.</small
        >
      </div>
      <div class="manual__row">
        <div class="manual__field">
          <label for="dm-guide">Guía <span>(opcional)</span></label>
          <input
            id="dm-guide"
            v-model="form.guide"
            type="text"
            autocomplete="off"
            placeholder="Número de guía"
          />
        </div>
        <div class="manual__field">
          <label for="dm-carrier">Transportadora</label>
          <input
            id="dm-carrier"
            v-model="form.carrier"
            type="text"
            list="dm-carriers"
            autocomplete="off"
          />
          <datalist id="dm-carriers">
            <option v-for="c in carriers" :key="c" :value="c" />
          </datalist>
        </div>
      </div>
      <small class="manual__hint"
        >Con guía queda como enviado; sin guía, como creado en Dropi.</small
      >
      <div class="manual__actions">
        <AdminButton type="submit" variant="primary" icon="fa-solid fa-check" :loading="busy"
          >Guardar</AdminButton
        >
        <AdminButton :disabled="busy" @click="open = false">Cancelar</AdminButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.manual {
  &__form {
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 0.9rem;
    border-radius: $radius-sm;
    background: $alu-light;
    border: 1px solid $line;
  }

  &__title {
    @include display(0.92rem, 750, 110%);
  }

  &__row {
    @include flex-cards(140px, 0.7rem);
  }

  &__field {
    @include flex(column, stretch, flex-start);
    min-width: 0;

    label span {
      color: $ink-muted;
      font-weight: 400;
    }

    input {
      padding-block: 0.6rem;
      font-family: $font-mono;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
    margin-top: 0.3rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
