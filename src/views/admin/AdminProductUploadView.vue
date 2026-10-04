<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import ProductCardPreview from '@/components/admin/ProductCardPreview.vue'
import UploadPhotos from '@/components/admin/upload/UploadPhotos.vue'
import UploadPricing from '@/components/admin/upload/UploadPricing.vue'
import UploadCategory from '@/components/admin/upload/UploadCategory.vue'
import UploadMore from '@/components/admin/upload/UploadMore.vue'
import UploadBar from '@/components/admin/upload/UploadBar.vue'
import UploadDone from '@/components/admin/upload/UploadDone.vue'
import { useProductUpload } from '@/composables/admin/useProductUpload'
import type { ProductForm } from '@/composables/admin/useProductEditor'
import { centsToDollars } from '@/utils/money'

const up = useProductUpload()
const { form, photos, errors } = up

// La tarjeta de la tienda se reutiliza tal cual: se le arma el formulario que espera.
const preview = computed<ProductForm>(() => ({
  title: form.title,
  slug: '',
  shortDescription: form.shortDescription,
  description: '',
  category: form.category,
  price: centsToDollars(up.priceCents.value),
  compareAtPrice: centsToDollars(up.compareCents.value),
  stock: form.stock,
  variants: [],
  offers: [],
  benefits: [],
  faqs: [],
  // Una foto que falló no se guarda: la portada real es la primera que sí subió o está subiendo.
  images: photos.photos.value.filter((p) => p.status !== 'error').map((p) => p.preview),
  isPublished: true,
  isFeatured: form.isFeatured,
  dropiId: '',
  costPrice: 0,
}))

const status = computed(() => {
  if (photos.failed.value) return `${photos.failed.value} foto(s) sin subir: toca "Reintentar" o quítala`
  const missing = [
    !photos.urls.value.length && 'foto',
    !form.title.trim() && 'nombre',
    !up.priceCents.value && 'precio',
  ].filter(Boolean)
  return missing.length ? `Para publicar falta: ${missing.join(', ')}` : 'Listo para publicar'
})

async function send(publish: boolean) {
  const ok = await up.submit(publish)
  if (ok === false && Object.keys(errors.value).length) {
    const first = document.querySelector('.upload [data-invalid="true"]')
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function again() {
  up.reset()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="upload">
    <AdminPageHead title="Subir producto" subtitle="Fotos, nombre y costo. El resto es opcional." back="/admin/productos" />

    <div v-if="up.restored.value" class="upload__restored" role="status">
      <i class="fa-solid fa-clock-rotate-left"></i>
      <span>Recuperamos lo que estabas escribiendo.</span>
      <button type="button" @click="up.discardDraft">Descartar</button>
    </div>

    <form class="upload__cols" novalidate @submit.prevent="send(true)">
      <div class="upload__main">
        <div class="upload__card" :data-invalid="!!errors.photos">
          <UploadPhotos :photos="photos" :error="errors.photos" />
        </div>

        <div class="upload__card">
          <div class="upload__field" :data-invalid="!!errors.title">
            <label for="up-title">Nombre</label>
            <input
              id="up-title"
              v-model="form.title"
              type="text"
              maxlength="160"
              placeholder="Ej. Aspiradora inalámbrica para carro"
              autocomplete="off"
              enterkeyhint="next"
              :class="{ 'upload__input--error': errors.title }"
            />
            <p v-if="errors.title" class="upload__error" role="alert">{{ errors.title }}</p>
          </div>

          <div :data-invalid="!!errors.price">
            <UploadPricing :up="up" />
          </div>
        </div>

        <div class="upload__card">
          <UploadCategory v-model="form.category" :categories="up.categories.value" />

          <div class="upload__field" :data-invalid="!!errors.dropi">
            <label for="up-dropi">Link o ID de Dropi <span class="upload__opt">opcional</span></label>
            <input
              id="up-dropi"
              v-model="form.dropi"
              type="text"
              inputmode="url"
              autocomplete="off"
              placeholder="Pega el link del producto en Dropi"
            />
            <p v-if="errors.dropi" class="upload__error" role="alert">{{ errors.dropi }}</p>
            <p v-else-if="up.dropiId.value" class="upload__ok">
              <i class="fa-solid fa-link"></i> ID {{ up.dropiId.value }}: los pedidos pasarán a Dropi
            </p>
            <p v-else class="upload__hint">Para pasar los pedidos a Dropi.</p>
          </div>

          <div class="upload__field">
            <label for="up-short">Descripción corta <span class="upload__opt">opcional</span></label>
            <textarea
              id="up-short"
              v-model="form.shortDescription"
              rows="2"
              maxlength="300"
              placeholder="Una o dos líneas: para qué sirve y por qué lo quieren"
            ></textarea>
          </div>
        </div>

        <UploadMore :up="up" />
      </div>

      <aside class="upload__side">
        <ProductCardPreview :form="preview" :stock="form.stock" />
      </aside>

      <UploadBar
        class="upload__bar"
        :saving="up.saving.value"
        :uploading="photos.uploading.value"
        :status="status"
        @publish="send(true)"
        @draft="send(false)"
      />
    </form>

    <UploadDone :product="up.created.value" @again="again" />
  </div>
</template>

<style scoped lang="scss">
.upload {
  max-width: 980px;

  &__restored {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.4rem 0.4rem 0.4rem 0.9rem;
    margin-bottom: 0.9rem;
    border-radius: $radius-sm;
    background: $info-bg;
    font-size: $text-sm;
    color: $ink-soft;

    span {
      flex: 1;
    }

    button {
      min-height: 44px;
      padding: 0 0.8rem;
      font-weight: 600;
      color: $danger;
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1rem);
    min-width: 0;

    @include from('lg') {
      flex: 1 1 0;
    }
  }

  &__side {
    @include from('lg') {
      flex: 0 0 280px;
      position: sticky;
      top: 1rem;
    }
  }

  &__bar {
    @include from('lg') {
      flex: 1 0 100%;
    }
  }

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1.1rem);
    border-radius: $radius-md;
    box-shadow: $shadow-sm;
    padding: 1rem;

    @include from('md') {
      padding: 1.3rem;
    }
  }

  &__field {
    @include flex(column, stretch, flex-start, 0.35rem);

    label {
      margin: 0;
    }
  }

  &__input--error {
    border-color: $danger !important;
  }

  &__opt {
    font-weight: 400;
    color: $ink-muted;
    font-size: $text-xs;
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    font-weight: 500;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__ok {
    font-size: $text-xs;
    color: $success;
    font-weight: 600;
  }
}
</style>
