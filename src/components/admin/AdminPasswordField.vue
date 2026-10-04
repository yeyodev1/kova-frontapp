<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  id: string
  label: string
  autocomplete: string
  error?: string
  valid?: boolean
}>()

const model = defineModel<string>({ required: true })
const visible = ref(false)
</script>

<template>
  <div class="pfield" :class="{ 'pfield--invalid': error, 'pfield--valid': valid && !error }">
    <label :for="id" class="pfield__label">{{ label }}</label>
    <div class="pfield__box">
      <input
        :id="id"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : undefined"
        autocapitalize="off"
        spellcheck="false"
      />
      <i v-if="valid && !error" class="fa-solid fa-check pfield__ok" aria-hidden="true"></i>
      <button
        type="button"
        class="pfield__eye"
        :aria-label="visible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        :aria-pressed="visible"
        @click="visible = !visible"
      >
        <i :class="visible ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
      </button>
    </div>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="pfield__error" role="status">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.pfield {
  @include flex(column, stretch, flex-start, 0.35rem);
  min-width: 0;
  text-align: left;

  &__label {
    margin-bottom: 0;
    font-size: $text-sm;
    font-weight: 600;
  }

  &__box {
    position: relative;

    input {
      width: 100%;
      min-height: 3rem;
      padding-right: 4.6rem;
    }
  }

  &__ok {
    position: absolute;
    right: 3rem;
    top: 50%;
    transform: translateY(-50%);
    color: $success;
    font-size: 0.85rem;
  }

  &__eye {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      color: $ink;
    }
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
  }

  &--invalid input {
    border-color: $danger;
  }
}
</style>
