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
import ProductNotFound from '@/components/product/ProductNotFound.vue'
import QuantityStepper from '@/components/store/QuantityStepper.vue'
import PaymentMethodsInfo from '@/components/store/PaymentMethodsInfo.vue'
import SectionHeading from '@/components/store/SectionHeading.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'

const {
  product,
  loading,
  notFound,
  variantId,
  quantity,
  isVariable,
  price,
  compareAt,
  stock,
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

    <ProductNotFound v-else-if="notFound || !product" />

    <template v-else>
      <div class="product__top">
        <div class="product__gallery">
          <ProductGallery :images="product.images" :title="product.title" />
        </div>

        <div class="product__buy">
          <ProductSummary
            :product="product"
            :price="price"
            :compare-at="compareAt"
            :in-stock="inStock"
            :low-stock="lowStock"
            :stock="stock"
            class="product__step"
          />

          <VariantPicker
            v-if="isVariable"
            v-model="variantId"
            :variants="product.variants"
            class="product__step"
          />

          <OfferPicker
            v-if="inStock && offers.length > 1"
            v-model="quantity"
            :offers="offers"
            class="product__step"
          />
          <div v-else-if="inStock" class="product__qty product__step">
            <span>{{ productCopy.quantityTitle }}</span>
            <QuantityStepper v-model="quantity" :min="1" :max="10" />
          </div>

          <div ref="ctaEl" class="product__step">
            <ProductActions
              :total="total"
              :in-stock="inStock"
              :title="product.title"
              @buy="buyNow"
              @add="addToCart"
            />
          </div>
        </div>
      </div>

      <div class="product__more">
        <ProductDetails :product="product" class="product__details" />
        <PaymentMethodsInfo v-reveal compact class="product__payments" />
      </div>

      <section v-if="product.related?.length" class="product__related">
        <SectionHeading :eyebrow="productCopy.relatedEyebrow" :title="productCopy.relatedTitle" />
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
  padding-block: 0 calc(#{$space-xl} + 4.5rem);

  @include from('md') {
    padding-top: 1.5rem;
  }

  @include from('lg') {
    padding-block: 2.5rem $space-xl;
  }

  &__top {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  // Galería fija en escritorio: la foto acompaña mientras se elige la oferta.
  &__gallery {
    min-width: 0;

    @include from('md') {
      width: 100%;
      max-width: 620px;
      align-self: center;
    }

    @include from('lg') {
      flex: 1.1;
      max-width: none;
      align-self: flex-start;
      position: sticky;
      top: 6rem;
    }
  }

  &__buy {
    @include flex(column, stretch, flex-start, 1.6rem);

    @include from('md') {
      width: 100%;
      max-width: 620px;
      align-self: center;
    }

    @include from('lg') {
      flex: 1;
      max-width: 500px;
      align-self: flex-start;
    }
  }

  // Entrada orquestada de la columna de compra: un solo momento, escalonado.
  &__step {
    animation: rise $dur-slow $ease-out both;

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        animation-delay: #{80 + ($i - 1) * 70}ms;
      }
    }
  }

  &__qty {
    @include flex(row, center, space-between, 1rem);

    span {
      @include eyebrow;
      color: $ink-soft;
    }
  }

  &__more {
    @include flex(column, stretch, flex-start, 2.5rem);
    margin-top: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__details {
    flex: 1.4;
    min-width: 0;
  }

  &__payments {
    flex: 1;
    min-width: 0;

    @include from('lg') {
      position: sticky;
      top: 6rem;
    }
  }

  &__related {
    margin-top: $space-xl;
  }
}
</style>
