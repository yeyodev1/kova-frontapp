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
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
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
    @include flex(row, center, flex-start, 0.55rem);
    @include display(1rem, 750, 110%);

    i {
      @include flex(row, center, center);
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 9px;
      background: $accent-soft;
      color: $accent;
      font-size: 0.75rem;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
    flex-wrap: wrap;
  }
}
</style>
