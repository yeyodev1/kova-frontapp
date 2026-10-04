<script setup lang="ts">
import { trackingCopy } from '@/config/site'
import { useTracking } from '@/composables/useTracking'

const emit = defineEmits<{ retry: [] }>()
const { notFound, error, whatsapp } = useTracking()
</script>

<template>
  <section class="tn" role="alert">
    <div class="tn__head">
      <span class="tn__icon" aria-hidden="true"><i class="fa-solid fa-magnifying-glass"></i></span>
      <div>
        <h2 class="tn__title">{{ notFound ? trackingCopy.notFoundTitle : trackingCopy.errorTitle }}</h2>
        <p class="tn__text">{{ notFound ? trackingCopy.notFoundText : error }}</p>
      </div>
    </div>
    <ul v-if="notFound" class="tn__checks">
      <li v-for="item in trackingCopy.notFoundChecks" :key="item">
        <i class="fa-solid fa-check" aria-hidden="true"></i> {{ item }}
      </li>
    </ul>
    <div class="tn__actions">
      <button type="button" class="btn btn--ghost tn__btn" @click="emit('retry')">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> {{ trackingCopy.retry }}
      </button>
      <a :href="whatsapp" class="btn btn--whatsapp tn__btn" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ trackingCopy.whatsappCta }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tn {
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.2rem 1.1rem;
  border-radius: 20px;
  background: $surface;
  border: 1px solid rgba($warning, 0.45);
  box-shadow: 0 0 0 4px rgba($warning, 0.08), $shadow-sm;

  &__head {
    @include flex(row, flex-start, flex-start, 0.85rem);
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 12px;
    background: $warning-bg;
    color: darken($warning, 18%);
  }

  &__title {
    @include display($text-lg, 760, 112%);
  }

  &__text {
    margin-top: 0.25rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__checks {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
    padding: 0.85rem 0.95rem;
    border-radius: 14px;
    background: $paper;
    font-size: $text-sm;

    li {
      @include flex(row, baseline, flex-start, 0.55rem);
    }

    i {
      color: $accent;
      font-size: 0.75rem;
    }
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__btn {
    flex: 1 1 11rem;
  }
}
</style>
