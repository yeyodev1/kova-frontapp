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
    <form class="login__card" @submit.prevent="submit">
      <img src="/logo.jpg" alt="Kova" class="login__logo" width="64" height="64" />
      <p class="login__eyebrow">Panel de administración</p>
      <h1 class="login__title">Ingresar</h1>

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
  min-height: 100vh;
  @include flex(column, stretch, center);
  padding: 1.25rem;
  background: linear-gradient(180deg, $sand 0%, $paper 60%);

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 420px;
    margin-inline: auto;
    padding: 2rem 1.4rem;
    box-shadow: $shadow-md;

    @include from('sm') {
      padding: 2.4rem 2.2rem;
    }
  }

  &__logo {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    object-fit: cover;
    align-self: center;
  }

  &__eyebrow {
    @include eyebrow;
    text-align: center;
  }

  &__title {
    @include display($display-sm, 600);
    text-align: center;
    margin-bottom: 0.4rem;
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
    width: 2.3rem;
    height: 2.3rem;
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
  }

  &__back {
    align-self: center;
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
