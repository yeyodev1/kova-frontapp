<script setup lang="ts">
import { computed } from 'vue'
import type { ProductUpload } from '@/composables/admin/useProductUpload'
import { marginTone } from '@/composables/admin/margin'
import { centsToDollars, formatCents } from '@/utils/money'

const props = defineProps<{ up: ProductUpload }>()

const form = props.up.form

// Mientras no lo toque, el precio es el calculado; al escribir pasa a ser suyo y deja de recalcularse.
const price = computed<string>({
  get: () => {
    if (form.priceTouched) return form.price
    return props.up.autoPrice.value ? centsToDollars(props.up.autoPrice.value).toFixed(2) : ''
  },
  set: (value) => {
    // Se guarda el texto tal cual: convertirlo a número borraría el punto mientras escribe "13."
    form.priceTouched = true
    form.price = value
  },
})

const tone = computed(() => marginTone(props.up.margin.value))
const belowCost = computed(
  () => props.up.costCents.value > 0 && props.up.priceCents.value > 0 && props.up.priceCents.value < props.up.costCents.value,
)

function backToAuto() {
  form.priceTouched = false
  form.price = ''
}

function step(delta: number) {
  form.stock = Math.max(0, Math.min(100000, Math.round((form.stock || 0) + delta)))
}
</script>

<template>
  <section class="money" aria-label="Precio y stock">
    <div class="money__row">
      <div class="money__field">
        <label for="up-cost">Costo del proveedor</label>
        <div class="money__input">
          <span aria-hidden="true">$</span>
          <input id="up-cost" v-model.number="form.cost" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" />
        </div>
      </div>
      <div class="money__field">
        <label for="up-price">Precio de venta</label>
        <div class="money__input money__input--sale" :class="{ 'money__input--error': up.errors.value.price }">
          <span aria-hidden="true">$</span>
          <input id="up-price" v-model="price" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" />
        </div>
      </div>
    </div>

    <p v-if="up.errors.value.price" class="money__error" role="alert">{{ up.errors.value.price }}</p>
    <p v-else-if="!form.priceTouched && up.autoPrice.value" class="money__hint">
      <i class="fa-solid fa-wand-magic-sparkles"></i>
      Calculado con tu margen de {{ up.markup.value }}%, terminado en .90. Tócalo para poner otro.
    </p>
    <p v-else-if="form.priceTouched && up.autoPrice.value" class="money__hint">
      Precio a mano.
      <button type="button" class="money__link" @click="backToAuto">
        Usar el calculado ({{ formatCents(up.autoPrice.value) }})
      </button>
    </p>

    <div v-if="up.margin.value.known && up.priceCents.value" class="money__profit" :class="`money__profit--${tone}`">
      <span>Ganas por unidad</span>
      <strong>{{ formatCents(up.margin.value.amount) }}</strong>
      <span class="money__pct">{{ up.margin.value.percent }}%</span>
    </div>
    <p v-if="belowCost" class="money__error"><i class="fa-solid fa-triangle-exclamation"></i> Con ese precio vendes con pérdida.</p>

    <div class="money__stock">
      <label for="up-stock">Stock</label>
      <div class="money__stepper">
        <button type="button" aria-label="Quitar 1 de stock" :disabled="form.stock <= 0" @click="step(-1)">
          <i class="fa-solid fa-minus"></i>
        </button>
        <input id="up-stock" v-model.number="form.stock" type="number" min="0" step="1" inputmode="numeric" />
        <button type="button" aria-label="Sumar 1 de stock" @click="step(1)">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.money {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__row {
    @include flex(row, stretch, flex-start, 0.7rem);
  }

  &__field {
    flex: 1 1 0;
    min-width: 0;
    @include flex(column, stretch, flex-start);
  }

  &__input {
    position: relative;

    span {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-weight: 600;
      pointer-events: none;
    }

    input {
      padding-left: 1.8rem;
      font-variant-numeric: tabular-nums;
    }

    &--sale input {
      font-weight: 700;
      font-size: 1.15rem;
      color: $accent-deep;
      border-color: $accent;
    }

    &--error input {
      border-color: $danger;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.45;

    i {
      color: $accent;
      margin-right: 0.2rem;
    }
  }

  &__link {
    min-height: 44px;
    color: $accent;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    font-weight: 500;
  }

  &__profit {
    @include flex(row, baseline, flex-start, 0.5rem);
    padding: 0.75rem 1rem;
    border-radius: $radius-sm;
    background: $paper;
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      @include price(1.25rem);
      color: $ink;
    }

    &--success {
      background: $success-bg;
    }
    &--warning {
      background: $warning-bg;
    }
    &--danger {
      background: $danger-bg;
    }
  }

  &__pct {
    margin-left: auto;
    font-family: $font-mono;
    font-weight: 700;
  }

  &__stock {
    @include flex(row, center, space-between, 0.8rem);

    label {
      margin: 0;
    }
  }

  &__stepper {
    @include flex(row, stretch, flex-end, 0);
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $surface;

    button {
      width: 48px;
      color: $ink-soft;
      background: $alu-light;

      &:active {
        background: $alu;
      }

      &:disabled {
        opacity: 0.35;
      }
    }

    input {
      width: 76px;
      border: 0;
      border-radius: 0;
      text-align: center;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
