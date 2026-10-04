<script setup lang="ts">
import { computed } from 'vue'
import type { DropiCatalogItem } from '@/types'
import AdminButton from './AdminButton.vue'
import { formatCents } from '@/utils/money'

const props = defineProps<{ item: DropiCatalogItem; markup: number; busy: boolean; productId?: string }>()
const emit = defineEmits<{ import: [] }>()

// Mismo cálculo que el backend: sugerido si existe, si no costo × (1 + margen).
const salePrice = computed(() =>
  props.item.suggestedPrice > 0 ? props.item.suggestedPrice : Math.round(props.item.costPrice * (1 + props.markup / 100)),
)
</script>

<template>
  <article class="dc">
    <div class="dc__media">
      <img v-if="item.image" :src="item.image" :alt="item.name" loading="lazy" />
      <i v-else class="fa-regular fa-image"></i>
      <span class="dc__type">{{ item.type === 'VARIABLE' ? 'Variable' : 'Simple' }}</span>
      <span v-if="item.imported" class="dc__imported"><i class="fa-solid fa-check"></i> Importado</span>
    </div>
    <div class="dc__body">
      <p class="dc__name" :title="item.name">{{ item.name }}</p>
      <dl class="dc__data">
        <div><dt>Costo</dt><dd>{{ formatCents(item.costPrice) }}</dd></div>
        <div><dt>Sugerido</dt><dd>{{ item.suggestedPrice ? formatCents(item.suggestedPrice) : 'n/d' }}</dd></div>
        <div><dt>Stock</dt><dd :class="{ 'dc__low': item.stock <= 5 }">{{ item.stock }}</dd></div>
      </dl>
      <p class="dc__sale">Venta aprox. <strong>{{ formatCents(salePrice) }}</strong></p>
      <div class="dc__actions">
        <AdminButton
          :variant="item.imported ? 'ghost' : 'primary'"
          :icon="item.imported ? 'fa-solid fa-rotate' : 'fa-solid fa-download'"
          :loading="busy"
          block
          @click="emit('import')"
        >
          {{ item.imported ? 'Actualizar' : 'Importar' }}
        </AdminButton>
        <RouterLink v-if="productId" :to="`/admin/productos/${productId}`" class="dc__edit">
          Editar producto <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.dc {
  @include card;
  overflow: hidden;
  @include flex(column, stretch, flex-start);

  &__media {
    position: relative;
    aspect-ratio: 1;
    background: $paper;
    @include flex(row, center, center);
    color: $silver;
    font-size: 1.6rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__type,
  &__imported {
    position: absolute;
    top: 0.5rem;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 0.22rem 0.5rem;
    border-radius: $radius-pill;
  }

  &__type {
    left: 0.5rem;
    background: rgba($surface, 0.92);
    color: $ink-soft;
  }

  &__imported {
    right: 0.5rem;
    background: $success;
    color: $surface;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding: 0.8rem;
    flex: 1;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
  }

  &__data {
    @include flex(row, flex-start, space-between, 0.4rem);
    font-size: $text-xs;

    dt {
      color: $ink-muted;
    }

    dd {
      font-weight: 600;
    }
  }

  &__low {
    color: $danger;
  }

  &__sale {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__actions {
    margin-top: auto;
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__edit {
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    text-align: center;
  }
}
</style>
