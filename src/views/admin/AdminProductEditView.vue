<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import AdminToggle from '@/components/admin/AdminToggle.vue'
import AdminListEditor from '@/components/admin/AdminListEditor.vue'
import ProductBasicsForm from '@/components/admin/ProductBasicsForm.vue'
import ProductPricingForm from '@/components/admin/ProductPricingForm.vue'
import ProductOffersEditor from '@/components/admin/ProductOffersEditor.vue'
import ProductFaqsEditor from '@/components/admin/ProductFaqsEditor.vue'
import ProductImagesEditor from '@/components/admin/ProductImagesEditor.vue'
import { useProductEditor } from '@/composables/admin/useProductEditor'
import { formatDateTime } from '@/composables/admin/format'

const { product, form, loading, loadError, saving, uploading, errors, cost, margin, belowCost, load, save, uploadImage } =
  useProductEditor()
</script>

<template>
  <div class="edit">
    <AdminSkeleton v-if="loading" :rows="5" height="9rem" />

    <AdminEmpty v-else-if="loadError || !product" icon="fa-solid fa-box-open" title="No se pudo cargar" :text="loadError">
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
      <AdminButton to="/admin/productos">Volver</AdminButton>
    </AdminEmpty>

    <form v-else class="edit__form" @submit.prevent="save">
      <AdminPageHead
        :title="form.title || 'Producto'"
        :subtitle="product.dropiId ? `Dropi #${product.dropiId}${product.lastSyncedAt ? ' · sincronizado ' + formatDateTime(product.lastSyncedAt) : ''}` : undefined"
        back="/admin/productos"
      >
        <AdminButton v-if="product.isPublished" :href="`/producto/${product.slug}`" icon="fa-solid fa-arrow-up-right-from-square">
          Ver en tienda
        </AdminButton>
      </AdminPageHead>

      <div class="edit__cols">
        <div class="edit__col edit__col--main">
          <ProductBasicsForm :form="form" />
          <ProductImagesEditor :images="form.images" :uploading="uploading" @upload="uploadImage" />
          <AdminListEditor :items="form.benefits" title="Beneficios" icon="fa-solid fa-check" placeholder="Carga en 2 horas" />
          <ProductFaqsEditor :faqs="form.faqs" />
        </div>
        <div class="edit__col">
          <AdminPanel title="Visibilidad" icon="fa-regular fa-eye">
            <div class="edit__toggles">
              <AdminToggle v-model="form.isPublished" label="Publicado en la tienda" />
              <AdminToggle v-model="form.isFeatured" label="Destacado en el inicio" />
            </div>
          </AdminPanel>
          <ProductPricingForm
            :form="form"
            :cost="cost"
            :suggested="product.suggestedPrice"
            :margin="margin"
            :below-cost="belowCost"
          />
          <ProductOffersEditor :offers="form.offers" :base-price="form.price" />
        </div>
      </div>

      <ul v-if="errors.length" class="edit__errors" role="alert">
        <li v-for="e in errors" :key="e"><i class="fa-solid fa-circle-exclamation"></i> {{ e }}</li>
      </ul>

      <div class="edit__bar">
        <p v-if="belowCost" class="edit__warn"><i class="fa-solid fa-triangle-exclamation"></i> Precio bajo el costo</p>
        <AdminButton type="submit" variant="primary" icon="fa-solid fa-floppy-disk" :loading="saving">
          Guardar cambios
        </AdminButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.edit {
  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1 1 0;
    min-width: 0;

    &--main {
      @include from('lg') {
        flex: 1.5 1 0;
      }
    }
  }

  &__toggles {
    @include flex(column, flex-start, flex-start, 0.7rem);
  }

  &__errors {
    list-style: none;
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
    @include flex(column, stretch, flex-start, 0.3rem);
  }

  // Barra fija para guardar sin bajar hasta el final; en móvil queda sobre la nav inferior.
  &__bar {
    position: sticky;
    bottom: calc(62px + env(safe-area-inset-bottom) + 0.5rem);
    z-index: 20;
    @include flex(row, center, flex-end, 0.8rem);
    margin-top: 1rem;
    padding: 0.6rem 0.8rem;
    border-radius: $radius-md;
    background: rgba($surface, 0.96);
    border: 1px solid $line;
    box-shadow: $shadow-md;

    @include from('md') {
      bottom: 1rem;
    }
  }

  &__warn {
    margin-right: auto;
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }
}
</style>
