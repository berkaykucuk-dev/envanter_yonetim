<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden font-sans">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white border-b border-slate-200 flex items-center px-6 shadow-sm z-10">
        <h1 class="text-lg font-semibold text-slate-800">Stok Yönetim Paneli</h1>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
<script setup>
import Sidebar from '../components/organisms/Sidebar.vue'
</script>
