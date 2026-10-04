<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { policies, policyCopy, policyLinks, site, whatsappLink } from '@/config/site'
import EmptyState from '@/components/store/EmptyState.vue'

const route = useRoute()
const policy = computed(() => policies.find((p) => p.slug === route.params.slug))
const others = computed(() => policyLinks.filter((link) => link.to !== route.path))

/** Ancla estable por sección: "Tiempos de entrega" → "tiempos-de-entrega". */
function anchor(heading: string): string {
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

watchEffect(() => {
  if (policy.value) document.title = `${policy.value.title} — ${site.name}`
})
</script>

<template>
  <div class="policy">
    <article v-if="policy" class="policy__doc">
      <header class="policy__head">
        <p class="policy__eyebrow">{{ policyCopy.eyebrow }}</p>
        <h1 class="policy__title">{{ policy.title }}</h1>
        <p class="policy__updated">{{ policyCopy.updated(policy.updated) }}</p>
      </header>

      <nav v-if="policy.sections.length > 2" class="policy__toc" :aria-label="policyCopy.toc">
        <p class="policy__toc-title">{{ policyCopy.toc }}</p>
        <ol>
          <li v-for="section in policy.sections" :key="section.heading">
            <a :href="`#${anchor(section.heading)}`">{{ section.heading }}</a>
          </li>
        </ol>
      </nav>

      <section
        v-for="section in policy.sections"
        :id="anchor(section.heading)"
        :key="section.heading"
        class="policy__section"
      >
        <h2>{{ section.heading }}</h2>
        <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>
      </section>

      <a :href="whatsappLink(policyCopy.whatsappMessage(policy.title))" class="policy__help" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ policyCopy.help }}
      </a>
    </article>

    <EmptyState v-else icon="fa-solid fa-file-circle-question" :title="policyCopy.notFoundTitle" :text="policyCopy.notFoundText" />

    <nav class="policy__nav" :aria-label="policyCopy.others">
      <p class="policy__toc-title">{{ policyCopy.others }}</p>
      <div class="policy__links">
        <RouterLink v-for="link in policy ? others : policyLinks" :key="link.to" :to="link.to">
          {{ link.label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.policy {
  @include container(780px);
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: 2.5rem $space-xl;

  &__doc {
    max-width: 68ch;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 800, 118%);
    margin-top: 0.5rem;
  }

  &__updated {
    font-family: $font-mono;
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.75rem;
  }

  &__toc {
    margin-top: 2rem;
    padding: 1.1rem 1.25rem;
    @include alu-border(16px);

    ol {
      list-style: none;
      counter-reset: toc;
      @include flex(column, stretch, flex-start, 0.15rem);
    }

    li {
      counter-increment: toc;
    }

    a {
      @include flex(row, baseline, flex-start, 0.75rem);
      padding: 0.4rem 0;
      color: $ink-soft;
      font-weight: 600;
      transition: color $dur-fast ease;

      &::before {
        content: counter(toc, decimal-leading-zero);
        font-family: $font-mono;
        font-size: $text-xs;
        color: $accent;
      }

      &:hover {
        color: $accent-deep;
      }
    }
  }

  &__toc-title {
    @include eyebrow;
    color: $ink-muted;
    margin-bottom: 0.5rem;
  }

  &__section {
    margin-top: 2.5rem;
    scroll-margin-top: 6rem;

    h2 {
      @include display($text-xl, 760, 112%);
      margin-bottom: 0.75rem;
    }

    p {
      color: $ink-soft;
      font-size: 1.05rem;
      line-height: 1.75;
      margin-bottom: 1rem;
    }
  }

  &__help {
    @include flex(row, center, flex-start, 0.5rem);
    margin-top: 2rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__nav {
    padding-top: 1.75rem;
    border-top: 1px solid $line;
  }

  &__links {
    @include flex-cards(220px, 0.6rem);

    a {
      @include flex(row, center, space-between, 0.75rem);
      min-height: 3.25rem;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      border: 1px solid $line;
      background: $surface;
      font-size: $text-sm;
      font-weight: 600;
      transition:
        border-color $dur-fast ease,
        transform $dur-fast $ease-out;

      i {
        color: $accent;
        transition: transform $dur $ease-out;
      }

      &:hover {
        border-color: $accent;

        i {
          transform: translateX(3px);
        }
      }
    }
  }
}
</style>
