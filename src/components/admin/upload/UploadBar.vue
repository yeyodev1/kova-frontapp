<script setup lang="ts">
import AdminButton from '../AdminButton.vue'

defineProps<{ saving: '' | 'publish' | 'draft'; uploading: boolean; status: string }>()
const emit = defineEmits<{ publish: []; draft: [] }>()
</script>

<template>
  <div class="bar">
    <p class="bar__status" role="status">
      <template v-if="uploading"><i class="fa-solid fa-spinner fa-spin"></i> Subiendo fotos…</template>
      <template v-else>{{ status }}</template>
    </p>
    <div class="bar__actions">
      <AdminButton class="bar__draft" :loading="saving === 'draft'" :disabled="!!saving" @click="emit('draft')">
        Guardar borrador
      </AdminButton>
      <AdminButton
        class="bar__publish"
        variant="primary"
        icon="fa-solid fa-rocket"
        :loading="saving === 'publish'"
        :disabled="!!saving"
        @click="emit('publish')"
      >
        Publicar
      </AdminButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Fija sobre la nav inferior en móvil: publicar siempre queda a un toque del pulgar.
.bar {
  position: sticky;
  bottom: calc(64px + env(safe-area-inset-bottom) + 0.5rem);
  z-index: 20;
  @include flex(column, stretch, flex-start, 0.45rem);
  margin-top: 1.2rem;
  padding: 0.6rem;
  border-radius: $radius-md;
  background: rgba($surface, 0.97);
  border: 1px solid $line;
  box-shadow: $shadow-md;

  @include from('md') {
    bottom: 1rem;
    flex-direction: row;
    align-items: center;
    padding: 0.6rem 0.8rem;
  }

  &__status {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
    min-height: 1em;

    &:empty {
      display: none;
    }

    @include from('md') {
      flex: 1;
      text-align: left;
    }
  }

  &__actions {
    @include flex(row, stretch, flex-end, 0.5rem);
  }

  &__draft {
    flex: 0 0 auto;
    min-height: 50px;
  }

  &__publish {
    flex: 1 1 auto;
    min-height: 50px;
    font-size: 1.02rem;

    @include from('md') {
      flex: 0 0 auto;
      min-width: 180px;
    }
  }
}
</style>
