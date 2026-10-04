<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import { ref } from 'vue'
import { fixSlug, slugify, type ProductForm } from '@/composables/admin/useProductEditor'

const props = defineProps<{ form: ProductForm }>()
const editingLink = ref(false)

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
        <span class="fields__label">Link en la tienda</span>
        <p class="fields__link">
          <i class="fa-solid fa-link"></i>
          <span>kovashopper.com/producto/<strong>{{ form.slug || '…' }}</strong></span>
          <button type="button" class="fields__text-btn" @click="editingLink = !editingLink">
            {{ editingLink ? 'Listo' : 'Cambiar' }}
          </button>
        </p>
        <div v-if="editingLink" class="fields__inline">
          <input id="p-slug" v-model="form.slug" type="text" autocapitalize="off" aria-label="Link en la tienda" @blur="fixSlug(form)" />
          <button type="button" class="fields__mini" title="Generar desde el título" @click="regenerateSlug">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </button>
        </div>
        <small v-if="editingLink">Se arma solo con el nombre. El link de Dropi va en "Enlace con Dropi", no aquí.</small>
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
        <label for="p-desc">Descripción larga</label>
        <textarea id="p-desc" v-model="form.description" rows="8" placeholder="Cuenta qué es, para qué sirve y qué incluye. Los saltos de línea se respetan."></textarea>
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
.fields__label {
  font-size: 0.82rem;
  font-weight: 500;
  color: $ink-soft;
}

.fields__link {
  @include flex(row, center, flex-start, 0.5rem);
  flex-wrap: wrap;
  font-size: $text-sm;
  color: $ink-soft;
  background: $sand;
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  word-break: break-all;

  i {
    color: $accent;
  }

  strong {
    color: $ink;
  }
}

.fields__text-btn {
  margin-left: auto;
  font-weight: 600;
  color: $accent;
  text-decoration: underline;
  @include tap-target;
}
</style>
