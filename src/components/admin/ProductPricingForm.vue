<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import type { ProductForm } from '@/composables/admin/useProductEditor'
import { marginOf, marginTone, type Margin } from '@/composables/admin/margin'
import { dollarsToCents, formatCents } from '@/utils/money'

const props = defineProps<{ form: ProductForm; cost: number; suggested?: number; margin: Margin; belowCost: boolean }>()

function variantMargin(price: number) {
  return marginOf(dollarsToCents(price), props.cost)
}
</script>

<template>
  <AdminPanel title="Precio" icon="fa-solid fa-tag">
    <div class="price">
      <div class="price__row">
        <div class="price__field">
          <label for="p-price">Precio de venta ($)</label>
          <input id="p-price" v-model.number="form.price" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
        <div class="price__field">
          <label for="p-compare">Precio tachado ($)</label>
          <input id="p-compare" v-model.number="form.compareAtPrice" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
      </div>

      <div class="price__margin" :class="`price__margin--${marginTone(margin)}`">
        <div>
          <span class="price__k">Costo Dropi</span>
          <strong>{{ cost ? formatCents(cost) : 'Sin dato' }}</strong>
        </div>
        <div v-if="suggested">
          <span class="price__k">Sugerido</span>
          <strong>{{ formatCents(suggested) }}</strong>
        </div>
        <div>
          <span class="price__k">Margen</span>
          <strong v-if="margin.known">{{ formatCents(margin.amount) }} ({{ margin.percent }}%)</strong>
          <strong v-else>n/d</strong>
        </div>
      </div>

      <p v-if="belowCost" class="price__warn">
        <i class="fa-solid fa-triangle-exclamation"></i>
        Hay precios por debajo del costo de Dropi: venderías con pérdida.
      </p>

      <template v-if="form.variants.length">
        <h3 class="price__sub">Variantes</h3>
        <div v-for="v in form.variants" :key="v._id" class="price__variant">
          <p class="price__vname">
            {{ v.name }}
            <span>Stock {{ v.stock }}</span>
          </p>
          <div class="price__row">
            <div class="price__field">
              <label :for="`v-${v._id}`">Precio ($)</label>
              <input :id="`v-${v._id}`" v-model.number="v.price" type="number" min="0" step="0.01" inputmode="decimal" />
            </div>
            <div class="price__field">
              <label :for="`vc-${v._id}`">Tachado ($)</label>
              <input :id="`vc-${v._id}`" v-model.number="v.compareAtPrice" type="number" min="0" step="0.01" inputmode="decimal" />
            </div>
          </div>
          <p v-if="variantMargin(v.price).known" class="price__vmargin" :class="`price__vmargin--${marginTone(variantMargin(v.price))}`">
            Margen {{ formatCents(variantMargin(v.price).amount) }} ({{ variantMargin(v.price).percent }}%)
          </p>
        </div>
      </template>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.price {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__row {
    @include flex-cards(130px, 0.7rem);
  }

  &__margin {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
    background: $paper;
    font-size: $text-sm;

    > div {
      @include flex(column, flex-start, flex-start);
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

  &__k {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__warn {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    font-weight: 500;
  }

  &__sub {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 600;
    margin-top: 0.4rem;
  }

  &__variant {
    padding: 0.8rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
  }

  &__vname {
    @include flex(row, center, space-between, 0.5rem);
    font-size: $text-sm;
    font-weight: 500;
    margin-bottom: 0.5rem;

    span {
      font-size: $text-xs;
      color: $ink-muted;
      font-weight: 400;
    }
  }

  &__vmargin {
    font-size: $text-xs;
    margin-top: 0.4rem;

    &--success {
      color: $success;
    }
    &--warning {
      color: darken($warning, 18%);
    }
    &--danger {
      color: $danger;
    }
  }
}
</style>
