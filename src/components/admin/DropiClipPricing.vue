<script setup lang="ts">
import { computed } from 'vue'
import { formatCents, dollarsToCents } from '@/utils/money'
import { marginOf } from '@/composables/admin/margin'
import { pickOnPrice, type ClipDraft } from '@/composables/admin/useDropiClip'

// Dropi dibuja precios y stock en canvas: aquí los escribe el dueño mirando la pantalla de Dropi.
const props = defineProps<{ item: ClipDraft; sale: number }>()

const hasCost = computed(() => (props.item.cost ?? 0) > 0)
const margin = computed(() => marginOf(props.sale, dollarsToCents(props.item.cost ?? 0)))
</script>

<template>
  <div class="cp">
    <label class="cp__field">
      <span>Costo proveedor (USD)</span>
      <input
        v-model.number="item.cost"
        type="number"
        @input="pickOnPrice(item)"
        min="0"
        step="0.01"
        inputmode="decimal"
        placeholder="0.00"
      />
    </label>
    <p v-if="!hasCost" class="cp__hint">
      <i class="fa-solid fa-eye"></i> Mira el precio proveedor en Dropi y escríbelo aquí
    </p>
    <div class="cp__row">
      <label class="cp__field">
        <span>Sugerido (USD)</span>
        <input
          v-model.number="item.suggested"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="Opcional"
        />
      </label>
      <label class="cp__field cp__field--sm">
        <span>Stock</span>
        <input
          v-model.number="item.stock"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="—"
        />
      </label>
    </div>

    <label v-if="!hasCost" class="cp__field">
      <span>Precio de venta (USD), si no pones costo</span>
      <input
        v-model.number="item.price"
        type="number"
        @input="pickOnPrice(item)"
        min="0"
        step="0.01"
        inputmode="decimal"
        placeholder="0.00"
      />
    </label>

    <p class="cp__sale">
      <span>Venta</span>
      <strong>{{ sale ? formatCents(sale) : 'sin precio' }}</strong>
      <em v-if="margin.known" :class="{ cp__neg: margin.amount <= 0 }"
        >margen {{ margin.percent }}%</em
      >
    </p>
    <p v-if="!hasCost && sale" class="cp__warn">Sin costo: el margen no se puede calcular.</p>
    <p v-if="!sale" class="cp__warn">Quedará en borrador sin precio: pónselo antes de publicar.</p>
  </div>
</template>

<style scoped lang="scss">
.cp {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__field {
    @include flex(column, stretch, flex-start, 0.25rem);
    margin: 0;
    flex: 1 1 6rem;
    min-width: 0;

    span {
      font-size: $text-xs;
      color: $ink-soft;
    }

    input {
      min-width: 0;
    }

    &--sm {
      flex: 0 1 4.5rem;
    }
  }

  &__row {
    @include flex(row, flex-end, flex-start, 0.45rem);
    flex-wrap: wrap;
  }

  &__hint,
  &__warn {
    font-size: $text-xs;
    line-height: 1.4;
  }

  &__hint {
    color: $accent;
    font-weight: 600;
  }

  &__warn {
    color: $ink-soft;
    padding-left: 0.6rem;
    border-left: 2px solid $warning;
  }

  &__sale {
    @include flex(row, baseline, flex-start, 0.45rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-muted;

    strong {
      @include price($text-lg);
      color: $ink;
    }

    em {
      font-style: normal;
      color: $success;
      font-weight: 600;
    }
  }

  &__neg {
    color: $danger !important;
  }
}
</style>
