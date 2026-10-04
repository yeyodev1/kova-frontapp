<script setup lang="ts">
import { catalog, whatsappLink } from '@/config/site'

defineProps<{ error: string; filtered: boolean; categories: string[] }>()
const emit = defineEmits<{ retry: []; reset: []; pick: [category: string] }>()
</script>

<template>
  <div class="empty" role="status">
    <div class="empty__plinth" aria-hidden="true">
      <i :class="error ? 'fa-solid fa-plug-circle-xmark' : 'fa-solid fa-magnifying-glass'"></i>
    </div>
    <h2 class="empty__title">{{ error || catalog.emptyTitle }}</h2>
    <p v-if="!error" class="empty__text">{{ catalog.emptyText }}</p>

    <div class="empty__actions">
      <button v-if="error" class="btn btn--primary" @click="emit('retry')">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ catalog.retry }}
      </button>
      <button v-else-if="filtered" class="btn btn--primary" @click="emit('reset')">
        {{ catalog.emptyCta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
      <a :href="whatsappLink()" class="btn btn--ghost" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ catalog.askWhatsapp }}
      </a>
    </div>

    <div v-if="!error && categories.length" class="empty__chips">
      <button
        v-for="item in categories"
        :key="item"
        class="empty__chip"
        @click="emit('pick', item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, flex-start, 0.75rem);
  text-align: center;
  padding: $space-lg 0.5rem;
  animation: rise $dur-slow $ease-out both;

  &__plinth {
    @include plinth(50%);
    @include flex(row, center, center);
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom: 0.5rem;
    color: $accent;
    font-size: 1.6rem;
  }

  &__title {
    @include display($text-xl, 750, 118%);
  }

  &__text {
    color: $ink-soft;
    max-width: 40ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__chips {
    @include flex(row, center, center, 0.45rem);
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  &__chip {
    min-height: 2.5rem;
    padding: 0.35rem 1rem;
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: inset 0 0 0 1px $line;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    transition: transform $dur-fast $ease-out;

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
