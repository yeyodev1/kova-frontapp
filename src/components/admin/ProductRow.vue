<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import AdminToggle from './AdminToggle.vue'
import DropiLinkBadge from './DropiLinkBadge.vue'
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
      <DropiLinkBadge :linked="!!product.dropiId" class="prow__link" />
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
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  transition:
    border-color $dur $ease-out,
    background-color $dur $ease-out,
    transform $dur-fast $ease-out;

  &:hover {
    border-color: $alu-dark;
  }

  &:active {
    transform: scale(0.99);
  }

  &__img {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 12px;
    object-fit: contain;
    padding: 4px;
    background: radial-gradient(120% 80% at 50% 0%, #fff 0%, $alu-light 55%, $alu 100%);
    box-shadow: inset 0 -1px 0 rgba($alu-dark, 0.45);
    mix-blend-mode: multiply;

    &--empty {
      @include flex(row, center, center);
      color: $alu-dark;
    }
  }

  // Ocupa el resto del primer renglón: precio e interruptores bajan al segundo.
  &__info {
    flex: 1 1 calc(100% - 64px - 0.8rem);
    min-width: 0;
  }

  &__title {
    font-weight: 600;
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

  &__link {
    margin-top: 0.35rem;
  }

  &__low {
    color: $danger;
    font-weight: 600;
  }

  // Móvil: precio, costo y margen en una sola línea junto a los interruptores.
  &__money {
    flex: 1 1 0;
    min-width: 0;
    @include flex(row, baseline, flex-start, 0.15rem 0.6rem);
    flex-wrap: wrap;
    padding-top: 0.55rem;
    border-top: 1px solid $paper;
  }

  &__price {
    @include price(1.05rem, 800);
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
    @include flex(row, center, flex-end, 0.4rem);
    align-self: stretch;
    padding-top: 0.45rem;
    border-top: 1px solid $paper;
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
    box-shadow: none;

    &:hover {
      background: $alu-light;
    }

    &:active {
      transform: none;
    }

    &__info {
      flex: 1 1 0;
    }

    &__money {
      flex: 0 0 170px;
      flex-direction: column;
      align-items: flex-end;
      padding-top: 0;
      border-top: 0;
      text-align: right;
    }

    &__flags {
      flex: 0 0 170px;
      align-self: center;
      padding-top: 0;
      border-top: 0;
    }
  }
}
</style>
