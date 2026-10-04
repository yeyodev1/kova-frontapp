<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import AdminToggle from './AdminToggle.vue'
import { formatCents } from '@/utils/money'
import { marginOf, marginTone } from '@/composables/admin/margin'

const props = defineProps<{ product: Product; busy: string | null }>()
const emit = defineEmits<{ toggle: [field: 'isPublished' | 'isFeatured'] }>()

const margin = computed(() => marginOf(props.product.price, props.product.costPrice))
const tone = computed(() => marginTone(margin.value))
</script>

<template>
  <RouterLink :to="`/admin/productos/${product._id}`" class="prow">
    <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.title" class="prow__img" loading="lazy" />
    <span v-else class="prow__img prow__img--empty"><i class="fa-regular fa-image"></i></span>

    <div class="prow__info">
      <p class="prow__title">{{ product.title }}</p>
      <p class="prow__meta">
        <span :class="{ 'prow__low': product.stock <= 5 }">Stock {{ product.stock }}</span>
        <span v-if="product.category"> · {{ product.category }}</span>
      </p>
    </div>

    <div class="prow__money">
      <p class="prow__price">{{ formatCents(product.price) }}</p>
      <p class="prow__cost">Costo {{ product.costPrice ? formatCents(product.costPrice) : 'n/d' }}</p>
      <p v-if="margin.known" class="prow__margin" :class="`prow__margin--${tone}`">
        {{ formatCents(margin.amount) }} · {{ margin.percent }}%
      </p>
    </div>

    <div class="prow__flags">
      <AdminToggle
        :model-value="product.isPublished"
        label="Publicado"
        :busy="busy === `${product._id}:isPublished`"
        @update:model-value="emit('toggle', 'isPublished')"
      />
      <button
        type="button"
        class="prow__star"
        :class="{ 'prow__star--on': product.isFeatured }"
        :aria-label="product.isFeatured ? 'Quitar de destacados' : 'Destacar'"
        :aria-pressed="product.isFeatured"
        :disabled="busy === `${product._id}:isFeatured`"
        @click.stop.prevent="emit('toggle', 'isFeatured')"
      >
        <i :class="product.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </button>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.prow {
  @include card;
  @include flex(row, flex-start, flex-start, 0.5rem 0.8rem);
  flex-wrap: wrap;
  padding: 0.8rem;
  @include transition(border-color);

  &:hover {
    border-color: $accent;
  }

  &__img {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $paper;

    &--empty {
      @include flex(row, center, center);
      color: $silver;
    }
  }

  &__info {
    flex: 1 1 0;
    min-width: 0;
  }

  &__title {
    font-weight: 500;
    font-size: $text-sm;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta,
  &__cost {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__low {
    color: $danger;
    font-weight: 600;
  }

  &__money {
    flex: 1 1 100%;
    text-align: left;
    padding-left: calc(64px + 0.8rem);
  }

  &__price {
    font-weight: 600;
  }

  &__margin {
    font-size: $text-xs;
    font-weight: 600;

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

  &__flags {
    @include flex(row, center, flex-end, 0.6rem);
    align-self: flex-end;
  }

  &__star {
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    color: $silver;
    font-size: 1.05rem;

    &--on {
      color: $warning;
    }
  }

  @include from('lg') {
    flex-wrap: nowrap;
    align-items: center;
    border-radius: 0;
    border-width: 0 0 1px;

    &__money {
      flex: 0 0 170px;
      padding-left: 0;
      text-align: right;
    }

    &__flags {
      flex: 0 0 170px;
      align-self: center;
    }
  }
}
</style>
