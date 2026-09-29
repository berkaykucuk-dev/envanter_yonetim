<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden font-sans">
    <!-- Mobil Overlay -->
    <Transition name="overlay">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
      <aside
        v-show="sidebarOpen || isDesktop"
        class="fixed lg:static z-30 w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0"
      >
        <!-- Logo + Kapat Butonu (Mobil) -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span class="text-white font-bold text-lg tracking-wider truncate">Envanter Yönetimi</span>
          <button
            class="lg:hidden text-slate-400 hover:text-white transition-colors"
            @click="sidebarOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Nav Linkleri -->
        <nav class="flex-1 py-4 overflow-y-auto">
          <ul class="space-y-1">
            <li v-for="link in links" :key="link.path">
              <router-link
                :to="link.path"
                active-class="bg-indigo-600 text-white border-indigo-400"
                class="flex items-center gap-3 px-6 py-2.5 hover:bg-slate-800 text-slate-300 border-l-4 border-transparent transition-colors"
                @click="sidebarOpen = false"
              >
                <span class="text-lg leading-none">{{ link.icon }}</span>
                <span class="text-sm font-medium">{{ link.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="p-6 border-t border-slate-800">
          <p class="text-xs text-slate-500">v1.2.0</p>
        </div>
      </aside>
    </Transition>

    <!-- Ana İçerik -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 shadow-sm z-10 gap-3">
        <!-- Hamburger (Mobil) -->
        <button
          class="lg:hidden text-slate-500 hover:text-slate-800 transition-colors p-1"
          @click="sidebarOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-slate-800 truncate">Stok Yönetim Paneli</h1>
      </header>

      <!-- Sayfa İçeriği -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sidebarOpen = ref(false)
const isDesktop = ref(false)

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) sidebarOpen.value = false
}

onMounted(() => {
  checkDesktop()
  window.addEventListener('resize', checkDesktop)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop)
})

const links = [
  { path: '/dashboard',     name: 'Dashboard',              icon: '📊' },
  { path: '/inventory',     name: 'Total Envanter',         icon: '📦' },
  { path: '/stock-control', name: 'Stok Kontrol',           icon: '🔄' },
  { path: '/logs',          name: 'Giriş/Çıkış Logları',   icon: '📋' },
  { path: '/settings',      name: 'Mesaj İşlemleri',        icon: '💬' },
  { path: '/system-logs',   name: 'Terminal Logları',       icon: '🖥️' },
]
</script>

<style scoped>
/* Overlay Geçişi */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Sidebar Slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
