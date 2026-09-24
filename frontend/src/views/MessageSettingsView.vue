<template>
  <div class="max-w-3xl bg-white rounded shadow-sm border border-slate-200">
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
      <h3 class="font-semibold text-slate-700">WhatsApp Mesaj Ayarları</h3>
    </div>
    <form @submit.prevent="saveSettings" class="p-4 space-y-6">
      
      <!-- API Ayarlari -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">WhatsApp API URL</label>
          <input v-model="settings.whatsappApiUrl" type="url" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">API Key</label>
          <input v-model="settings.whatsappApiKey" type="text" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Hedef Etiketler (Tags)</label>
        <input v-model="tagsInput" type="text" placeholder="YÖNETİCİ, DEPO_SORUMLUSU" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        <p class="text-xs text-slate-500">Virgülle ayırarak birden fazla etiket girebilirsiniz. Mesajlar bu etiketlere sahip herkese gönderilir.</p>
      </div>
      
      <div class="space-y-4 pt-4 border-t border-slate-100">
        <h4 class="font-medium text-sm text-slate-800">Mesaj Şablonları</h4>
        <p class="text-xs text-slate-500">Kullanabileceğiniz değişkenler: <code class="bg-slate-100 px-1 rounded">{UrunAdi}</code>, <code class="bg-slate-100 px-1 rounded">{KalanStok}</code>, <code class="bg-slate-100 px-1 rounded">{Miktar}</code> (Sadece Zayi)</p>
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Kritik Stok Uyarısı</label>
          <p class="text-[11px] text-slate-400">Ürün çıkışı yapıldığında miktar limitin altına düşerse tetiklenir.</p>
          <textarea v-model="settings.templateCritical" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Zayi (Fire) Bildirimi</label>
          <p class="text-[11px] text-slate-400">Stok çıkışı 'Zayi' olarak işaretlendiğinde tetiklenir.</p>
          <textarea v-model="settings.templateWaste" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">SKT Yaklaşma Uyarısı (Dashboard)</label>
          <p class="text-[11px] text-slate-400">Dashboard yüklendiğinde SKT'sine 7 günden az kalmış ürünler için günlük 1 kez tetiklenir (Gelecek güncellemede aktif olacak).</p>
          <textarea v-model="settings.templateExpiring" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
        </div>
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

const API_URL = `http://${window.location.hostname}:5050/api`
const settings = ref({ 
  whatsappApiUrl: 'http://host.docker.internal:3000/api/v1/campaigns', 
  whatsappApiKey: '',
  templateCritical: '',
  templateWaste: '',
  templateExpiring: ''
})
const tagsInput = ref('')
const saving = ref(false)
const message = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/settings`)
    if(res.data) {
      settings.value = { ...settings.value, ...res.data }
      tagsInput.value = (res.data.targetTags || []).join(', ')
    }
  } catch (error) {
    console.error(error)
  }
})

const saveSettings = async () => {
  saving.value = true
  message.value = ''
  try {
    const payload = { 
      ...settings.value, 
      targetTags: tagsInput.value.split(',').map(t => t.trim()).filter(t => t) 
    }
    await axios.post(`${API_URL}/settings`, payload)
    message.value = 'Ayarlar başarıyla kaydedildi!'
    setTimeout(() => message.value = '', 3000)
  } catch (error) {
    alert('Hata oluştu')
  } finally {
    saving.value = false
  }
}
</script>

