<template>
  <div class="max-w-2xl bg-white rounded shadow-sm border border-slate-200">
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
      <h3 class="font-semibold text-slate-700">WhatsApp Mesaj Ayarları</h3>
    </div>
    <form @submit.prevent="saveSettings" class="p-4 space-y-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Hedef Etiket (Tag)</label>
        <input v-model="settings.targetTag" type="text" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
        <p class="text-xs text-slate-500">Bu etikete sahip olan WhatsApp numaralarına bildirim gider. (Örn: YÖNETİCİ)</p>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Mesaj Şablonu (Body)</label>
        <textarea v-model="settings.messageTemplate" rows="4" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
        <p class="text-xs text-slate-500">
          Değişkenler: <code class="bg-slate-100 px-1 rounded">{UrunAdi}</code>, <code class="bg-slate-100 px-1 rounded">{KalanStok}</code>
        </p>
      </div>
      
      <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors" :disabled="saving">
        {{ saving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
      </button>

      <div v-if="message" class="p-3 bg-emerald-50 text-emerald-700 rounded text-sm text-center">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5050/api'
const settings = ref({ targetTag: '', messageTemplate: '' })
const saving = ref(false)
const message = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/settings`)
    if(res.data) {
      settings.value.targetTag = res.data.targetTag || 'YÖNETİCİ'
      settings.value.messageTemplate = res.data.messageTemplate || '⚠️ DİKKAT: {UrunAdi} kritik seviyede! Kalan stok: {KalanStok}'
    }
  } catch (error) {
    console.error(error)
  }
})

const saveSettings = async () => {
  saving.value = true
  message.value = ''
  try {
    await axios.post(`${API_URL}/settings`, settings.value)
    message.value = 'Ayarlar başarıyla kaydedildi!'
    setTimeout(() => message.value = '', 3000)
  } catch (error) {
    alert('Hata oluştu')
  } finally {
    saving.value = false
  }
}
</script>
