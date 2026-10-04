<script setup lang="ts">
import { toRef } from 'vue'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import { useDropiQuickImport } from '@/composables/admin/useDropiQuickImport'

const props = defineProps<{ markup: number; disabled?: boolean }>()

const { reference, importing, error, submit } = useDropiQuickImport(toRef(props, 'markup'))
</script>

<template>
  <AdminPanel title="Importar por ID o link de Dropi" icon="fa-solid fa-link">
    <form class="qi" @submit.prevent="submit">
      <p class="qi__intro">
        Pega el número del producto o el link de su ficha en Dropi. Se guarda como borrador y te
        llevamos al editor.
      </p>
      <fieldset class="qi__row" :disabled="disabled || importing">
        <label class="qi__field">
          <span class="visually-hidden">ID o link del producto en Dropi</span>
          <input
            v-model="reference"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            placeholder="12345 o https://app.dropi.ec/…/12345"
            :aria-invalid="!!error"
            aria-describedby="qi-feedback"
          />
        </label>
        <AdminButton
          type="submit"
          variant="primary"
          icon="fa-solid fa-download"
          :loading="importing"
        >
          {{ importing ? 'Importando…' : 'Importar' }}
        </AdminButton>
      </fieldset>
      <p
        id="qi-feedback"
        class="qi__feedback"
        :class="{ 'qi__feedback--error': error }"
        role="status"
      >
        <template v-if="error"><i class="fa-solid fa-circle-exclamation"></i> {{ error }}</template>
        <template v-else-if="importing">Trayendo fotos, variantes y stock de Dropi…</template>
        <template v-else-if="disabled">Se activa cuando Dropi habilite el acceso.</template>
      </p>
    </form>
  </AdminPanel>
</template>

<style scoped lang="scss">
.qi {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__intro {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;

    &:disabled {
      opacity: 0.6;
    }
  }

  &__field {
    flex: 1 1 14rem;
    margin: 0;
    min-width: 0;

    input {
      font-family: $font-mono;
      font-size: $text-sm;
    }
  }

  &__feedback {
    min-height: 1.1rem;
    font-size: $text-xs;
    color: $ink-muted;

    &--error {
      color: $danger;
    }
  }
}
</style>
