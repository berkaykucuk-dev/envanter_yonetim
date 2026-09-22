<template>
  <DashboardLayout>
    <!-- Ust Bilgi -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <p class="text-xs text-slate-500 uppercase font-semibold">Toplam Ürün</p>
        <p class="text-2xl font-bold text-slate-800">{{ products.length }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <p class="text-xs text-slate-500 uppercase font-semibold">Kritik Stok</p>
        <p class="text-2xl font-bold text-red-600">{{ criticalCount }}</p>
      </div>
    </div>

    <!-- Icerik -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2">
        <ProductTable :products="products" />
      </div>
      <div class="space-y-6">
        <!-- Formlar -->
        <div class="bg-white rounded shadow-sm border border-slate-200">
          <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 class="font-semibold text-slate-700 text-sm">Hızlı Stok Hareketi</h3>
          </div>
          <form @submit.prevent="handleMovement" class="p-4">
            <FormField label="Ürün">
              <BaseSelect v-model="movement.product_id" required>
                <option value="" disabled>Seçiniz...</option>
                <option v-for="p in products" :key="p._id" :value="p._id">{{ p.sku_code }} - {{ p.name }} (Mevcut: {{ p.current_stock }})</option>
              </BaseSelect>
            </FormField>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="İşlem">
                <BaseSelect v-model="movement.movement_type" required>
                  <option value="IN">Giriş (IN)</option>
                  <option value="OUT">Çıkış (OUT)</option>
                </select>
              </FormField>
              <FormField label="Miktar">
                <BaseInput v-model="movement.quantity" type="number" required />
              </FormField>
            </div>
            <BaseButton type="submit" class="w-full">İşlemi Kaydet</BaseButton>
          </form>
        </div>

        <div class="bg-white rounded shadow-sm border border-slate-200">
          <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 class="font-semibold text-slate-700 text-sm">Yeni Ürün Kartı</h3>
          </div>
          <form @submit.prevent="handleProduct" class="p-4">
            <FormField label="SKU">
              <BaseInput v-model="newProduct.sku_code" required />
            </FormField>
            <FormField label="Ürün Adı">
              <BaseInput v-model="newProduct.name" required />
            </FormField>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="Birim">
                <BaseInput v-model="newProduct.unit" required />
              </FormField>
              <FormField label="Min Limit">
                <BaseInput v-model="newProduct.min_stock_level" type="number" required />
              </FormField>
            </div>
            <BaseButton type="submit" variant="secondary" class="w-full">Ürün Ekle</BaseButton>
          </form>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import ProductTable from '../components/organisms/ProductTable.vue'
import FormField from '../components/molecules/FormField.vue'
import BaseInput from '../components/atoms/BaseInput.vue'
import BaseSelect from '../components/atoms/BaseSelect.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

const API_URL = 'http://localhost:5050/api'
const products = ref([])

const movement = ref({ product_id: '', movement_type: 'IN', quantity: null })
const newProduct = ref({ sku_code: '', name: '', unit: 'kg', min_stock_level: 10 })

const criticalCount = computed(() => products.value.filter(p => p.current_stock < p.min_stock_level).length)

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`)
    products.value = res.data
  } catch(e) { console.error(e) }
}

const handleMovement = async () => {
  try {
    await axios.post(`${API_URL}/movements`, movement.value)
    movement.value.quantity = null
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

const handleProduct = async () => {
  try {
    await axios.post(`${API_URL}/products`, newProduct.value)
    newProduct.value.sku_code = ''
    newProduct.value.name = ''
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

onMounted(() => fetchProducts())
</script>