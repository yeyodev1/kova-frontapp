<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

const props = defineProps<{ categories: string[] }>()
const model = defineModel<string>({ required: true })

const adding = ref(false)
const draft = ref('')
const field = ref<HTMLInputElement | null>(null)

// La recién escrita aparece como chip aunque aún no exista en la tienda.
const options = computed(() => {
  const list = [...props.categories]
  if (model.value && !list.includes(model.value)) list.unshift(model.value)
  return list
})

function pick(name: string) {
  model.value = model.value === name ? '' : name
}

async function startNew() {
  adding.value = true
  draft.value = ''
  await nextTick()
  field.value?.focus()
}

function confirmNew() {
  const name = draft.value.trim().replace(/\s+/g, ' ')
  if (name) {
    const existing = props.categories.find((c) => c.toLowerCase() === name.toLowerCase())
    model.value = existing || name.charAt(0).toUpperCase() + name.slice(1)
  }
  adding.value = false
}
</script>

<template>
  <fieldset class="cat">
    <legend class="cat__label">Categoría</legend>
    <div class="cat__chips">
      <button
        v-for="c in options"
        :key="c"
        type="button"
        class="cat__chip"
        :class="{ 'cat__chip--on': model === c }"
        :aria-pressed="model === c"
        @click="pick(c)"
      >
        <i v-if="model === c" class="fa-solid fa-check"></i>
        {{ c }}
      </button>
      <button v-if="!adding" type="button" class="cat__chip cat__chip--new" @click="startNew">
        <i class="fa-solid fa-plus"></i> Nueva
      </button>
    </div>
    <div v-if="adding" class="cat__new">
      <label for="up-cat" class="visually-hidden">Nueva categoría</label>
      <input
        id="up-cat"
        ref="field"
        v-model="draft"
        type="text"
        maxlength="80"
        placeholder="Ej. Cocina"
        enterkeyhint="done"
        @keydown.enter.prevent="confirmNew"
      />
      <button type="button" class="cat__ok" @click="confirmNew">Listo</button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.cat {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
    margin-bottom: 0.45rem;
    padding: 0;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, center, 0.35rem);
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: 0.9rem;
    font-weight: 500;
    color: $ink-soft;
    transition:
      background-color $dur-fast $ease-out,
      border-color $dur-fast $ease-out;
    -webkit-tap-highlight-color: transparent;

    &--on {
      background: $accent-deep;
      border-color: $accent-deep;
      color: $surface;

      i {
        animation: pop 0.4s $ease-spring;
      }
    }

    &--new {
      border-style: dashed;
      color: $accent;
      font-weight: 600;
    }
  }

  &__new {
    @include flex(row, stretch, flex-start, 0.5rem);
    margin-top: 0.55rem;

    input {
      flex: 1;
      min-width: 0;
    }
  }

  &__ok {
    min-width: 80px;
    min-height: 44px;
    border-radius: $radius-sm;
    background: $accent;
    color: $surface;
    font-weight: 600;
  }
}
</style>
