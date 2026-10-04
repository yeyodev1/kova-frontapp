<script setup lang="ts">
import AdminButton from './AdminButton.vue'

defineProps<{ total: number; selected: number; blocked: number; importing: boolean }>()
const markup = defineModel<number>('markup', { required: true })
const emit = defineEmits<{ all: [value: boolean]; import: [] }>()
</script>

<template>
  <div class="tb">
    <div class="tb__left">
      <p class="tb__count">
        <strong>{{ selected }}</strong> de {{ total }} marcados
        <span v-if="blocked" class="tb__blocked">· {{ blocked }} sin ID o nombre</span>
        <span v-else-if="!selected" class="tb__hint"
          >· marca los que quieras o escribe su costo</span
        >
      </p>
      <div class="tb__links">
        <button type="button" @click="emit('all', true)">Seleccionar todo</button>
        <button type="button" @click="emit('all', false)">Ninguno</button>
      </div>
    </div>
    <div class="tb__right">
      <label class="tb__markup">
        <span>Margen %</span>
        <input
          v-model.number="markup"
          type="number"
          min="0"
          max="500"
          step="1"
          inputmode="numeric"
        />
      </label>
      <AdminButton
        variant="primary"
        icon="fa-solid fa-download"
        :loading="importing"
        :disabled="!selected"
        @click="emit('import')"
      >
        {{ importing ? 'Importando…' : `Importar ${selected} seleccionados` }}
      </AdminButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tb {
  @include flex(column, stretch, flex-start, 0.7rem);
  padding: 0.75rem 0.9rem;
  border-radius: $radius-md;
  background: rgba($surface, 0.96);
  border: 1px solid $line;
  box-shadow: $shadow-sm;

  // Fija solo en escritorio: en móvil el header del panel la taparía.
  @include from('md') {
    position: sticky;
    top: 0.5rem;
    z-index: 5;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__left,
  &__right {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
  }

  &__count {
    font-size: $text-sm;
  }

  &__hint {
    color: $ink-muted;
  }

  &__blocked {
    color: $danger;
    font-weight: 600;
  }

  &__links {
    @include flex(row, center, flex-start, 0.8rem);

    button {
      font-size: $text-xs;
      font-weight: 600;
      color: $accent-deep;
      text-decoration: underline;
    }
  }

  &__markup {
    @include flex(row, center, flex-start, 0.4rem);
    margin: 0;
    font-size: $text-xs;

    input {
      width: 4.8rem;
    }
  }
}
</style>
