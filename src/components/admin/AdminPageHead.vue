<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; back?: string }>()
</script>

<template>
  <header class="head">
    <div class="head__text">
      <RouterLink v-if="back" :to="back" class="head__back">
        <i class="fa-solid fa-arrow-left"></i> Volver
      </RouterLink>
      <h1 class="head__title">{{ title }}</h1>
      <p v-if="subtitle" class="head__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.head {
  @include flex(column, stretch, flex-start, 0.8rem);
  margin-bottom: 1.2rem;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__back {
    font-size: $text-sm;
    color: $ink-muted;
    display: inline-block;
    margin-bottom: 0.3rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: 0.2rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
