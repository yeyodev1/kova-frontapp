<script setup lang="ts">
import { ref } from 'vue'
import AdminButton from './AdminButton.vue'

const props = defineProps<{ paste: (text: string) => string }>()

const text = ref('')
const error = ref('')

function submit() {
  error.value = props.paste(text.value)
  if (!error.value) text.value = ''
}
</script>

<template>
  <details class="paste">
    <summary><i class="fa-solid fa-code"></i> Pegar datos a mano (avanzado)</summary>
    <p class="paste__help">
      Si el favorito no pudo abrir esta ventana, pega aquí el JSON con
      <code>{ "products": [{ "dropiId", "title", "images", "costPrice" }] }</code> (montos en
      centavos).
    </p>
    <label class="paste__field">
      <span class="visually-hidden">JSON de productos</span>
      <textarea
        v-model="text"
        rows="5"
        spellcheck="false"
        placeholder='{ "products": [] }'
      ></textarea>
    </label>
    <p v-if="error" class="paste__error" role="alert">{{ error }}</p>
    <AdminButton icon="fa-solid fa-paste" :disabled="!text.trim()" @click="submit"
      >Cargar</AdminButton
    >
  </details>
</template>

<style scoped lang="scss">
.paste {
  @include flex(column, stretch, flex-start, 0.6rem);
  font-size: $text-sm;

  summary {
    cursor: pointer;
    color: $ink-soft;
    font-weight: 600;
    font-size: $text-xs;
  }

  &[open] {
    @include card;
    padding: 0.9rem;
  }

  &[open] summary {
    margin-bottom: 0.6rem;
  }

  &__help {
    font-size: $text-xs;
    color: $ink-muted;
    margin-bottom: 0.5rem;

    code {
      font-family: $font-mono;
      font-size: 0.7rem;
    }
  }

  &__field {
    margin: 0 0 0.5rem;

    textarea {
      width: 100%;
      font-family: $font-mono;
      font-size: $text-xs;
    }
  }

  &__error {
    color: $danger;
    font-size: $text-xs;
    margin-bottom: 0.5rem;
  }
}
</style>
