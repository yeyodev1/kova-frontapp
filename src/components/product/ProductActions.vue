<script setup lang="ts">
import { productCopy, whatsappLink } from '@/config/site'
import { formatCents } from '@/utils/format'
import TrustSeals from '@/components/store/TrustSeals.vue'

defineProps<{ total: number; inStock: boolean; title: string }>()
const emit = defineEmits<{ buy: []; add: [] }>()
</script>

<template>
  <div class="actions">
    <button class="btn btn--cta btn--lg btn--block actions__buy" :disabled="!inStock" @click="emit('buy')">
      <i class="fa-solid fa-bolt" aria-hidden="true"></i>
      {{ inStock ? `${productCopy.buyNow} · ${formatCents(total)}` : productCopy.soldOut }}
    </button>
    <button class="btn btn--outline btn--lg btn--block" :disabled="!inStock" @click="emit('add')">
      <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> {{ productCopy.addToCart }}
    </button>
    <TrustSeals class="actions__seals" />
    <a :href="whatsappLink(productCopy.whatsappMessage(title))" class="actions__wa" target="_blank" rel="noopener">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ productCopy.needHelp }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.actions {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__buy {
    font-size: 1.05rem;
  }

  &__seals {
    justify-content: center;
    margin-top: 0.3rem;
  }

  &__wa {
    align-self: center;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    padding: 0.5rem;
    text-decoration: underline;
    text-underline-offset: 3px;

    i {
      color: #1f9d55;
    }
  }
}
</style>
