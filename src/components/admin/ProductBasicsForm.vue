<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import { slugify, type ProductForm } from '@/composables/admin/useProductEditor'

const props = defineProps<{ form: ProductForm }>()

// El form es un reactive compartido con el editor: se edita en sitio a propósito.
function regenerateSlug() {
  props.form.slug = slugify(props.form.title)
}
</script>

<template>
  <AdminPanel title="Información" icon="fa-solid fa-pen">
    <div class="fields">
      <div class="fields__item">
        <label for="p-title">Título</label>
        <input id="p-title" v-model="form.title" type="text" maxlength="160" />
      </div>
      <div class="fields__item">
        <label for="p-slug">Slug (URL)</label>
        <div class="fields__inline">
          <input id="p-slug" v-model="form.slug" type="text" autocapitalize="off" />
          <button type="button" class="fields__mini" title="Generar desde el título" @click="regenerateSlug">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </button>
        </div>
        <small>kovashopper.com/producto/{{ form.slug || '…' }}</small>
      </div>
      <div class="fields__item">
        <label for="p-cat">Categoría</label>
        <input id="p-cat" v-model="form.category" type="text" />
      </div>
      <div class="fields__item">
        <label for="p-short">Descripción corta</label>
        <textarea id="p-short" v-model="form.shortDescription" rows="2" maxlength="280"></textarea>
      </div>
      <div class="fields__item">
        <label for="p-desc">Descripción (HTML)</label>
        <textarea id="p-desc" v-model="form.description" rows="8" class="fields__code"></textarea>
      </div>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.fields {
  @include flex(column, stretch, flex-start, 0.9rem);

  small {
    font-size: $text-xs;
    color: $ink-muted;
    word-break: break-all;
  }

  &__inline {
    @include flex(row, stretch, flex-start, 0.4rem);
  }

  &__mini {
    flex-shrink: 0;
    width: 2.8rem;
    border-radius: $radius-sm;
    border: 1px solid $line;
    color: $accent;
  }

  &__code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.82rem;
    resize: vertical;
  }
}
</style>
