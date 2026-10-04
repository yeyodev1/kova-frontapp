<script setup lang="ts">
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <div class="empty__display" aria-hidden="true">
      <span class="empty__plinth"><i :class="icon || 'fa-solid fa-box-open'"></i></span>
      <span class="empty__base"></span>
    </div>
    <h2 class="empty__title">{{ title }}</h2>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <div class="empty__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.6rem);
  text-align: center;
  padding: $space-lg 1rem;

  &__display {
    @include flex(column, center, flex-start);
    margin-bottom: 0.9rem;
    animation: rise 0.6s $ease-out both;
  }

  // Peana chica con el ícono flotando: el estado vacío también es vitrina.
  &__plinth {
    @include plinth(20px);
    @include flex(row, center, center);
    width: 5.5rem;
    height: 5rem;
    color: $accent;
    font-size: 1.6rem;

    i {
      animation: float 3.2s ease-in-out infinite alternate;
    }
  }

  &__base {
    width: 4.6rem;
    height: 8px;
    border-radius: 0 0 8px 8px;
    background: linear-gradient(180deg, $alu, $alu-dark);
  }

  &__title {
    @include display($text-xl, 780, 115%);
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    max-width: 40ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;

    &:empty {
      display: none;
    }
  }
}

@keyframes float {
  to {
    transform: translateY(-5px);
  }
}
</style>
