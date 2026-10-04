<script setup lang="ts">
// Los cuatro pasos del botón "Enviar a Kova". Es una secuencia real, por eso va numerada.
const steps = [
  {
    icon: 'fa-solid fa-hand-pointer',
    title: 'Arrastra el botón',
    text: 'Lleva "Enviar a Kova" a tu barra de favoritos. Se hace una sola vez.',
  },
  {
    icon: 'fa-solid fa-store',
    title: 'Abre Dropi',
    text: 'Entra a app.dropi.ec con tu cuenta y abre el catálogo o la ficha de un producto. Baja para cargar más antes de seguir.',
  },
  {
    icon: 'fa-solid fa-bookmark',
    title: 'Toca el favorito',
    text: 'Kova lee lo que ves en pantalla (fotos, nombre e ID) y lo abre aquí.',
  },
  {
    icon: 'fa-solid fa-list-check',
    title: 'Elige e importa',
    text: 'Escribe el precio proveedor que ves en Dropi, marca los que quieres e impórtalos.',
  },
]
</script>

<template>
  <ol class="steps">
    <li v-for="(step, i) in steps" :key="step.title" class="steps__item">
      <span class="steps__plinth"><i :class="step.icon"></i></span>
      <div class="steps__text">
        <p class="steps__title">
          <span class="steps__n">{{ i + 1 }}</span> {{ step.title }}
        </p>
        <p class="steps__desc">{{ step.text }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.steps {
  @include flex-cards(220px, 0.7rem);
  list-style: none;
  padding: 0;
  margin: 0;

  &__item {
    @include flex(row, flex-start, flex-start, 0.75rem);
    padding: 0.8rem;
    border-radius: $radius-sm;
    background: $alu-light;
    border: 1px solid $line;
  }

  &__plinth {
    @include plinth(12px);
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 2.6rem;
    height: 2.6rem;
    color: $accent;
  }

  &__text {
    @include flex(column, stretch, flex-start, 0.2rem);
    min-width: 0;
  }

  &__title {
    font-weight: 700;
    font-size: $text-sm;
  }

  &__n {
    font-family: $font-mono;
    color: $accent;
    margin-right: 0.2rem;
  }

  &__desc {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.45;
  }
}
</style>
