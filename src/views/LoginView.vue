<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Solo rutas internas del panel: un ?next externo no debe sacar al admin del sitio.
function nextPath(): string {
  const next = route.query.next
  return typeof next === 'string' && next.startsWith('/admin') ? next : '/admin'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    if (user.accountType !== 'admin') {
      userStore.clear()
      error.value = 'Esta cuenta no tiene acceso al panel'
      return
    }
    toast.success(`Hola, ${user.name || user.email}`)
    router.replace(nextPath())
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <span class="login__glow" aria-hidden="true"></span>
    <form class="login__card" @submit.prevent="submit">
      <div class="login__plinth">
        <img src="/logo.jpg" alt="Kova" class="login__logo" width="72" height="72" />
      </div>
      <p class="login__eyebrow">Panel de administración</p>
      <h1 class="login__title">Hola de nuevo</h1>

      <div class="login__field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="email" inputmode="email" required />
      </div>

      <div class="login__field">
        <label for="password">Contraseña</label>
        <div class="login__password">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="login__eye"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <Transition name="rise">
        <p v-if="error" class="login__error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--primary login__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>

      <RouterLink to="/" class="login__back">
        <i class="fa-solid fa-arrow-left"></i> Volver a la tienda
      </RouterLink>
    </form>
  </section>
</template>

<style scoped lang="scss">
.login {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  @include flex(column, stretch, center);
  padding: 1.25rem;
  @include moss;
  overflow: hidden;

  // Halo salvia detrás de la tarjeta: da profundidad sin otra imagen.
  &__glow {
    position: absolute;
    left: 50%;
    top: 38%;
    width: 640px;
    height: 640px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($sage, 0.35), transparent 62%);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__card {
    position: relative;
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 410px;
    margin-inline: auto;
    padding: 2rem 1.4rem 1.6rem;
    border-radius: $radius-lg;
    background: $surface;
    color: $ink;
    box-shadow:
      0 1px 0 rgba(#fff, 0.6) inset,
      0 40px 80px -30px rgba(#000, 0.55);
    animation: rise $dur-slow $ease-out both;

    @include from('sm') {
      padding: 2.4rem 2.2rem 1.9rem;
    }
  }

  &__plinth {
    @include plinth(22px);
    @include glint('&:hover', 1.1s, 0.6);
    align-self: center;
    padding: 0.55rem;
    margin-bottom: 0.3rem;
    animation: rise $dur-slow $ease-out 80ms both;

    &::after {
      animation: glint 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.55s forwards;
    }
  }

  &__logo {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    object-fit: cover;
    mix-blend-mode: normal !important;
    box-shadow: 0 6px 16px -8px rgba($ink, 0.45);
  }

  &__eyebrow {
    @include eyebrow;
    text-align: center;
  }

  &__title {
    @include display(clamp(1.7rem, 1.4rem + 1.4vw, 2.2rem), 800, 118%);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  &__password {
    position: relative;

    input {
      padding-right: 2.8rem;
    }
  }

  &__eye {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.6rem;
    height: 2.6rem;
    color: $ink-muted;
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__submit {
    margin-top: 0.4rem;
    background: $accent-deep;

    &:hover {
      background: $ink;
    }
  }

  &__back {
    @include flex(row, center, center, 0.4rem);
    align-self: center;
    font-size: $text-sm;
    color: $ink-muted;
    padding: 0.4rem;
    transition: color $dur $ease-out;

    &:hover {
      color: $accent;
    }
  }

  @include reduced-motion {
    &__card,
    &__plinth {
      animation: none;
    }
  }
}
</style>
