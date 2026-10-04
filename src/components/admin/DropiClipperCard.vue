<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminButton from './AdminButton.vue'
import DropiClipSteps from './DropiClipSteps.vue'
import { dropiClipperHref } from '@/utils/dropiClipper'

// El href se arma con el origen del panel: el favorito siempre manda a esta misma instalación.
const href = computed(() => dropiClipperHref())
const nudge = ref(false)
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

// Tocarlo aquí no hace nada útil: se avisa que hay que arrastrarlo.
function onClick() {
  nudge.value = false
  requestAnimationFrame(() => (nudge.value = true))
}
</script>

<template>
  <section class="clipper">
    <div class="clipper__head">
      <p class="clipper__eyebrow">Vía principal</p>
      <h2 class="clipper__title">Traer productos desde Dropi</h2>
      <p class="clipper__intro">
        Sin esperar a la API: abre Dropi con tu cuenta, toca el favorito y elige aquí qué importar.
        Kova solo lee lo que tú ya estás viendo; no guarda tu clave de Dropi.
      </p>
    </div>

    <div class="clipper__drag">
      <a
        :href="href"
        class="clipper__bm"
        :class="{ 'is-glinting': nudge }"
        title="Arrástralo a tu barra de favoritos"
        @click.prevent="onClick"
        @animationend="nudge = false"
      >
        <i class="fa-solid fa-paper-plane"></i> Enviar a Kova
      </a>
      <p class="clipper__tip" :class="{ 'clipper__tip--on': nudge }" role="status">
        <i class="fa-solid fa-arrow-up"></i>
        Arrástralo a tu barra de favoritos.
        <template v-if="nudge"> Tocarlo aquí no hace nada: úsalo dentro de Dropi.</template>
      </p>
    </div>

    <DropiClipSteps />

    <ul class="clipper__notes">
      <li>
        <i class="fa-regular fa-keyboard"></i>
        ¿No ves la barra de favoritos? Muéstrala con
        <kbd>{{ isMac ? 'Cmd' : 'Ctrl' }}</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>.
      </li>
      <li>
        <i class="fa-solid fa-desktop"></i>
        Funciona en computador (Chrome, Edge, Safari o Firefox). En el celular no hay barra de
        favoritos.
      </li>
      <li>
        <i class="fa-solid fa-calculator"></i>
        Dropi muestra los precios como imagen: el precio proveedor lo escribes tú al elegir.
      </li>
    </ul>

    <AdminButton to="/admin/dropi/traer" icon="fa-solid fa-arrow-right"
      >Ver lo que llegó de Dropi</AdminButton
    >
  </section>
</template>

<style scoped lang="scss">
.clipper {
  @include alu-border($radius-md);
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.1rem;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 1.5rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.35rem;
  }

  &__title {
    @include display($text-xl, 800, 112%);
  }

  &__intro {
    margin-top: 0.45rem;
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
    max-width: 60ch;
  }

  &__drag {
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1rem;
    border-radius: $radius-sm;
    border: 1px dashed $alu-dark;
    background: $alu-light;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }
  }

  &__bm {
    @include glint('&:hover');
    @include flex(row, center, center, 0.5rem);
    padding: 0.75rem 1.3rem;
    border-radius: $radius-pill;
    background: $accent-deep;
    color: #fff;
    font-weight: 700;
    font-size: $text-sm;
    cursor: grab;
    box-shadow: $shadow-sm;
    user-select: none;
    @include focus-ring;

    &:active {
      cursor: grabbing;
    }
  }

  &__tip {
    font-size: $text-xs;
    color: $ink-soft;

    &--on {
      color: $accent-deep;
      font-weight: 600;
    }
  }

  &__notes {
    @include flex(column, stretch, flex-start, 0.45rem);
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: $text-xs;
    color: $ink-soft;

    i {
      width: 1.1rem;
      color: $accent;
    }
  }

  kbd {
    font-family: $font-mono;
    font-size: 0.68rem;
    padding: 0.08rem 0.35rem;
    border-radius: 5px;
    border: 1px solid $alu-dark;
    background: $surface;
  }
}
</style>
