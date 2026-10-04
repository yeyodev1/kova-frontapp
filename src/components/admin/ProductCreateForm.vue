<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminButton from './AdminButton.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/composables/admin/format'
import { dollarsToCents } from '@/utils/money'

const open = defineModel<boolean>('open', { default: false })

const router = useRouter()
const toast = useToastStore()
const title = ref('')
const price = ref<number | null>(null)
const dropiId = ref('')
const creating = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

watch(open, async (value) => {
  if (!value) return
  await nextTick()
  titleInput.value?.focus()
})

// Se crea como borrador y se abre el editor: ahí se completan fotos, textos y ofertas.
async function create() {
  if (!title.value.trim()) {
    toast.error('Ponle un título al producto')
    return
  }
  creating.value = true
  try {
    const product = await adminService.createProduct({
      title: title.value.trim(),
      price: price.value ? dollarsToCents(price.value) : undefined,
      dropiId: /^\d+$/.test(dropiId.value.trim()) ? Number(dropiId.value.trim()) : undefined,
    })
    toast.success('Producto creado como borrador')
    router.push(`/admin/productos/${product._id}`)
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo crear el producto'))
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <Transition name="sheet">
    <form v-if="open" class="create" @submit.prevent="create">
      <header class="create__head">
        <p class="create__eyebrow">Producto manual</p>
        <button type="button" class="create__close" aria-label="Cerrar" @click="open = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>
      <div class="create__fields">
        <div class="create__field create__field--wide">
          <label for="c-title">Título</label>
          <input id="c-title" ref="titleInput" v-model="title" type="text" maxlength="160" placeholder="Ej. Aspiradora para carro" />
        </div>
        <div class="create__field">
          <label for="c-price">Precio ($)</label>
          <input id="c-price" v-model.number="price" type="number" min="0" step="0.01" inputmode="decimal" placeholder="24.90" />
        </div>
        <div class="create__field">
          <label for="c-dropi">ID de Dropi</label>
          <input id="c-dropi" v-model="dropiId" type="text" inputmode="numeric" placeholder="Opcional" />
        </div>
      </div>
      <p class="create__hint">Queda como borrador. El ID de Dropi lo ves en la ficha del producto en Dropi.</p>
      <AdminButton type="submit" variant="primary" icon="fa-solid fa-arrow-right" :loading="creating" block>
        Crear y editar
      </AdminButton>
    </form>
  </Transition>
</template>

<style scoped lang="scss">
.create {
  @include alu-border(18px);
  @include flex(column, stretch, flex-start, 0.8rem);
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 1.2rem 1.4rem;
  }

  &__head {
    @include flex(row, center, space-between);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__close {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: $paper;
    }
  }

  &__fields {
    @include flex-cards(140px, 0.7rem);
  }

  &__field {
    @include flex(column, stretch, flex-start);

    &--wide {
      flex-basis: 100% !important;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity $dur $ease-out,
    transform $dur $ease-out;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
