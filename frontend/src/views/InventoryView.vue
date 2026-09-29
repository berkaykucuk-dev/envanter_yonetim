<template>
  <div class="bg-white rounded shadow-sm border border-slate-200">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <h3 class="font-semibold text-slate-700">Total Envanter (Kayıtlı Ürünler)</h3>
      <div class="flex items-center gap-3">
        <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">{{ products.length }} Çeşit</span>
        <button
          @click="showModal = true"
          class="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Yeni Ürün
        </button>
      </div>
    </div>

    <!-- Tablo -->
    <div class="p-0">
      <ProductTable :products="products" />
    </div>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Koyu Arka Plan -->
          <div class="absolute inset-0 bg-black/50" @click="closeModal" />

          <!-- Modal Kutusu -->
          <div class="relative bg-white rounded-sm shadow-xl w-full max-w-lg">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 class="text-base font-semibold text-slate-800">Yeni Ürün Kartı Aç</h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Modal İçerik -->
            <form @submit.prevent="handleProduct" class="p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">SKU Kodu</label>
                  <input
                    v-model="newProduct.sku_code"
                    required
                    class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ÖRN-001"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Ürün Adı</label>
                  <input
                    v-model="newProduct.name"
                    required
                    class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ürün adını girin"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Ölçü Birimi</label>
                  <input
                    v-model="newProduct.unit"
                    required
                    class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="kg, adet, litre..."
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Kritik Stok Limiti</label>
                  <input
                    v-model="newProduct.min_stock_level"
                    type="number"
                    required
                    class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <!-- Bozulabilir Checkbox -->
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="newProduct.is_perishable"
                  class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-slate-700 font-medium">Bozulabilir / SKT'li ürün</span>
              </label>

              <!-- Hata Mesajı -->
              <p v-if="errorMsg" class="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{{ errorMsg }}</p>

              <!-- Butonlar -->
              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded font-medium transition-colors"
                >
                  {{ isSubmitting ? 'Kaydediliyor...' : 'Ürün Oluştur' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductTable from '../components/organisms/ProductTable.vue'

const API_URL = `http://${window.location.hostname}:5050/api`
const products = ref([])
const showModal = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')

const newProduct = ref({ sku_code: '', name: '', unit: 'kg', min_stock_level: 10, is_perishable: false })

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`)
    products.value = res.data
  } catch(e) { console.error(e) }
}

const closeModal = () => {
  showModal.value = false
  errorMsg.value = ''
  newProduct.value = { sku_code: '', name: '', unit: 'kg', min_stock_level: 10, is_perishable: false }
}

const handleProduct = async () => {
  isSubmitting.value = true
  errorMsg.value = ''
  try {
    await axios.post(`${API_URL}/products`, newProduct.value)
    await fetchProducts()
    closeModal()
  } catch(e) {
    errorMsg.value = e.response?.data?.error || 'Bir hata oluştu, lütfen tekrar deneyin.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => fetchProducts())
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
