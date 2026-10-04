<script setup lang="ts">
import { computed } from 'vue'
import type { ProductForm } from '@/composables/admin/useProductEditor'
import { dollarsToCents, formatCents } from '@/utils/money'

const props = defineProps<{ form: ProductForm; stock: number }>()

const price = computed(() => dollarsToCents(props.form.price))
const compare = computed(() => dollarsToCents(props.form.compareAtPrice))
const off = computed(() =>
  compare.value > price.value && price.value > 0 ? Math.round((1 - price.value / compare.value) * 100) : 0,
)
</script>

<template>
  <section class="preview" aria-label="Vista previa de la tarjeta">
    <p class="preview__eyebrow">Así se ve en la tienda</p>
    <article class="preview__card">
      <div class="preview__plinth">
        <img v-if="form.images[0]" :src="form.images[0]" :alt="form.title" class="preview__img" />
        <span v-else class="preview__placeholder"><i class="fa-regular fa-image"></i></span>
        <span v-if="off" class="preview__off">-{{ off }}%</span>
      </div>
      <div class="preview__body">
        <p v-if="stock > 0 && stock <= 10" class="preview__stock">Quedan {{ stock }}</p>
        <h3 class="preview__title">{{ form.title || 'Sin título' }}</h3>
        <p class="preview__prices">
          <strong>{{ price ? formatCents(price) : '$ —' }}</strong>
          <s v-if="off">{{ formatCents(compare) }}</s>
        </p>
      </div>
    </article>
    <p v-if="!form.isPublished" class="preview__draft"><i class="fa-regular fa-eye-slash"></i> Borrador: aún no se ve</p>
  </section>
</template>

<style scoped lang="scss">
.preview {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__eyebrow {
    @include eyebrow;
  }

  &__card {
    @include alu-border(20px);
    padding: 0.5rem;
    max-width: 240px;
    width: 100%;
    align-self: center;
    box-shadow: $shadow-sm;
  }

  &__plinth {
    @include plinth(16px);
    @include glint('&:hover', 1.1s, 0.5);
    aspect-ratio: 1;
    @include flex(row, center, center);
  }

  &__img {
    width: 82%;
    height: 82%;
    object-fit: contain;
  }

  &__placeholder {
    font-size: 2rem;
    color: $alu-dark;
  }

  &__off {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    z-index: 3;
    font-family: $font-mono;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: $surface;
  }

  &__body {
    padding: 0.75rem 0.5rem 0.4rem;
  }

  &__stock {
    @include eyebrow;
    font-size: 0.62rem;
    color: $cta-deep;
    margin-bottom: 0.25rem;
  }

  &__title {
    @include display(1rem, 700, 108%);
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__prices {
    @include flex(row, baseline, flex-start, 0.5rem);
    margin-top: 0.4rem;

    strong {
      @include price(1.2rem);
    }

    s {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__draft {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
  }
}
</style>
