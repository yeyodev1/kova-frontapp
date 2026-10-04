<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'

const props = defineProps<{ items: string[]; title: string; icon?: string; placeholder?: string }>()

function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= props.items.length) return
  const tmp = props.items[i] as string
  props.items[i] = props.items[j] as string
  props.items[j] = tmp
}
</script>

<template>
  <AdminPanel :title="title" :icon="icon">
    <template #actions>
      <AdminButton variant="soft" icon="fa-solid fa-plus" @click="items.push('')">Agregar</AdminButton>
    </template>
    <p v-if="!items.length" class="list__empty">Lista vacía.</p>
    <div v-for="(_, i) in items" :key="i" class="list__row">
      <input v-model="items[i]" type="text" :placeholder="placeholder" :aria-label="`${title} ${i + 1}`" />
      <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
      <button type="button" class="list__del" aria-label="Quitar" @click="items.splice(i, 1)">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.list {
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__row {
    @include flex(row, center, flex-start, 0.3rem);
    margin-bottom: 0.45rem;

    input {
      flex: 1;
      min-width: 0;
    }

    button {
      flex-shrink: 0;
      width: 2.2rem;
      height: 2.2rem;
      color: $ink-muted;

      &:disabled {
        opacity: 0.3;
      }
    }
  }

  &__del {
    color: $danger !important;
  }
}
</style>
