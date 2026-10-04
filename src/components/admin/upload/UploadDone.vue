<script setup lang="ts">
import AdminButton from '../AdminButton.vue'
import type { Product } from '@/types'

defineProps<{ product: Product | null }>()
const emit = defineEmits<{ again: [] }>()
</script>

<template>
  <Transition name="slide-up">
    <div v-if="product" class="done" role="dialog" aria-modal="true" aria-labelledby="up-done-title">
      <div class="done__sheet">
        <span class="done__icon" :class="{ 'done__icon--draft': !product.isPublished }">
          <i :class="product.isPublished ? 'fa-solid fa-check' : 'fa-regular fa-floppy-disk'"></i>
        </span>
        <h2 id="up-done-title" class="done__title">
          {{ product.isPublished ? 'Publicado' : 'Guardado como borrador' }}
        </h2>
        <p class="done__name">{{ product.title }}</p>
        <p class="done__text">
          {{ product.isPublished ? 'Ya se ve en la tienda.' : 'No se ve en la tienda hasta que lo publiques.' }}
        </p>
        <div class="done__actions">
          <AdminButton
            v-if="product.isPublished"
            variant="primary"
            icon="fa-solid fa-store"
            :to="`/producto/${product.slug}`"
            block
          >
            Ver en la tienda
          </AdminButton>
          <AdminButton
            :variant="product.isPublished ? 'ghost' : 'primary'"
            icon="fa-solid fa-plus"
            block
            @click="emit('again')"
          >
            Subir otro
          </AdminButton>
          <AdminButton variant="soft" icon="fa-solid fa-pen" :to="`/admin/productos/${product._id}`" block>
            Editar detalles
          </AdminButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.done {
  position: fixed;
  inset: 0;
  z-index: 90;
  @include flex(column, stretch, flex-end);
  background: $overlay;

  @include from('md') {
    align-items: center;
    justify-content: center;
  }

  &__sheet {
    @include flex(column, center, flex-start, 0.4rem);
    padding: 1.6rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom));
    border-radius: $radius-lg $radius-lg 0 0;
    background: $surface;
    box-shadow: $shadow-lg;
    text-align: center;

    @include from('md') {
      width: 420px;
      border-radius: $radius-lg;
      padding-bottom: 1.4rem;
    }
  }

  &__icon {
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $success-bg;
    color: $success;
    font-size: 1.5rem;
    margin-bottom: 0.4rem;

    i {
      animation: pop 0.5s $ease-spring;
    }

    &--draft {
      background: $accent-soft;
      color: $accent-deep;
    }
  }

  &__title {
    @include display(1.5rem, 800, 110%);
  }

  &__name {
    font-weight: 600;
    color: $ink-soft;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__actions {
    width: 100%;
    @include flex(column, stretch, flex-start, 0.5rem);
    margin-top: 0.9rem;

    > * {
      min-height: 50px;
    }
  }
}
</style>
