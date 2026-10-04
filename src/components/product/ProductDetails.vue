<script setup lang="ts">
import { computed } from 'vue'
import { productCopy, generalFaqs } from '@/config/site'
import ProductAccordion from './ProductAccordion.vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const faqs = computed(() => [...props.product.faqs, ...generalFaqs])
</script>

<template>
  <div class="details">
    <section v-if="product.benefits.length" class="details__benefits">
      <h2 class="details__title">{{ productCopy.benefitsTitle }}</h2>
      <ul>
        <li v-for="(benefit, i) in product.benefits" :key="benefit" v-reveal="Math.min(i, 6) * 80">
          <span class="details__check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </section>

    <ProductAccordion
      v-if="product.description"
      :title="productCopy.descriptionTitle"
      size="lg"
      open
    >
      <!-- El HTML llega saneado desde el backend. -->
      <div class="details__html" v-html="product.description"></div>
    </ProductAccordion>

    <section class="details__faqs">
      <h2 class="details__title">{{ productCopy.faqsTitle }}</h2>
      <ProductAccordion v-for="faq in faqs" :key="faq.question" :title="faq.question">
        <p class="details__answer">{{ faq.answer }}</p>
      </ProductAccordion>
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  @include flex(column, stretch, flex-start, 2.25rem);

  &__title {
    @include display($text-xl, 800, 120%);
    margin-bottom: 1rem;
  }

  &__benefits {
    padding: 1.5rem 1.25rem;
    border-radius: $radius-lg;
    @include moss;

    .details__title {
      color: $surface;
    }

    ul {
      list-style: none;
      @include flex(column, stretch, flex-start, 0.8rem);
    }

    li {
      @include flex(row, center, flex-start, 0.8rem);
      font-size: $text-base;
      font-weight: 500;
      color: rgba($surface, 0.92);
    }

    @include from('md') {
      padding: 2rem;
    }
  }

  &__check {
    flex-shrink: 0;
    @include flex(row, center, center);
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    background: linear-gradient(160deg, #ffffff, $alu 60%, $alu-dark);
    color: $accent-deep;
    font-size: 0.7rem;
    box-shadow: inset 0 1px 0 rgba(#fff, 0.9);
  }

  &__faqs {
    @include flex(column, stretch, flex-start);
  }

  &__answer {
    font-size: $text-sm;
  }

  &__html {
    overflow-wrap: anywhere;

    :deep(p),
    :deep(ul),
    :deep(ol) {
      margin-bottom: 0.8rem;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.2rem;
    }

    :deep(img) {
      border-radius: $radius-sm;
      margin-block: 0.8rem;
      height: auto;
    }

    :deep(h2),
    :deep(h3) {
      color: $ink;
      font-size: $text-lg;
      margin-block: 1rem 0.5rem;
    }
  }
}
</style>
