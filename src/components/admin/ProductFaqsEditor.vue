<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import type { Faq } from '@/types'

defineProps<{ faqs: Faq[] }>()
</script>

<template>
  <AdminPanel title="Preguntas frecuentes" icon="fa-solid fa-circle-question">
    <template #actions>
      <AdminButton variant="soft" icon="fa-solid fa-plus" @click="faqs.push({ question: '', answer: '' })">
        Agregar
      </AdminButton>
    </template>
    <p v-if="!faqs.length" class="faqs__empty">Sin preguntas. Las dudas típicas (envío, garantía, uso) ayudan a cerrar la venta.</p>
    <div v-for="(f, i) in faqs" :key="i" class="faqs__item">
      <div class="faqs__head">
        <label :for="`faq-q-${i}`">Pregunta {{ i + 1 }}</label>
        <button type="button" class="faqs__del" aria-label="Quitar pregunta" @click="faqs.splice(i, 1)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <input :id="`faq-q-${i}`" v-model="f.question" type="text" />
      <label :for="`faq-a-${i}`" class="faqs__a">Respuesta</label>
      <textarea :id="`faq-a-${i}`" v-model="f.answer" rows="2"></textarea>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.faqs {
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__item {
    padding: 0.8rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    margin-bottom: 0.6rem;
  }

  &__head {
    @include flex(row, center, space-between);

    label {
      margin: 0;
    }
  }

  &__a {
    margin-top: 0.5rem;
  }

  &__del {
    width: 2.2rem;
    height: 2.2rem;
    color: $danger;
  }
}
</style>
