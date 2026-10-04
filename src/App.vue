<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import AnnouncementBar from '@/layout/AnnouncementBar.vue'
import WhatsAppFloat from '@/layout/WhatsAppFloat.vue'
import CartDrawer from '@/components/store/CartDrawer.vue'
import ToastList from '@/components/ui/ToastList.vue'
import { useStoreSettings } from '@/composables/useStoreSettings'
import { captureUtm } from '@/composables/useUtm'

const route = useRoute()
const { load } = useStoreSettings()

// La URL de entrada es la del anuncio: ahí vienen los utm_* y el fbclid.
captureUtm()
load()

const chrome = computed(() => !route.meta.hideChrome)
const isAdmin = computed(() => route.path.startsWith('/admin'))
// Checkout no lleva chrome; en producto el botón sube para no tapar la barra de compra fija.
// En pedido recibido ya hay un botón grande de WhatsApp; el flotante taparía el uploader.
const showWhatsapp = computed(
  () => chrome.value && !isAdmin.value && route.name !== 'OrderSuccess',
)
</script>

<template>
  <div class="app">
    <template v-if="chrome">
      <AnnouncementBar />
      <TheHeader />
    </template>
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="chrome" />
    <WhatsAppFloat v-if="showWhatsapp" :raised="route.name === 'Product'" />
    <CartDrawer v-if="!isAdmin" />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  // Alto mínimo de pantalla: durante la transición de página (out-in) el main
  // queda vacío un instante y sin esto el footer saltaría hacia arriba.
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100svh;
  }
}
</style>
