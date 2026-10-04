<script setup lang="ts">
withDefaults(
  defineProps<{ icon: string; title: string; text?: string; tone?: 'success' | 'danger' | 'warning' }>(),
  { tone: 'danger', text: '' },
)
</script>

<template>
  <section class="ps" :role="tone === 'success' ? 'status' : 'alert'">
    <span class="ps__icon" :class="`ps__icon--${tone}`" aria-hidden="true"><i :class="icon"></i></span>
    <h1 class="ps__title">{{ title }}</h1>
    <p v-if="text" class="ps__text">{{ text }}</p>
    <div v-if="$slots.default" class="ps__actions"><slot /></div>
  </section>
</template>

<style scoped lang="scss">
.ps {
  @include flex(column, center, flex-start, 0.7rem);
  padding: 1.75rem 1.25rem 1.4rem;
  border-radius: 20px;
  background: $surface;
  border: 1px solid $line;
  box-shadow: $shadow-sm;
  text-align: center;
  animation: rise $dur-slow $ease-out both;

  &__icon {
    @include flex(row, center, center);
    width: 4.25rem;
    height: 4.25rem;
    margin-bottom: 0.3rem;
    border-radius: 50%;
    font-size: 1.7rem;
    animation: pop 0.45s $ease-spring;

    &--success {
      background: $success-bg;
      color: darken($success, 4%);
    }

    &--danger {
      background: $danger-bg;
      color: $danger;
    }

    &--warning {
      background: $warning-bg;
      color: darken($warning, 14%);
    }
  }

  &__title {
    @include display($text-xl, 800, 114%);
  }

  &__text {
    max-width: 36ch;
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.5;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
