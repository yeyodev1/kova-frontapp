<script setup lang="ts">
import { site, whatsappLink, layoutCopy, policyLinks, paymentMethodsInfo } from '@/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo">
          <img :src="site.logo" alt="" width="40" height="40" loading="lazy" />
          <span>{{ site.name.toUpperCase() }}</span>
        </RouterLink>
        <p class="footer__tagline">{{ site.tagline }} {{ site.description }}</p>
        <a :href="whatsappLink()" class="btn btn--whatsapp footer__wa" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> {{ layoutCopy.whatsappFloat }}
        </a>
      </div>

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
        <h2 class="footer__heading footer__heading--spaced">{{ layoutCopy.footer.contact }}</h2>
        <a :href="`mailto:${site.email}`"><i class="fa-solid fa-envelope"></i> {{ site.email }}</a>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }} · Ecuador</span>
      <span class="footer__credit">Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  color: rgba($paper, 0.85);
  margin-top: auto;

  &__inner {
    @include container;
    @include flex-cards(200px, 2rem);
    padding-block: $space-xl 2rem;
  }

  &__brand {
    flex: 2 1 260px;
    @include flex(column, flex-start, flex-start, 0.8rem);
  }

  &__logo {
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-display;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: $paper;
    font-size: 1.2rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 10px;
    }
  }

  &__tagline {
    font-size: $text-sm;
    color: rgba($paper, 0.65);
    max-width: 36ch;
  }

  &__wa {
    min-height: 2.9rem;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.2rem);
    font-size: $text-sm;

    a,
    span {
      color: rgba($paper, 0.75);
      padding-block: 0.35rem;
    }

    a {
      @include transition(color);

      &:hover {
        color: $accent-soft;
      }
    }
  }

  &__pay i {
    width: 1.2rem;
    color: $silver;
  }

  &__heading {
    @include eyebrow;
    color: $silver;
    margin-bottom: 0.35rem;

    &--spaced {
      margin-top: 1rem;
    }
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem calc(1.2rem + env(safe-area-inset-bottom));
    border-top: 1px solid rgba($paper, 0.1);
    font-size: $text-xs;
    color: rgba($paper, 0.55);
  }

  &__credit a {
    color: rgba($paper, 0.8);
  }
}
</style>
