<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { policies, policyLinks, site } from '@/config/site'
import EmptyState from '@/components/store/EmptyState.vue'

const route = useRoute()
const policy = computed(() => policies.find((p) => p.slug === route.params.slug))

watchEffect(() => {
  if (policy.value) document.title = `${policy.value.title} — ${site.name}`
})
</script>

<template>
  <div class="policy">
    <article v-if="policy" class="policy__body">
      <h1 class="policy__title">{{ policy.title }}</h1>
      <p class="policy__updated">Actualizado: {{ policy.updated }}</p>
      <section v-for="section in policy.sections" :key="section.heading" class="policy__section">
        <h2>{{ section.heading }}</h2>
        <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>
      </section>
    </article>

    <EmptyState v-else icon="fa-solid fa-file-circle-question" title="No encontramos esta política" />

    <nav class="policy__nav" aria-label="Políticas">
      <RouterLink v-for="link in policyLinks" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.policy {
  @include container(760px);
  @include flex(column, stretch, flex-start, 2rem);
  padding-block: 2rem $space-xl;

  &__title {
    @include display($display-sm, 600);
  }

  &__updated {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: 0.3rem;
  }

  &__section {
    margin-top: 1.75rem;

    h2 {
      font-size: $text-lg;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    p {
      color: $ink-soft;
      margin-bottom: 0.7rem;
    }
  }

  &__nav {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding-top: 1.5rem;
    border-top: 1px solid $line;

    a {
      font-size: $text-sm;
      padding: 0.5rem 0.9rem;
      border-radius: $radius-pill;
      border: 1px solid $line;
      background: $surface;

      &.router-link-active {
        border-color: $accent;
        color: $accent-deep;
      }
    }
  }
}
</style>
