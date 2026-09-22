<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <!-- Navbar -->
    <nav class="bg-indigo-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-bold text-xl tracking-wide">Envanter Pro</span>
          </div>
          <div class="text-sm font-medium text-indigo-200">Test Ortamı</div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- İstatistikler -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
          <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">Toplam Ürün Çeşidi</p>
            <p class="text-2xl font-bold text-slate-800">{{ products.length }}</p>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
          <div class="p-3 bg-red-100 text-red-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">Kritik Stok Uyarısı</p>
            <p class="text-2xl font-bold text-slate-800">{{ criticalStockCount }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        <!-- Urun Ekleme Karti -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="bg-slate-50 border-b border-slate-100 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Yeni Ürün Tanımla
            </h2>
          </div>
          <form @submit.prevent="addProduct" class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stok Kodu (SKU)</label>
                <input v-model="newProduct.sku_code" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Örn: UN-001" required>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ürün Adı</label>
                <input v-model="newProduct.name" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Örn: Tam Buğday Unu" required>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Birim</label>
                <input v-model="newProduct.unit" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="kg, lt, adet" required>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kritik Stok Limiti</label>
                <input v-model="newProduct.min_stock_level" type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 active:transform active:scale-[0.99] transition-all shadow-sm">
              Ürünü Kaydet
            </button>
          </form>
        </div>

        <!-- Stok Hareketi Karti -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="bg-slate-50 border-b border-slate-100 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Stok Hareketi İşle (IN / OUT)
            </h2>
          </div>
          <form @submit.prevent="addMovement" class="p-6 space-y-5">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">İşlem Yapılacak Ürün</label>
              <select v-model="movement.product_id" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer" required>
                <option disabled value="">Listeden ürün seçiniz...</option>
                <option v-for="p in products" :key="p._id" :value="p._id">
                  {{ p.sku_code }} - {{ p.name }} (Mevcut: {{ p.current_stock }} {{ p.unit }})
                </option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">İşlem Tipi</label>
                <div class="relative">
                  <select v-model="movement.movement_type" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-medium" :class="movement.movement_type === 'IN' ? 'text-emerald-700' : 'text-rose-700'">
                    <option value="IN">Giriş Yap (+)</option>
                    <option value="OUT">Çıkış Yap (-) WhatsApp Test</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Miktar</label>
                <input v-model="movement.quantity" type="number" min="0.1" step="0.1" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 active:transform active:scale-[0.99] transition-all shadow-sm">
              Hareketi Onayla
            </button>
          </form>
        </div>
      </div>

      <!-- Tablo Alanı -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 bg-white">
          <h2 class="text-lg font-bold text-slate-800">Güncel Envanter Durumu</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Stok Kodu</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Ürün Adı</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Güncel Stok</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Kritik Seviye</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Durum</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="p in products" :key="p._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 font-mono text-sm text-slate-600">{{ p.sku_code }}</td>
                <td class="px-6 py-4 font-medium text-slate-800">{{ p.name }}</td>
                <td class="px-6 py-4 font-bold" :class="p.current_stock < p.min_stock_level ? 'text-rose-600' : 'text-slate-700'">
                  {{ p.current_stock }} <span class="text-xs font-normal text-slate-400">{{ p.unit }}</span>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ p.min_stock_level }} <span class="text-xs">{{ p.unit }}</span></td>
                <td class="px-6 py-4">
                  <span v-if="p.current_stock < p.min_stock_level" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
                    Kritik Seviye
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Yeterli
                  </span>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                  <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  Kayıtlı ürün bulunamadı.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Bildirim (Toast) -->
    <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="toast.show" class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg v-if="toast.type === 'success'" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <svg v-else class="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-slate-900">{{ toast.title }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ toast.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5050/api'
const products = ref([])

const toast = ref({ show: false, type: 'success', title: '', message: '' })

const showToast = (type, title, message) => {
  toast.value = { show: true, type, title, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const newProduct = ref({
  sku_code: '',
  name: '',
  unit: 'kg',
  min_stock_level: 10
})

const movement = ref({
  product_id: '',
  movement_type: 'IN',
  quantity: null
})

const criticalStockCount = computed(() => {
  return products.value.filter(p => p.current_stock < p.min_stock_level).length
})

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`)
    products.value = res.data
  } catch (error) {
    showToast('error', 'Hata', 'Ürünler sunucudan çekilemedi.')
  }
}

const addProduct = async () => {
  try {
    await axios.post(`${API_URL}/products`, newProduct.value)
    showToast('success', 'Başarılı', 'Yeni ürün sisteme kaydedildi.')
    newProduct.value.sku_code = ''
    newProduct.value.name = ''
    fetchProducts()
  } catch (error) {
    showToast('error', 'Kayıt Başarısız', error.response?.data?.error || 'Bir hata oluştu.')
  }
}

const addMovement = async () => {
  if(!movement.value.product_id) return showToast('error', 'Uyarı', 'Lütfen listeden bir ürün seçin.')
  try {
    await axios.post(`${API_URL}/movements`, movement.value)
    showToast('success', 'Başarılı', 'Stok hareketi başarıyla işlendi.')
    movement.value.quantity = null
    fetchProducts()
  } catch (error) {
    showToast('error', 'Hata', error.response?.data?.error || 'Stok hareketi işlenemedi.')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
