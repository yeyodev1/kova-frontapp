<script setup lang="ts">
import { site, whatsappLink, layoutCopy, policyLinks, paymentMethodsInfo } from '@/config/site'
import BrandMark from '@/components/layout/BrandMark.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" :aria-label="layoutCopy.home" class="footer__logo">
          <BrandMark light size="lg" />
        </RouterLink>
        <p class="footer__tagline">{{ site.tagline }} {{ site.description }}</p>
      </div>

      <a :href="whatsappLink()" class="footer__wa" target="_blank" rel="noopener">
        <span class="footer__wa-icon"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span>
        <span class="footer__wa-copy">
          <strong>{{ layoutCopy.footer.whatsappTitle }}</strong>
          <span>{{ layoutCopy.footer.whatsappText }}</span>
        </span>
        <i class="fa-solid fa-arrow-right footer__wa-arrow" aria-hidden="true"></i>
      </a>

      <div class="footer__cols">
        <div class="footer__col">
          <h2 class="footer__heading">{{ layoutCopy.footer.help }}</h2>
          <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        </div>

        <div class="footer__col">
          <h2 class="footer__heading">{{ layoutCopy.footer.policies }}</h2>
          <RouterLink v-for="link in policyLinks" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        </div>

        <div class="footer__col">
          <h2 class="footer__heading">{{ layoutCopy.footer.payments }}</h2>
          <span v-for="item in paymentMethodsInfo.items" :key="item.title" class="footer__pay">
            <i :class="item.icon" aria-hidden="true"></i> {{ item.title }}
          </span>
        </div>

        <div class="footer__col">
          <h2 class="footer__heading">{{ layoutCopy.footer.contact }}</h2>
          <a :href="`mailto:${site.email}`" class="footer__pay">
            <i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ site.email }}
          </a>
          <a :href="whatsappLink()" class="footer__pay" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>

    <div class="footer__bar">
      <span>
        © {{ year }} {{ site.name }} · {{ layoutCopy.footer.country }}
        <span class="footer__legal">· {{ site.legal.holder }} · RUC {{ site.legal.ruc }}</span>
      </span>
      <span class="footer__credit">
        {{ layoutCopy.footer.credit }} <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  @include moss;
  color: rgba($surface, 0.8);
  margin-top: auto;
  position: relative;
  overflow: hidden;

  // Filo de aluminio arriba: la vitrina termina en un canto metálico.
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba($alu, 0.6), transparent);
  }

  &__inner {
    @include container(1200px);
    @include flex(column, stretch, flex-start, 2.25rem);
    padding-block: $space-xl 2.5rem;

    @include from('lg') {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  &__brand {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex: 1 1 360px;
    }
  }

  &__tagline {
    font-size: $text-sm;
    color: rgba($surface, 0.62);
    max-width: 38ch;
  }

  &__wa {
    @include flex(row, center, flex-start, 0.9rem);
    padding: 1rem 1.1rem;
    border-radius: $radius-md;
    background: rgba($surface, 0.06);
    border: 1px solid rgba($surface, 0.12);
    transition:
      background-color $dur $ease-out,
      transform $dur-fast $ease-out;

    &:hover {
      background: rgba($surface, 0.1);
    }

    &:active {
      transform: scale(0.98);
    }

    @include from('lg') {
      flex: 0 1 420px;
    }
  }

  &__wa-icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: #1f9d55;
    color: $surface;
    font-size: 1.5rem;
  }

  &__wa-copy {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;

    strong {
      @include display($text-base, 750, 112%);
      color: $surface;
    }

    span {
      font-size: $text-xs;
      color: rgba($surface, 0.62);
      line-height: 1.45;
    }
  }

  &__wa-arrow {
    color: $sage;
    transition: transform $dur $ease-out;
  }

  &__wa:hover &__wa-arrow {
    transform: translateX(3px);
  }

  &__cols {
    @include flex-cards(140px, 2rem 1.5rem);
    padding-top: 2rem;
    border-top: 1px solid rgba($surface, 0.1);

    @include from('lg') {
      flex: 1 1 100%;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.1rem);
    font-size: $text-sm;

    a,
    span {
      color: rgba($surface, 0.72);
      padding-block: 0.4rem;
    }

    a {
      transition: color $dur $ease-out;

      &:hover {
        color: $surface;
      }
    }
  }

  &__pay {
    @include flex(row, center, flex-start, 0.55rem);

    i {
      width: 1.1rem;
      color: $sage;
    }
  }

  &__heading {
    @include eyebrow;
    color: $alu-dark;
    margin-bottom: 0.4rem;
  }

  &__bar {
    @include container(1200px);
    @include flex(row, center, space-between, 0.5rem 1rem);
    flex-wrap: wrap;
    padding-block: 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
    border-top: 1px solid rgba($surface, 0.08);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    color: rgba($surface, 0.5);
  }

  // En móvil el RUC baja a su propia línea en vez de cortarse a la mitad.
  &__legal {
    white-space: nowrap;
  }

  &__credit a {
    color: rgba($surface, 0.8);
  }
}
</style>
