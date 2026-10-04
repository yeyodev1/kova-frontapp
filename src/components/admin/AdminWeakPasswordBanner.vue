<script setup lang="ts">
import { usePasswordChange } from '@/composables/admin/usePasswordChange'

const { weak, show } = usePasswordChange()
</script>

<template>
  <Transition name="rise">
    <div v-if="weak" class="weakpw" role="status">
      <span class="weakpw__icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></span>
      <p class="weakpw__text">
        <strong>Tu contraseña es muy fácil de adivinar.</strong>
        <span>Cámbiala ahora: toma menos de un minuto.</span>
      </p>
      <button type="button" class="weakpw__btn" @click="show">
        <i class="fa-solid fa-key"></i> Cambiar contraseña
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.weakpw {
  @include flex(row, center, flex-start, 0.75rem);
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
  padding: 0.85rem 0.95rem;
  border-radius: $radius-md;
  background: $warning-bg;
  border: 1px solid rgba($warning, 0.45);

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    background: rgba($warning, 0.22);
    color: darken($warning, 22%);
  }

  &__text {
    @include flex(column, stretch, flex-start, 0.1rem);
    flex: 1 1 14rem;
    min-width: 0;
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__btn {
    @include flex(row, center, center, 0.45rem);
    flex: 1 1 100%;
    min-height: 2.6rem;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $surface;
    background: $accent-deep;
    transition: background-color $dur $ease-out;

    &:hover {
      background: $ink;
    }

    @include from('sm') {
      flex: 0 0 auto;
    }
  }
}
</style>
