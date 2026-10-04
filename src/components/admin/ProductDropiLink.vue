<script setup lang="ts">
import { computed } from 'vue'
import AdminPanel from './AdminPanel.vue'
import DropiLinkBadge from './DropiLinkBadge.vue'
import type { ProductForm } from '@/composables/admin/useProductEditor'
import { formatDateTime } from '@/composables/admin/format'

const props = defineProps<{ form: ProductForm; suggested?: number; lastSyncedAt?: string }>()

const linked = computed(() => /^\d+$/.test(props.form.dropiId.trim()))
</script>

<template>
  <AdminPanel title="Enlace con Dropi" icon="fa-solid fa-link">
    <template #actions>
      <DropiLinkBadge :linked="linked" />
    </template>

    <div class="link">
      <p class="link__intro">
        Con el ID, los pedidos de este producto se crean solos en Dropi y el stock y el costo se sincronizan.
      </p>

      <div class="link__row">
        <div class="link__field">
          <label for="p-dropi">ID de Dropi</label>
          <input
            id="p-dropi"
            v-model="form.dropiId"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="Ej. 123456"
            autocomplete="off"
          />
          <small>Lo ves en Dropi en la ficha del producto</small>
        </div>
        <div class="link__field">
          <label for="p-cost">Costo del proveedor ($)</label>
          <input id="p-cost" v-model.number="form.costPrice" type="number" min="0" step="0.01" inputmode="decimal" />
          <small>Lo que te cobra Dropi por unidad</small>
        </div>
      </div>

      <div v-if="form.variants.length" class="link__variants">
        <p class="link__sub">Variantes</p>
        <div v-for="v in form.variants" :key="v._id" class="link__variant">
          <span class="link__vname">{{ v.name || 'Variante' }}</span>
          <label class="visually-hidden" :for="`vd-${v._id}`">ID de variación de Dropi de {{ v.name }}</label>
          <input
            :id="`vd-${v._id}`"
            v-model="v.dropiVariationId"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="ID variación"
            autocomplete="off"
          />
        </div>
      </div>

      <p v-if="lastSyncedAt" class="link__sync">
        <i class="fa-solid fa-rotate"></i> Sincronizado {{ formatDateTime(lastSyncedAt) }}
      </p>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.link {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__intro {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__row {
    @include flex-cards(150px, 0.7rem);
  }

  &__field {
    @include flex(column, stretch, flex-start);

    input {
      font-family: $font-mono;
      font-variant-numeric: tabular-nums;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
      margin-top: 0.3rem;
    }
  }

  &__sub {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__variants {
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__variant {
    @include flex(row, center, space-between, 0.6rem);

    input {
      flex: 0 0 9.5rem;
      min-width: 0;
      font-family: $font-mono;
      padding-block: 0.55rem;
    }
  }

  &__vname {
    flex: 1 1 0;
    min-width: 0;
    font-size: $text-sm;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__sync {
    font-family: $font-mono;
    font-size: 0.7rem;
    color: $ink-muted;

    i {
      margin-right: 0.3rem;
    }
  }
}
</style>
