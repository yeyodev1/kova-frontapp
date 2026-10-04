<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import type { SyncKind } from '@/composables/admin/useDropi'

defineProps<{ syncing: SyncKind | null; results: Partial<Record<SyncKind, Record<string, unknown> | string>> }>()
const emit = defineEmits<{ sync: [kind: SyncKind] }>()

const kinds: { kind: SyncKind; label: string; icon: string; hint: string }[] = [
  { kind: 'products', label: 'Productos', icon: 'fa-solid fa-box', hint: 'Stock y costo de los importados' },
  { kind: 'locations', label: 'Ubicaciones', icon: 'fa-solid fa-map-location-dot', hint: 'Provincias y ciudades' },
  { kind: 'orders', label: 'Pedidos', icon: 'fa-solid fa-truck', hint: 'Estados y guías' },
]

function format(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<template>
  <AdminPanel title="Sincronizar con Dropi" icon="fa-solid fa-arrows-rotate">
    <div class="sync">
      <div v-for="k in kinds" :key="k.kind" class="sync__item">
        <div class="sync__head">
          <div>
            <p class="sync__label"><i :class="k.icon"></i> {{ k.label }}</p>
            <p class="sync__hint">{{ k.hint }}</p>
          </div>
          <AdminButton
            variant="soft"
            icon="fa-solid fa-arrows-rotate"
            :loading="syncing === k.kind"
            :disabled="!!syncing"
            @click="emit('sync', k.kind)"
          >
            Sincronizar
          </AdminButton>
        </div>
        <p v-if="typeof results[k.kind] === 'string'" class="sync__error">{{ results[k.kind] }}</p>
        <dl v-else-if="results[k.kind]" class="sync__result">
          <div v-for="(v, key) in results[k.kind] as Record<string, unknown>" :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ format(v) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.sync {
  @include flex-cards(220px, 0.7rem);

  &__item {
    padding: 0.8rem;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;

    i {
      color: $accent;
      margin-right: 0.2rem;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__error {
    margin-top: 0.5rem;
    font-size: $text-xs;
    color: $danger;
  }

  &__result {
    margin-top: 0.5rem;
    font-size: $text-xs;

    div {
      @include flex(row, flex-start, space-between, 0.5rem);
    }

    dt {
      color: $ink-muted;
    }

    dd {
      font-weight: 600;
      word-break: break-all;
      text-align: right;
    }
  }
}
</style>
