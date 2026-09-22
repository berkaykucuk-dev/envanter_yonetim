<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen">
    <div class="h-16 flex items-center px-6 border-b border-slate-800">
      <span class="text-white font-bold text-lg tracking-wider">Envanter Yönetimi</span>
    </div>
    <nav class="flex-1 py-4">
      <ul class="space-y-1">
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path" active-class="bg-indigo-600 text-white border-indigo-400" class="flex items-center px-6 py-2.5 hover:bg-slate-800 text-slate-300 border-l-4 border-transparent transition-colors">
            <span class="text-sm font-medium">{{ link.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="p-6 border-t border-slate-800">
      <p class="text-xs text-slate-500">v1.1.0 Multi-Page</p>
    </div>
  </aside>
</template>
<script setup>
const links = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/inventory', name: 'Total Envanter' },
  { path: '/stock-control', name: 'Stok Kontrol (Giriş/Çıkış)' },
  { path: '/logs', name: 'Giriş/Çıkış Logları' },
  { path: '/settings', name: 'Mesaj İşlemleri' },
  { path: '/system-logs', name: 'Terminal Logları' }
]
</script>