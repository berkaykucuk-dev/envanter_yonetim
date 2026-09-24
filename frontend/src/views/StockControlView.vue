<template>
  <div class="space-y-6">
    <div class="bg-white rounded shadow-sm border border-slate-200">
      <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 class="font-semibold text-slate-700">Hızlı Stok Hareketi (Giriş / Çıkış)</h3>
      </div>
      <form @submit.prevent="handleMovement" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="İşlem Tipi">
            <BaseSelect v-model="movement.movement_type" required>
              <option value="IN">Giriş (IN)</option>
              <option value="OUT">Çıkış (Kullanım / Satış)</option>
              <option value="WASTE">Çıkış (Zayi / Fire)</option>
            </BaseSelect>
          </FormField>
          <FormField label="Ürün">
            <BaseSelect v-model="movement.product_id" required>
              <option value="" disabled>Seçiniz...</option>
              <option v-for="p in products" :key="p._id" :value="p._id">
                {{ p.sku_code }} - {{ p.name }} (Mevcut: {{ p.current_stock }})
              </option>
            </BaseSelect>
          </FormField>
          <FormField label="Miktar">
            <BaseInput v-model="movement.quantity" type="number" min="1" required />
          </FormField>
          <FormField label="İşlem Notu (İsteğe Bağlı)">
            <BaseInput v-model="movement.notes" type="text" placeholder="Açıklama girin..." />
          </FormField>
          
          <!-- SKT Alanları (Sadece IN ve Bozulabilir İse Gerekli Ama Formda Gösterelim) -->
          <template v-if="movement.movement_type === 'IN' && isSelectedProductPerishable">
            <FormField label="Parti / Lot No (Zorunlu)">
              <BaseInput v-model="movement.batch_number" type="text" required />
            </FormField>
            <FormField label="Son Kullanma Tarihi (Zorunlu)">
              <BaseInput v-model="movement.expiration_date" type="date" required />
            </FormField>
          </template>
        </div>
        <div class="flex justify-end">
          <BaseButton type="submit">İşlemi Kaydet</BaseButton>
        </div>
      </form>
    </div>

    <div class="bg-white rounded shadow-sm border border-slate-200">
      <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 class="font-semibold text-slate-700">Yeni Ürün Kartı Aç</h3>
      </div>
      <form @submit.prevent="handleProduct" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormField label="SKU Kodu">
            <BaseInput v-model="newProduct.sku_code" required />
          </FormField>
          <FormField label="Ürün Adı">
            <BaseInput v-model="newProduct.name" required />
          </FormField>
          <FormField label="Ölçü Birimi">
            <BaseInput v-model="newProduct.unit" required placeholder="kg, adet, litre" />
          </FormField>
          <FormField label="Kritik Limit">
            <BaseInput v-model="newProduct.min_stock_level" type="number" required />
          </FormField>
          <div class="flex flex-col justify-end pb-2">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="newProduct.is_perishable" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-slate-700 font-medium">Bozulabilir / SKT'li</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end">
          <BaseButton type="submit" variant="secondary">Ürün Oluştur</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FormField from '../components/molecules/FormField.vue'
import BaseInput from '../components/atoms/BaseInput.vue'
import BaseSelect from '../components/atoms/BaseSelect.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

const API_URL = `http://${window.location.hostname}:5050/api`
const products = ref([])

const movement = ref({ product_id: '', movement_type: 'IN', quantity: null, notes: '', batch_number: '', expiration_date: '' })
const newProduct = ref({ sku_code: '', name: '', unit: 'kg', min_stock_level: 10, is_perishable: false })

const isSelectedProductPerishable = computed(() => {
  if (!movement.value.product_id) return false
  const p = products.value.find(prod => prod._id === movement.value.product_id)
  return p ? p.is_perishable : false
})

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
    movement.value.notes = ''
    movement.value.batch_number = ''
    movement.value.expiration_date = ''
    alert('İşlem başarılı!')
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

const handleProduct = async () => {
  try {
    await axios.post(`${API_URL}/products`, newProduct.value)
    newProduct.value.sku_code = ''
    newProduct.value.name = ''
    newProduct.value.is_perishable = false
    alert('Ürün oluşturuldu!')
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

onMounted(() => fetchProducts())
</script>
