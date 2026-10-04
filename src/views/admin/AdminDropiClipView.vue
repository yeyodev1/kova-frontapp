<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import DropiClipItem from '@/components/admin/DropiClipItem.vue'
import DropiClipSteps from '@/components/admin/DropiClipSteps.vue'
import DropiClipToolbar from '@/components/admin/DropiClipToolbar.vue'
import DropiClipPaste from '@/components/admin/DropiClipPaste.vue'
import { useDropiClip } from '@/composables/admin/useDropiClip'

const {
  items,
  markup,
  importing,
  source,
  selected,
  blocked,
  done,
  salePrice,
  paste,
  selectAll,
  remove,
  importSelected,
} = useDropiClip()
</script>

<template>
  <div class="clip">
    <AdminPageHead
      title="Traer de Dropi"
      subtitle="Elige qué productos importar, ponles costo y guárdalos como borrador"
      back="/admin/dropi"
    />

    <template v-if="items.length">
      <p class="clip__source">
        <i class="fa-solid fa-link"></i>
        {{ source.pageType === 'detail' ? 'Ficha de producto' : 'Página de Dropi' }}
        <a
          v-if="source.url.startsWith('https://')"
          :href="source.url"
          target="_blank"
          rel="noopener"
        >
          abrir en Dropi
        </a>
        <span v-if="done.length" class="clip__done">· {{ done.length }} ya guardados</span>
      </p>

      <DropiClipToolbar
        v-model:markup="markup"
        :total="items.length"
        :selected="selected.length"
        :blocked="blocked.length"
        :importing="importing"
        @all="selectAll"
        @import="importSelected"
      />

      <p class="clip__note">
        Con costo, la venta es el sugerido si deja margen; si no, costo + {{ markup || 0 }}% a .90.
        Los que ya existen solo actualizan costo, stock y fotos: no se pisa tu precio ni tus textos.
      </p>

      <div class="clip__grid">
        <DropiClipItem
          v-for="item in items"
          :key="item.key"
          :item="item"
          :sale="salePrice(item)"
          @remove="remove(item.key)"
        />
      </div>
    </template>

    <AdminPanel v-else title="Esperando productos de Dropi" icon="fa-solid fa-satellite-dish">
      <div class="clip__empty">
        <p class="clip__lead">
          Esta ventana recibe lo que mandes con el favorito <strong>Enviar a Kova</strong>. Déjala
          abierta y sigue estos pasos:
        </p>
        <DropiClipSteps />
        <p class="clip__lead">
          Dropi carga más productos al bajar: baja hasta ver todos los que quieras antes de tocar el
          favorito. Se envían hasta 60 por vez.
        </p>
        <AdminButton to="/admin/dropi" icon="fa-solid fa-bookmark">Conseguir el botón</AdminButton>
      </div>
    </AdminPanel>

    <DropiClipPaste :paste="paste" />
  </div>
</template>

<style scoped lang="scss">
.clip {
  @include flex(column, stretch, flex-start, 1rem);

  &__source {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-muted;

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__done {
    color: $success;
    font-weight: 600;
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.5;
  }

  &__grid {
    @include flex-cards(260px, 0.8rem);

    > * {
      @include from('lg') {
        max-width: calc(33.333% - 0.55rem);
      }
    }
  }

  &__empty {
    @include flex(column, flex-start, flex-start, 0.9rem);
  }

  &__lead {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
    max-width: 65ch;
  }
}
</style>
