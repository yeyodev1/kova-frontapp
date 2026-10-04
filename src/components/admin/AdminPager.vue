<script setup lang="ts">
defineProps<{ page: number; pages: number; total?: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button class="pager__btn" :disabled="page <= 1" aria-label="Anterior" @click="emit('change', page - 1)">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <span class="pager__info">
      Página {{ page }} de {{ pages }}<template v-if="total !== undefined"> · {{ total }}</template>
    </span>
    <button class="pager__btn" :disabled="page >= pages" aria-label="Siguiente" @click="emit('change', page + 1)">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 0.8rem);
  padding-block: 1rem;

  &__btn {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    border: 1px solid $line;
    background: $surface;
    @include flex(row, center, center);

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  &__info {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
