<script setup lang="ts">
import { computed, ref } from 'vue'
import { home, generalFaqs, whatsappLink } from '@/config/site'
import { storeService } from '@/services/store.service'
import HomeHero from '@/components/home/HomeHero.vue'
import HowToBuy from '@/components/home/HowToBuy.vue'
import ProductSection from '@/components/home/ProductSection.vue'
import HomeFinalCta from '@/components/home/HomeFinalCta.vue'
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
// La vitrina del hero rota entre los primeros destacados.
const showcase = computed(() => featured.value.slice(0, 4))

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
    <HomeHero :products="showcase" :loading="loading" />

    <div class="home__trust">
      <GuaranteeStrip />
    </div>

    <div class="home__body">
      <ProductSection
        :eyebrow="home.popular.eyebrow"
        :title="home.popular.title"
        :products="popular"
        :loading="loading"
        link="/tienda?orden=popular"
      />
      <ProductSection
        :eyebrow="home.featured.eyebrow"
        :title="home.featured.title"
        :products="featured"
        :loading="loading && !popular.length"
        link="/tienda"
      />

      <EmptyState v-if="isEmpty" icon="fa-solid fa-store" :title="home.empty.title" :text="home.empty.text">
        <a :href="whatsappLink()" class="btn btn--whatsapp" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
      </EmptyState>
    </div>

    <HowToBuy />

    <div class="home__body">
      <PaymentMethodsInfo />

      <section class="home__faqs">
        <SectionHeading :eyebrow="home.faqs.eyebrow" :title="home.faqs.title" class="home__faqs-head" />
        <FaqList :items="generalFaqs" class="home__faqs-list" />
      </section>
    </div>

    <HomeFinalCta />
  </div>
</template>

<style scoped lang="scss">
.home {
  &__trust {
    @include container(1200px);
    position: relative;
    z-index: 2;
    margin-top: -1.25rem;

    @include from('md') {
      margin-top: -2rem;
    }
  }

  &__body {
    @include container(1200px);
    @include flex(column, stretch, flex-start, $space-xl);
    padding-block: $space-xl;
  }

  &__faqs {
    @include flex(column, stretch, flex-start);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__faqs-head {
    @include from('lg') {
      flex: 0 0 34%;
      position: sticky;
      top: 6rem;
    }
  }

  &__faqs-list {
    flex: 1;
  }
}
</style>
