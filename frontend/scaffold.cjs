const fs = require('fs');
const path = require('path');

const files = {
  'src/components/atoms/BaseButton.vue': `<template>
  <button :type="type" :class="['px-4 py-2 rounded text-sm font-medium transition-colors', variantClass]">
    <slot></slot>
  </button>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ type: { type: String, default: 'button' }, variant: { type: String, default: 'primary' } })
const variantClass = computed(() => props.variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300')
</script>`,

  'src/components/atoms/BaseInput.vue': `<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="type" :required="required" class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
</template>
<script setup>
defineProps({ modelValue: [String, Number], type: { type: String, default: 'text' }, required: Boolean })
defineEmits(['update:modelValue'])
</script>`,

  'src/components/atoms/BaseSelect.vue': `<template>
  <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" :required="required" class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
    <slot></slot>
  </select>
</template>
<script setup>
defineProps({ modelValue: [String, Number], required: Boolean })
defineEmits(['update:modelValue'])
</script>`,

  'src/components/molecules/FormField.vue': `<template>
  <div class="mb-4">
    <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">{{ label }}</label>
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({ label: String })
</script>`,

  'src/components/organisms/Sidebar.vue': `<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen">
    <div class="h-16 flex items-center px-6 border-b border-slate-800">
      <span class="text-white font-bold text-lg tracking-wider">ENVANTER PRO</span>
    </div>
    <nav class="flex-1 py-4">
      <ul class="space-y-1">
        <li>
          <a href="#" class="flex items-center px-6 py-2.5 bg-indigo-600 text-white border-l-4 border-indigo-400">
            <span class="text-sm font-medium">Stok Yönetimi</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="p-6 border-t border-slate-800">
      <p class="text-xs text-slate-500">v1.0.0 Atomic</p>
    </div>
  </aside>
</template>`,

  'src/components/organisms/ProductTable.vue': `<template>
  <div class="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <h3 class="font-semibold text-slate-700 text-sm">Ürün Listesi</h3>
      <span class="text-xs text-slate-500">Toplam: {{ products.length }} kayıt</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold">SKU</th>
            <th class="px-4 py-3 font-semibold">Ürün Adı</th>
            <th class="px-4 py-3 font-semibold text-right">Stok</th>
            <th class="px-4 py-3 font-semibold text-right">Min. Limit</th>
            <th class="px-4 py-3 font-semibold text-center">Durum</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="p in products" :key="p._id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-mono text-xs text-slate-500">{{ p.sku_code }}</td>
            <td class="px-4 py-3 font-medium text-slate-800">{{ p.name }}</td>
            <td class="px-4 py-3 text-right font-semibold" :class="p.current_stock < p.min_stock_level ? 'text-red-600' : 'text-slate-700'">{{ p.current_stock }} <span class="text-xs text-slate-500 font-normal">{{ p.unit }}</span></td>
            <td class="px-4 py-3 text-right text-slate-500">{{ p.min_stock_level }} <span class="text-xs">{{ p.unit }}</span></td>
            <td class="px-4 py-3 text-center">
              <span v-if="p.current_stock < p.min_stock_level" class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">KRİTİK</span>
              <span v-else class="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-700">YETERLİ</span>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-slate-400">Veri bulunamadı.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
defineProps({ products: Array })
</script>`,

  'src/layouts/DashboardLayout.vue': `<template>
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
</script>`,

  'src/views/DashboardView.vue': `<template>
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
    const res = await axios.get(\`\${API_URL}/products\`)
    products.value = res.data
  } catch(e) { console.error(e) }
}

const handleMovement = async () => {
  try {
    await axios.post(\`\${API_URL}/movements\`, movement.value)
    movement.value.quantity = null
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

const handleProduct = async () => {
  try {
    await axios.post(\`\${API_URL}/products\`, newProduct.value)
    newProduct.value.sku_code = ''
    newProduct.value.name = ''
    fetchProducts()
  } catch(e) { alert(e.response?.data?.error || 'Hata') }
}

onMounted(() => fetchProducts())
</script>`,

  'src/App.vue': `<template>
  <DashboardView />
</template>
<script setup>
import DashboardView from './views/DashboardView.vue'
</script>`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(path.join(__dirname, filepath), content);
});
console.log('Atomic structure generated.');
