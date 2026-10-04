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
    @include flex(row, center, flex-start, 0.4rem);
    display: inline-flex;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
    margin-bottom: 0.4rem;
    transition: color $dur $ease-out;

    i {
      transition: transform $dur $ease-out;
    }

    &:hover {
      color: $accent;

      i {
        transform: translateX(-3px);
      }
    }
  }

  &__title {
    @include display(clamp(1.5rem, 1.2rem + 1.4vw, 2.1rem), 800, 116%);
    overflow-wrap: anywhere;
  }

  &__subtitle {
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: $ink-muted;
    margin-top: 0.35rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
