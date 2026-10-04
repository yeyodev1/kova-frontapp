<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminToggle from '../AdminToggle.vue'
import type { ProductUpload } from '@/composables/admin/useProductUpload'
import { centsToDollars, formatCents } from '@/utils/money'

const props = defineProps<{ up: ProductUpload }>()
const form = props.up.form

const open = ref(false)

const compare = computed<string>({
  get: () => {
    if (form.compareTouched) return form.compareAt
    return props.up.autoCompare.value ? centsToDollars(props.up.autoCompare.value).toFixed(2) : ''
  },
  set: (value) => {
    // Se guarda el texto tal cual: convertirlo a número borraría el punto mientras escribe "13."
    form.compareTouched = true
    form.compareAt = value
  },
})

const filled = computed(
  () => !!(form.description || form.benefits.some(Boolean) || form.compareTouched || form.isFeatured),
)

function backToAuto() {
  form.compareTouched = false
  form.compareAt = ''
}
</script>

<template>
  <section class="more" :class="{ 'more--open': open }">
    <button type="button" class="more__head" :aria-expanded="open" aria-controls="up-more" @click="open = !open">
      <span>
        Más opciones
        <small v-if="filled && !open">· con cambios</small>
      </span>
      <i class="fa-solid fa-chevron-down"></i>
    </button>

    <div v-show="open" id="up-more" class="more__body">
      <div class="more__field">
        <label for="up-compare">Precio tachado</label>
        <div class="more__money" :class="{ 'more__money--error': up.errors.value.compareAt }">
          <span aria-hidden="true">$</span>
          <input id="up-compare" v-model="compare" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" />
        </div>
        <p v-if="up.errors.value.compareAt" class="more__error">{{ up.errors.value.compareAt }}</p>
        <p v-else-if="!form.compareTouched" class="more__hint">Automático: precio + 40%, a .90. Déjalo en 0 para no mostrar descuento.</p>
        <p v-else class="more__hint">
          <button type="button" class="more__link" @click="backToAuto">
            Usar el automático{{ up.autoCompare.value ? ` (${formatCents(up.autoCompare.value)})` : '' }}
          </button>
        </p>
      </div>

      <div class="more__field">
        <label for="up-desc">Descripción larga</label>
        <textarea id="up-desc" v-model="form.description" rows="5" placeholder="Cómo se usa, medidas, qué trae la caja…"></textarea>
      </div>

      <div class="more__field">
        <span class="more__label">Beneficios</span>
        <div v-for="(_, i) in form.benefits" :key="i" class="more__benefit">
          <input v-model="form.benefits[i]" type="text" maxlength="120" :aria-label="`Beneficio ${i + 1}`" placeholder="Ej. Se carga por USB" />
          <button type="button" :aria-label="`Quitar beneficio ${i + 1}`" @click="form.benefits.splice(i, 1)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <button v-if="form.benefits.length < 8" type="button" class="more__add" @click="form.benefits.push('')">
          <i class="fa-solid fa-plus"></i> Agregar beneficio
        </button>
      </div>

      <div class="more__toggle">
        <AdminToggle v-model="form.isFeatured" label="Destacar en el inicio" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.more {
  border: 1px solid $line;
  border-radius: $radius-md;
  background: $surface;

  &__head {
    width: 100%;
    min-height: 52px;
    padding: 0 1rem;
    @include flex(row, center, space-between, 0.5rem);
    font-weight: 600;
    color: $ink;

    small {
      font-weight: 500;
      color: $accent;
    }

    i {
      color: $ink-muted;
      transition: transform $dur $ease-out;
    }
  }

  &--open &__head i {
    transform: rotate(180deg);
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.1rem);
    padding: 0.2rem 1rem 1.1rem;
  }

  &__field {
    @include flex(column, stretch, flex-start, 0.35rem);

    label {
      margin: 0;
    }
  }

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      pointer-events: none;
    }

    input {
      padding-left: 1.8rem;
    }

    &--error input {
      border-color: $danger;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
  }

  &__link {
    min-height: 44px;
    color: $accent;
    font-weight: 600;
    text-decoration: underline;
  }

  &__benefit {
    @include flex(row, stretch, flex-start, 0.4rem);

    input {
      flex: 1;
      min-width: 0;
    }

    button {
      width: 48px;
      border-radius: $radius-sm;
      color: $danger;
      background: $danger-bg;
    }
  }

  &__add {
    align-self: flex-start;
    min-height: 44px;
    color: $accent;
    font-weight: 600;
    font-size: $text-sm;
  }

  &__toggle {
    min-height: 44px;
    @include flex(row, center, flex-start);
  }

  @include reduced-motion {
    &__head i {
      transition: none;
    }
  }
}
</style>
