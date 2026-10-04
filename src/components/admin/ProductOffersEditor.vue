<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import type { OfferForm } from '@/composables/admin/useProductEditor'
import { dollarsToCents, formatCents } from '@/utils/money'

const props = defineProps<{ offers: OfferForm[]; basePrice: number }>()

function add() {
  const last = props.offers[props.offers.length - 1]
  const quantity = last ? last.quantity + 1 : 1
  props.offers.push({
    quantity,
    unitPrice: props.basePrice,
    label: '',
    isDefault: props.offers.length === 0,
  })
}

function remove(i: number) {
  const [removed] = props.offers.splice(i, 1)
  const first = props.offers[0]
  if (removed?.isDefault && first) first.isDefault = true
}

// Solo una oferta puede venir marcada al abrir el producto.
function setDefault(i: number) {
  props.offers.forEach((o, j) => (o.isDefault = i === j))
}

function totals(o: OfferForm) {
  const total = dollarsToCents(o.unitPrice) * (o.quantity || 0)
  const full = dollarsToCents(props.basePrice) * (o.quantity || 0)
  const saving = Math.max(0, full - total)
  return { total, saving, pct: full ? Math.round((saving / full) * 100) : 0 }
}
</script>

<template>
  <AdminPanel title="Ofertas por cantidad" icon="fa-solid fa-layer-group">
    <template #actions>
      <AdminButton variant="soft" icon="fa-solid fa-plus" @click="add">Agregar</AdminButton>
    </template>

    <p v-if="!offers.length" class="offers__empty">
      Sin ofertas. Agrega "Lleva 2" o "Lleva 3" con descuento para subir el ticket.
    </p>

    <div v-for="(o, i) in offers" :key="i" class="offers__item" :class="{ 'offers__item--default': o.isDefault }">
      <div class="offers__fields">
        <div>
          <label :for="`o-q-${i}`">Cantidad</label>
          <input :id="`o-q-${i}`" v-model.number="o.quantity" type="number" min="1" step="1" inputmode="numeric" />
        </div>
        <div>
          <label :for="`o-p-${i}`">Precio unitario ($)</label>
          <input :id="`o-p-${i}`" v-model.number="o.unitPrice" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
        <div class="offers__label">
          <label :for="`o-l-${i}`">Etiqueta</label>
          <input :id="`o-l-${i}`" v-model="o.label" type="text" placeholder="Más vendido" maxlength="40" />
        </div>
      </div>
      <div class="offers__foot">
        <span class="offers__sum">
          Total <strong>{{ formatCents(totals(o).total) }}</strong>
          <em v-if="totals(o).saving">Ahorra {{ formatCents(totals(o).saving) }} ({{ totals(o).pct }}%)</em>
        </span>
        <span class="offers__ctrl">
          <label class="offers__radio">
            <input type="radio" name="offer-default" :checked="o.isDefault" @change="setDefault(i)" />
            Predeterminada
          </label>
          <button type="button" class="offers__del" aria-label="Quitar oferta" @click="remove(i)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </span>
      </div>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.offers {
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__item {
    padding: 0.8rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    margin-bottom: 0.6rem;

    &--default {
      border-color: $accent;
      background: rgba($accent, 0.03);
    }
  }

  &__fields {
    @include flex-cards(110px, 0.6rem);
  }

  &__label {
    flex-basis: 100% !important;

    @include from('sm') {
      flex-basis: 160px !important;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
    font-size: $text-sm;
  }

  &__sum em {
    font-style: normal;
    color: $success;
    font-size: $text-xs;
    font-weight: 600;
    margin-left: 0.4rem;
  }

  &__ctrl {
    @include flex(row, center, flex-end, 0.6rem);
  }

  &__radio {
    @include flex(row, center, flex-start, 0.35rem);
    margin: 0;
    font-size: $text-xs;
    cursor: pointer;

    input {
      width: auto;
      accent-color: $accent;
    }
  }

  &__del {
    width: 2.3rem;
    height: 2.3rem;
    color: $danger;
  }
}
</style>
