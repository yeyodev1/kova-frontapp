<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from './AdminButton.vue'
import { useDropiStatus } from '@/composables/admin/useDropiStatus'
import { formatDateTime } from '@/composables/admin/format'

const emit = defineEmits<{ retry: [] }>()

const { status, checking, checkError, connected, supportMessage, copy } = useDropiStatus()

const tone = computed(() => {
  if (!status.value) return checkError.value ? 'warn' : 'idle'
  return connected.value ? 'ok' : 'warn'
})

const title = computed(() => {
  if (!status.value)
    return checkError.value ? 'No pudimos revisar Dropi' : 'Revisando la conexión con Dropi'
  if (connected.value) return 'Conectado a Dropi'
  if (!status.value.configured) return 'Falta la llave de Dropi'
  return 'Dropi aún no habilita el acceso'
})
</script>

<template>
  <section class="ds" :class="`ds--${tone}`" aria-live="polite">
    <div class="ds__head">
      <span class="ds__icon">
        <i v-if="tone === 'idle'" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else-if="tone === 'ok'" class="fa-solid fa-plug-circle-check"></i>
        <i v-else class="fa-solid fa-plug-circle-exclamation"></i>
      </span>
      <div class="ds__titles">
        <h2 class="ds__title">{{ title }}</h2>
        <p v-if="status" class="ds__checked">Revisado {{ formatDateTime(status.checkedAt) }}</p>
      </div>
      <AdminButton
        v-if="tone !== 'idle'"
        variant="ghost"
        icon="fa-solid fa-rotate-right"
        :loading="checking"
        class="ds__retry"
        @click="emit('retry')"
      >
        Probar de nuevo
      </AdminButton>
    </div>

    <p v-if="checkError && !status" class="ds__text">{{ checkError }}</p>
    <p v-else-if="status && connected" class="ds__text">
      El buscador y la importación están activos. El stock y el costo se actualizan solos cada 6
      horas.
    </p>

    <template v-else-if="status">
      <p class="ds__text">{{ status.message }}</p>

      <div v-if="status.blockedIp" class="ds__ip">
        <span class="ds__label">IP bloqueada</span>
        <code class="ds__ipval">{{ status.blockedIp }}</code>
        <button type="button" class="ds__copy" @click="copy(status.blockedIp!, 'IP')">
          <i class="fa-regular fa-copy"></i> Copiar
        </button>
      </div>

      <div v-if="status.configured && supportMessage" class="ds__msg">
        <div class="ds__msghead">
          <span class="ds__label">Mensaje para soporte de Dropi</span>
          <button type="button" class="ds__copy" @click="copy(supportMessage!, 'Mensaje')">
            <i class="fa-regular fa-copy"></i> Copiar mensaje
          </button>
        </div>
        <p class="ds__msgtext">{{ supportMessage }}</p>
        <p class="ds__hint">
          Envíalo por el chat de app.dropi.ec. Cuando lo habiliten, toca «Probar de nuevo» y todo se
          activa.
        </p>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.ds {
  @include card;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  padding: 1rem;
  border-left: 4px solid $line;
  @include flex(column, stretch, flex-start, 0.8rem);

  @include from('md') {
    padding: 1.2rem 1.4rem;
  }

  &--ok {
    border-left-color: $success;
  }

  &--warn {
    border-left-color: $warning;
  }

  &__head {
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 12px;
    background: $paper;
    color: $ink-muted;

    .ds--ok & {
      background: $success-bg;
      color: $success;
    }

    .ds--warn & {
      background: $warning-bg;
      color: darken($warning, 18%);
    }
  }

  &__titles {
    flex: 1 1 0;
    min-width: 10rem;
  }

  &__title {
    @include display(1.05rem, 750, 110%);
  }

  &__checked {
    font-family: $font-mono;
    font-size: 0.68rem;
    color: $ink-muted;
    margin-top: 0.15rem;
  }

  &__retry {
    flex: 1 1 100%;

    @include from('md') {
      flex: 0 0 auto;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__label {
    @include eyebrow;
  }

  &__ip {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    padding: 0.7rem 0.8rem;
    border-radius: $radius-sm;
    background: $warning-bg;
  }

  &__ipval {
    font-family: $font-mono;
    font-size: 1.05rem;
    font-weight: 700;
    color: $ink;
    letter-spacing: 0.02em;
  }

  &__copy {
    @include flex(row, center, center, 0.35rem);
    margin-left: auto;
    min-height: 2.2rem;
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    cursor: pointer;
    @include transition(border-color);

    &:hover {
      border-color: $accent;
    }
  }

  &__msg {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__msghead {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__msgtext {
    white-space: pre-line;
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $paper;
    border: 1px dashed $line;
    font-size: $text-sm;
    line-height: 1.55;
    user-select: all;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
