<script setup lang="ts">
import { computed, ref } from 'vue'
import DropiClipPricing from './DropiClipPricing.vue'
import { idError, titleError, type ClipDraft } from '@/composables/admin/useDropiClip'

const props = defineProps<{ item: ClipDraft; sale: number }>()
const emit = defineEmits<{ remove: [] }>()

const broken = ref(false)
const image = computed(() => (broken.value ? '' : props.item.images[0] || ''))
const idMsg = computed(() => idError(props.item))
const titleMsg = computed(() => titleError(props.item))
const uid = computed(() => props.item.key)
</script>

<template>
  <article
    class="ci"
    :class="{ 'ci--off': !item.selected, 'ci--warn': item.selected && (idMsg || titleMsg) }"
  >
    <header class="ci__top">
      <label class="ci__check">
        <input v-model="item.selected" type="checkbox" />
        <span>{{ item.selected ? 'Importar' : 'No importar' }}</span>
      </label>
      <RouterLink
        v-if="item.linked"
        :to="`/admin/productos/${item.linked.productId}`"
        class="ci__chip ci__chip--ok"
      >
        <i class="fa-solid fa-check"></i> Ya importado
      </RouterLink>
      <button
        type="button"
        class="ci__remove"
        aria-label="Quitar de la lista"
        @click="emit('remove')"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </header>

    <div class="ci__media">
      <img v-if="image" :src="image" :alt="item.title" loading="lazy" @error="broken = true" />
      <i v-else class="fa-regular fa-image"></i>
      <span v-if="item.images.length > 1" class="ci__count">{{ item.images.length }} fotos</span>
    </div>

    <div class="ci__body">
      <p v-if="item.category || item.supplier" class="ci__meta">
        {{ [item.category, item.supplier].filter(Boolean).join(' · ') }}
      </p>
      <label class="ci__field">
        <span>Nombre</span>
        <input v-model="item.title" type="text" maxlength="200" :aria-invalid="!!titleMsg" />
      </label>
      <label class="ci__field">
        <span>ID de Dropi</span>
        <input
          v-model="item.dropiId"
          class="ci__mono"
          type="text"
          inputmode="numeric"
          placeholder="Ej. 139710"
          :aria-invalid="!!idMsg"
          :aria-describedby="idMsg ? `${uid}-id` : undefined"
        />
      </label>
      <p v-if="idMsg" :id="`${uid}-id`" class="ci__error">
        <i class="fa-solid fa-circle-exclamation"></i> {{ idMsg }}: búscalo en la ficha del producto
        en Dropi
      </p>

      <DropiClipPricing :item="item" :sale="sale" />

      <p
        v-if="item.result"
        class="ci__result"
        :class="`ci__result--${item.result.status}`"
        role="status"
      >
        <template v-if="item.result.status === 'error'">
          <i class="fa-solid fa-triangle-exclamation"></i>
          {{ item.result.message || 'No se pudo importar' }}
        </template>
        <template v-else>
          <i class="fa-solid fa-circle-check"></i>
          {{ item.result.status === 'created' ? 'Creado como borrador' : 'Actualizado' }}
          <RouterLink v-if="item.result.productId" :to="`/admin/productos/${item.result.productId}`"
            >Editar</RouterLink
          >
        </template>
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.ci {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: hidden;
  @include transition(opacity);

  &--off {
    opacity: 0.6;
  }

  &--warn {
    border-color: rgba($warning, 0.7);
  }

  &__top {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.55rem 0.7rem;
    border-bottom: 1px solid $line;
  }

  &__check {
    @include flex(row, center, flex-start, 0.45rem);
    margin: 0;
    font-size: $text-xs;
    font-weight: 600;
    flex: 1;
    cursor: pointer;

    input {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: $accent;
    }
  }

  &__chip {
    font-size: 0.66rem;
    font-weight: 700;
    padding: 0.22rem 0.55rem;
    border-radius: $radius-pill;

    &--ok {
      background: $success-bg;
      color: $success;
    }
  }

  &__remove {
    @include tap-target;
    color: $ink-muted;
    padding: 0.2rem 0.35rem;

    &:hover {
      color: $danger;
    }
  }

  &__media {
    @include plinth(0);
    @include flex(row, center, center);
    aspect-ratio: 4 / 3;
    color: $alu-dark;
    font-size: 1.6rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.6rem;
    }
  }

  &__count {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    font-family: $font-mono;
    font-size: 0.62rem;
    padding: 0.18rem 0.45rem;
    border-radius: $radius-pill;
    background: rgba($surface, 0.9);
    color: $ink-soft;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.55rem);
    padding: 0.8rem;
  }

  &__meta {
    @include eyebrow;
    font-size: 0.62rem;
  }

  &__field {
    @include flex(column, stretch, flex-start, 0.25rem);
    margin: 0;
    flex: 1 1 6rem;
    min-width: 0;

    span {
      font-size: $text-xs;
      color: $ink-soft;
    }

    input {
      min-width: 0;
    }
  }

  &__mono {
    font-family: $font-mono;
  }

  &__error {
    font-size: $text-xs;
    line-height: 1.4;
    color: $danger;
  }

  &__result {
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.45rem 0.6rem;
    border-radius: $radius-sm;

    a {
      margin-left: 0.3rem;
      text-decoration: underline;
    }

    &--created,
    &--updated {
      background: $success-bg;
      color: $success;
    }

    &--error {
      background: $danger-bg;
      color: $danger;
    }
  }
}
</style>
