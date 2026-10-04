<script setup lang="ts">
import { computed } from 'vue'
import { productCopy, generalFaqs } from '@/config/site'
import FaqList from '@/components/store/FaqList.vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const faqs = computed(() => [...props.product.faqs, ...generalFaqs])
</script>

<template>
  <div class="details">
    <section v-if="product.benefits.length" class="details__benefits">
      <h2 class="details__title">{{ productCopy.benefitsTitle }}</h2>
      <ul>
        <li v-for="benefit in product.benefits" :key="benefit">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </section>

    <details v-if="product.description" class="details__description" open>
      <summary>
        <span>{{ productCopy.descriptionTitle }}</span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </summary>
      <!-- El HTML llega saneado desde el backend. -->
      <div class="details__html" v-html="product.description"></div>
    </details>

    <section>
      <h2 class="details__title">{{ productCopy.faqsTitle }}</h2>
      <FaqList :items="faqs" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  @include flex(column, stretch, flex-start, 2rem);

  &__title {
    @include display($text-xl, 600);
    margin-bottom: 0.9rem;
  }

  &__benefits {
    ul {
      list-style: none;
      @include flex(column, stretch, flex-start, 0.65rem);
    }

    li {
      @include flex(row, flex-start, flex-start, 0.65rem);
      font-size: $text-base;
    }

    i {
      color: $accent;
      font-size: 1.15rem;
      margin-top: 0.2rem;
    }
  }

  &__description {
    @include card;
    overflow: hidden;

    summary {
      @include flex(row, center, space-between);
      list-style: none;
      cursor: pointer;
      padding: 1rem 1.15rem;
      min-height: 3.2rem;
      font-family: $font-display;
      font-weight: 600;
      font-size: $text-lg;

      &::-webkit-details-marker {
        display: none;
      }

      i {
        color: $accent;
        @include transition(transform);
      }
    }

    &[open] summary i {
      transform: rotate(180deg);
    }
  }

  &__html {
    padding: 0 1.15rem 1.25rem;
    color: $ink-soft;
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
