<template>
  <div class="bg-gray-100 min-h-screen p-8 text-gray-800">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-8 flex items-center gap-3">
        <span>📦</span> Envanter Yönetimi (Vue)
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <!-- Urun Ekleme -->
        <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
          <h2 class="text-xl font-semibold mb-4 text-blue-800">1. Yeni Ürün Ekle</h2>
          <form @submit.prevent="addProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Stok Kodu (SKU)</label>
              <input v-model="newProduct.sku_code" type="text" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Ürün Adı</label>
              <input v-model="newProduct.name" type="text" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" required>
            </div>
            <div class="flex gap-4">
              <div class="w-1/2">
                <label class="block text-sm font-medium mb-1">Birim</label>
                <input v-model="newProduct.unit" type="text" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" required>
              </div>
              <div class="w-1/2">
                <label class="block text-sm font-medium mb-1">Kritik Stok</label>
                <input v-model="newProduct.min_stock_level" type="number" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white font-semibold p-2.5 rounded hover:bg-blue-700 transition">Ürünü Kaydet</button>
          </form>
        </div>

        <!-- Stok Hareketi -->
        <div class="bg-green-50/50 p-6 rounded-xl border border-green-100">
          <h2 class="text-xl font-semibold mb-4 text-green-800">2. Stok Hareketi (IN/OUT)</h2>
          <form @submit.prevent="addMovement" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Ürün Seçin</label>
              <select v-model="movement.product_id" class="w-full p-2 border rounded focus:ring-2 focus:ring-green-400" required>
                <option disabled value="">Ürün seçin...</option>
                <option v-for="p in products" :key="p._id" :value="p._id">
                  {{ p.name }} (Stok: {{ p.current_stock }} {{ p.unit }})
                </option>
              </select>
            </div>
            <div class="flex gap-4">
              <div class="w-1/2">
                <label class="block text-sm font-medium mb-1">İşlem Tipi</label>
                <select v-model="movement.movement_type" class="w-full p-2 border rounded focus:ring-2 focus:ring-green-400">
                  <option value="IN">Giriş (IN)</option>
                  <option value="OUT">Çıkış (OUT) - WhatsApp Test</option>
                </select>
              </div>
              <div class="w-1/2">
                <label class="block text-sm font-medium mb-1">Miktar</label>
                <input v-model="movement.quantity" type="number" class="w-full p-2 border rounded focus:ring-2 focus:ring-green-400" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-green-600 text-white font-semibold p-2.5 rounded hover:bg-green-700 transition">Hareketi Kaydet</button>
          </form>
        </div>
      </div>

      <!-- Liste -->
      <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Güncel Stok Durumu</h2>
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-4 border-b font-semibold">Stok Kodu</th>
                <th class="p-4 border-b font-semibold">Ürün Adı</th>
                <th class="p-4 border-b font-semibold">Güncel Stok</th>
                <th class="p-4 border-b font-semibold">Kritik Seviye</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p._id" :class="{'bg-red-50': p.current_stock < p.min_stock_level, 'hover:bg-gray-50': true}">
                <td class="p-4 border-b">{{ p.sku_code }}</td>
                <td class="p-4 border-b font-medium">{{ p.name }}</td>
                <td class="p-4 border-b font-bold" :class="p.current_stock < p.min_stock_level ? 'text-red-600' : 'text-green-600'">
                  {{ p.current_stock }} {{ p.unit }}
                </td>
                <td class="p-4 border-b text-gray-500">{{ p.min_stock_level }} {{ p.unit }}</td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="4" class="p-4 text-center text-gray-500">Henüz ürün bulunmuyor.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5050/api'
const products = ref([])

const newProduct = ref({
  sku_code: 'UN-003',
  name: 'Esmer Şeker',
  unit: 'kg',
  min_stock_level: 10
})

const movement = ref({
  product_id: '',
  movement_type: 'IN',
  quantity: 50
})

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`)
    products.value = res.data
  } catch (error) {
    console.error('Urunler cekilemedi', error)
  }
}

const addProduct = async () => {
  try {
    await axios.post(`${API_URL}/products`, newProduct.value)
    alert('Ürün başarıyla eklendi!')
    fetchProducts()
  } catch (error) {
    alert(error.response?.data?.error || 'Urun eklenemedi')
  }
}

const addMovement = async () => {
  if(!movement.value.product_id) return alert('Lütfen ürün seçin')
  try {
    await axios.post(`${API_URL}/movements`, movement.value)
    alert('Hareket başarıyla işlendi!')
    fetchProducts()
  } catch (error) {
    alert(error.response?.data?.error || 'Hareket islenemedi')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
