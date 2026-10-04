<script setup lang="ts">
import { ref } from 'vue'
import { productCopy } from '@/config/site'
import { useProduct } from '@/composables/useProduct'
import { useStickyCta } from '@/composables/useStickyCta'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductSummary from '@/components/product/ProductSummary.vue'
import VariantPicker from '@/components/product/VariantPicker.vue'
import OfferPicker from '@/components/product/OfferPicker.vue'
import ProductActions from '@/components/product/ProductActions.vue'
import ProductDetails from '@/components/product/ProductDetails.vue'
import StickyBuyBar from '@/components/product/StickyBuyBar.vue'
import ProductSkeleton from '@/components/product/ProductSkeleton.vue'
import QuantityStepper from '@/components/store/QuantityStepper.vue'
import PaymentMethodsInfo from '@/components/store/PaymentMethodsInfo.vue'
import SectionHeading from '@/components/store/SectionHeading.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import EmptyState from '@/components/store/EmptyState.vue'

const {
  product,
  loading,
  notFound,
  variantId,
  quantity,
  isVariable,
  price,
  compareAt,
  inStock,
  lowStock,
  offers,
  total,
  buyNow,
  addToCart,
} = useProduct()

const ctaEl = ref<HTMLElement | null>(null)
const { visible: stickyVisible } = useStickyCta(ctaEl)
</script>

<template>
  <div class="product">
    <ProductSkeleton v-if="loading" />

    <EmptyState v-else-if="notFound || !product" icon="fa-solid fa-box-open" :title="productCopy.notFoundTitle" :text="productCopy.notFoundText">
      <RouterLink to="/tienda" class="btn btn--primary">Ver productos</RouterLink>
    </EmptyState>

    <template v-else>
      <div class="product__top">
        <ProductGallery :images="product.images" :title="product.title" class="product__gallery" />

        <div class="product__buy">
          <ProductSummary
            :product="product"
            :price="price"
            :compare-at="compareAt"
            :in-stock="inStock"
            :low-stock="lowStock"
          />

          <VariantPicker v-if="isVariable" v-model="variantId" :variants="product.variants" />

          <OfferPicker v-if="offers.length > 1" v-model="quantity" :offers="offers" />
          <div v-else class="product__qty">
            <span>Cantidad</span>
            <QuantityStepper v-model="quantity" :min="1" :max="10" />
          </div>

          <div ref="ctaEl">
            <ProductActions :total="total" :in-stock="inStock" :title="product.title" @buy="buyNow" @add="addToCart" />
          </div>
        </div>
      </div>

      <div class="product__more">
        <ProductDetails :product="product" class="product__details" />
        <PaymentMethodsInfo compact class="product__payments" />
      </div>

      <section v-if="product.related?.length" class="product__related">
        <SectionHeading :title="productCopy.relatedTitle" />
        <ProductGrid :products="product.related" />
      </section>

      <StickyBuyBar
        :visible="stickyVisible"
        :total="total"
        :title="product.title"
        :image="product.images[0]"
        :in-stock="inStock"
        @buy="buyNow"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.product {
  @include container;
  padding-block: 0 calc(#{$space-xl} + 4rem);

  @include from('md') {
    padding-block: 2rem $space-xl;
  }

  &__top {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 2.5rem;
    }
  }

  &__gallery {
    @include from('md') {
      flex: 1.1;
      position: sticky;
      top: 5rem;
    }
  }

  &__buy {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('md') {
      flex: 1;
      max-width: 520px;
    }
  }

  &__qty {
    @include flex(row, center, space-between, 1rem);
    font-weight: 600;
    font-size: $text-sm;
  }

  &__more {
    @include flex(column, stretch, flex-start, 2.5rem);
    margin-top: $space-lg;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__details {
    flex: 1.4;
    min-width: 0;
  }

  &__payments {
    flex: 1;
    min-width: 0;
  }

  &__related {
    margin-top: $space-xl;
  }
}
</style>
