<template>
  <div class="bg-slate-900 rounded shadow-sm border border-slate-800 text-slate-300 font-mono text-sm overflow-hidden flex flex-col h-[80vh]">
    <div class="px-4 py-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
      <h3 class="font-semibold text-white">Terminal Logları</h3>
      <button @click="fetchLogs" class="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white transition-colors">Yenile</button>
    </div>
    <div class="p-4 overflow-y-auto flex-1 whitespace-pre-wrap">
      {{ logs || 'Log yükleniyor...' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const logs = ref('')
const API_URL = 'http://localhost:5050/api'
let interval = null

const fetchLogs = async () => {
  try {
    const res = await axios.get(`${API_URL}/logs`)
    logs.value = res.data.logs
  } catch (error) {
    logs.value = 'Loglar okunamadı veya bağlantı hatası.'
  }
}

onMounted(() => {
  fetchLogs()
  interval = setInterval(fetchLogs, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

