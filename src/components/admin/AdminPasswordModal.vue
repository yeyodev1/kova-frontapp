<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { MIN_PASSWORD, usePasswordChange } from '@/composables/admin/usePasswordChange'
import AdminPasswordField from './AdminPasswordField.vue'
import AdminButton from './AdminButton.vue'

const pw = usePasswordChange()
const { open, form, done, error, strength, nextError, confirmError, canSubmit, saving } = pw

useBodyScroll(open)

// El foco entra al primer campo: con teclado no hay que buscar dónde empezar.
watch(open, async (value) => {
  if (!value) return
  await nextTick()
  document.getElementById('pw-current')?.focus()
})

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') pw.close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pwm">
      <div v-if="open" class="pwm" @click.self="pw.close" @keydown="onKey">
        <div class="pwm__box" role="dialog" aria-modal="true" aria-labelledby="pwm-title">
          <button type="button" class="pwm__close" aria-label="Cerrar" @click="pw.close">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div v-if="done" class="pwm__done" role="status">
            <span class="pwm__icon pwm__icon--ok"><i class="fa-solid fa-check"></i></span>
            <h2 id="pwm-title" class="pwm__title">Contraseña actualizada</h2>
            <p class="pwm__lead">La próxima vez que entres al panel usa la nueva.</p>
            <AdminButton variant="primary" block @click="pw.close">Listo</AdminButton>
          </div>

          <form v-else class="pwm__form" novalidate @submit.prevent="pw.submit">
            <span class="pwm__icon"><i class="fa-solid fa-key"></i></span>
            <h2 id="pwm-title" class="pwm__title">Cambiar contraseña</h2>
            <p class="pwm__lead">
              Mínimo {{ MIN_PASSWORD }} caracteres. Una frase corta es fácil de recordar y difícil
              de adivinar.
            </p>

            <AdminPasswordField
              id="pw-current"
              v-model="form.current"
              label="Contraseña actual"
              autocomplete="current-password"
            />
            <AdminPasswordField
              id="pw-next"
              v-model="form.next"
              label="Nueva contraseña"
              autocomplete="new-password"
              :error="nextError"
              :valid="Boolean(form.next) && !nextError"
            >
              <div v-if="form.next" class="pwm__meter" :class="`pwm__meter--${strength.score}`">
                <span class="pwm__bars" aria-hidden="true">
                  <span
                    v-for="n in 4"
                    :key="n"
                    class="pwm__bar"
                    :class="{ 'pwm__bar--on': n <= strength.score }"
                  ></span>
                </span>
                <span class="pwm__strength">{{ strength.label }}</span>
              </div>
            </AdminPasswordField>
            <AdminPasswordField
              id="pw-confirm"
              v-model="form.confirm"
              label="Confirmar nueva contraseña"
              autocomplete="new-password"
              :error="confirmError"
              :valid="Boolean(form.confirm) && !confirmError && !nextError"
            />

            <Transition name="rise">
              <p v-if="error" class="pwm__error" role="alert">
                <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
              </p>
            </Transition>

            <div class="pwm__actions">
              <AdminButton variant="ghost" @click="pw.close">Cancelar</AdminButton>
              <AdminButton
                type="submit"
                variant="primary"
                icon="fa-solid fa-lock"
                :loading="saving"
                :disabled="!canSubmit"
              >
                Guardar
              </AdminButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.pwm {
  position: fixed;
  inset: 0;
  z-index: 200;
  @include flex(column, stretch, flex-end);
  padding: 0.75rem;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  background: $overlay;
  backdrop-filter: blur(4px);

  @include from('sm') {
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  &__box {
    position: relative;
    width: 100%;
    max-width: 440px;
    max-height: calc(100dvh - 1.5rem);
    margin-inline: auto;
    overflow-y: auto;
    padding: 1.6rem 1.25rem 1.25rem;
    @include alu-border(24px);
    box-shadow: $shadow-lg;

    @include from('sm') {
      padding: 2rem 1.75rem 1.5rem;
    }
  }

  &__close {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: $paper;
      color: $ink;
    }
  }

  &__form,
  &__done {
    @include flex(column, stretch, flex-start, 0.9rem);
  }

  &__done {
    align-items: center;
    text-align: center;
  }

  &__icon {
    @include plinth(50%);
    @include flex(row, center, center);
    align-self: center;
    width: 3.2rem;
    height: 3.2rem;
    font-size: 1.2rem;
    color: $accent;

    &--ok {
      color: $success;
    }
  }

  &__title {
    @include display($text-xl, 780, 115%);
    text-align: center;
  }

  &__lead {
    margin-top: -0.4rem;
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;
  }

  &__meter {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-xs;
    color: $ink-muted;

    &--1 {
      --pw-color: #{$danger};
    }
    &--2 {
      --pw-color: #{$warning};
    }
    &--3,
    &--4 {
      --pw-color: #{$success};
    }
  }

  &__bars {
    @include flex(row, center, flex-start, 0.25rem);
    flex: 1;
  }

  &__bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: $line;
    transition: background-color $dur $ease-out;

    &--on {
      background: var(--pw-color);
    }
  }

  &__strength {
    min-width: 5.5rem;
    text-align: right;
    font-weight: 600;
    color: var(--pw-color);
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
  }

  &__actions {
    @include flex(row, stretch, flex-end, 0.6rem);
    margin-top: 0.3rem;

    > * {
      flex: 1 1 0;
    }
  }
}

.pwm-enter-active {
  transition: opacity 0.25s $ease-out;

  .pwm__box {
    transition: transform 0.4s $ease-spring;
  }
}

.pwm-leave-active {
  transition: opacity 0.2s ease;
}

.pwm-enter-from,
.pwm-leave-to {
  opacity: 0;

  .pwm__box {
    transform: translateY(24px) scale(0.97);
  }
}

@include reduced-motion {
  .pwm-enter-active .pwm__box {
    transition: none;
  }
}
</style>
