<script setup lang="ts">
import { computed, ref } from 'vue'
import { home, generalFaqs, whatsappLink } from '@/config/site'
import { storeService } from '@/services/store.service'
import HomeHero from '@/components/home/HomeHero.vue'
import HowToBuy from '@/components/home/HowToBuy.vue'
import ProductSection from '@/components/home/ProductSection.vue'
import GuaranteeStrip from '@/components/store/GuaranteeStrip.vue'
import PaymentMethodsInfo from '@/components/store/PaymentMethodsInfo.vue'
import SectionHeading from '@/components/store/SectionHeading.vue'
import FaqList from '@/components/store/FaqList.vue'
import EmptyState from '@/components/store/EmptyState.vue'
import type { Product } from '@/types'

const featured = ref<Product[]>([])
const popular = ref<Product[]>([])
const loading = ref(true)

const isEmpty = computed(() => !loading.value && !featured.value.length && !popular.value.length)

async function load() {
  const [f, p] = await Promise.allSettled([
    storeService.products({ featured: true, limit: 8 }),
    storeService.products({ sort: 'popular', limit: 8 }),
  ])
  if (f.status === 'fulfilled') featured.value = f.value.items
  if (p.status === 'fulfilled') {
    // Sin repetir en "más vendidos" lo que ya está en destacados.
    const seen = new Set(featured.value.map((x) => x._id))
    popular.value = p.value.items.filter((x) => !seen.has(x._id)).slice(0, 8)
  }
  loading.value = false
}

load()
</script>

<template>
  <div class="home">
    <HomeHero />

    <div class="home__body">
      <GuaranteeStrip />

      <ProductSection
        :eyebrow="home.featured.eyebrow"
        :title="home.featured.title"
        :products="featured"
        :loading="loading"
        link="/tienda"
      />
      <ProductSection
        :eyebrow="home.popular.eyebrow"
        :title="home.popular.title"
        :products="popular"
        :loading="loading && !featured.length"
        link="/tienda?orden=popular"
      />

      <EmptyState v-if="isEmpty" icon="fa-solid fa-store" :title="home.empty.title" :text="home.empty.text">
        <a :href="whatsappLink()" class="btn btn--whatsapp" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
      </EmptyState>

      <HowToBuy />
      <PaymentMethodsInfo />

      <section>
        <SectionHeading :eyebrow="home.faqs.eyebrow" :title="home.faqs.title" />
        <FaqList :items="generalFaqs" />
      </section>
    </div>

    <section class="final">
      <h2 class="final__title">{{ home.finalCta.title }}</h2>
      <p class="final__text">{{ home.finalCta.text }}</p>
      <RouterLink to="/tienda" class="btn btn--cta btn--lg">
        {{ home.finalCta.cta }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  &__body {
    @include container;
    @include flex(column, stretch, flex-start, $space-xl);
    padding-block: 1.5rem $space-xl;

    @include from('md') {
      padding-top: 2.5rem;
    }
  }
}

.final {
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  background: $sand;
  padding: $space-xl 1.25rem;

  &__title {
    @include display($display-sm, 600);
    max-width: 22ch;
  }

  &__text {
    color: $ink-soft;
    max-width: 48ch;
    margin-bottom: 0.4rem;
  }
}
</style>
