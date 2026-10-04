<script setup lang="ts">
defineProps<{ title?: string; icon?: string }>()
</script>

<template>
  <section class="panel">
    <header v-if="title || $slots.actions" class="panel__head">
      <h2 class="panel__title">
        <i v-if="icon" :class="icon"></i>
        {{ title }}
      </h2>
      <div class="panel__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.panel {
  @include card;
  padding: 1rem;

  @include from('md') {
    padding: 1.3rem 1.4rem;
  }

  &__head {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 0.9rem;
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;

    i {
      color: $accent;
      font-size: 0.9em;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
    flex-wrap: wrap;
  }
}
</style>
