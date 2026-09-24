<template>
  <div class="overflow-x-auto w-full">
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
        <tr>
          <th class="px-4 py-3 font-semibold">SKU</th>
          <th class="px-4 py-3 font-semibold">Ürün Adı</th>
          <th class="px-4 py-3 font-semibold text-right">Stok</th>
          <th class="px-4 py-3 font-semibold text-right">Min. Limit</th>
          <th class="px-4 py-3 font-semibold text-center">Durum</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <template v-for="p in products" :key="p._id">
          <tr class="hover:bg-slate-50 cursor-pointer transition-colors" @click="toggleRow(p._id)">
            <td class="px-4 py-3 font-mono text-xs text-slate-500">{{ p.sku_code }}</td>
            <td class="px-4 py-3 font-medium text-slate-800">{{ p.name }}</td>
            <td class="px-4 py-3 text-right font-semibold" :class="p.current_stock < p.min_stock_level ? 'text-red-600' : 'text-slate-700'">{{ p.current_stock }} <span class="text-xs text-slate-500 font-normal">{{ p.unit }}</span></td>
            <td class="px-4 py-3 text-right text-slate-500">{{ p.min_stock_level }} <span class="text-xs">{{ p.unit }}</span></td>
            <td class="px-4 py-3 text-center">
              <span v-if="p.current_stock < p.min_stock_level" class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">KRİTİK</span>
              <span v-else class="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-700">YETERLİ</span>
            </td>
            <td class="px-4 py-3 text-right text-slate-400">
              <svg v-if="expandedRow === p._id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </td>
          </tr>
          
          <!-- Genişleyen Satır (Son 5 Hareket) -->
          <tr v-if="expandedRow === p._id" class="bg-slate-50/50">
            <td colspan="6" class="p-0">
              <div class="px-8 py-4 border-l-4 border-indigo-400">
                <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">Son 5 Hareket</h4>
                <div v-if="loadingMovements" class="text-xs text-slate-400">Yükleniyor...</div>
                <table v-else-if="recentMovements.length > 0" class="w-full text-xs text-slate-600">
                  <thead>
                    <tr class="border-b border-slate-200">
                      <th class="pb-1 text-left">Tarih</th>
                      <th class="pb-1 text-left">İşlem</th>
                      <th class="pb-1 text-right">Miktar</th>
                      <th class="pb-1 text-left pl-4">Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in recentMovements" :key="m._id" class="border-b border-slate-100 last:border-0">
                      <td class="py-1">{{ new Date(m.createdAt).toLocaleString('tr-TR') }}</td>
                      <td class="py-1">
                        <span :class="{'text-emerald-600 bg-emerald-50': m.movement_type==='IN', 'text-amber-600 bg-amber-50': m.movement_type==='OUT', 'text-red-600 bg-red-50': m.movement_type==='WASTE'}" class="px-1.5 py-0.5 rounded font-medium">
                          {{ m.movement_type }}
                        </span>
                      </td>
                      <td class="py-1 text-right font-semibold">{{ m.quantity }}</td>
                      <td class="py-1 pl-4 text-slate-400 truncate max-w-[200px]">{{ m.notes || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="text-xs text-slate-400">Henüz hareket bulunmuyor.</div>
              </div>
            </td>
          </tr>
        </template>
        <tr v-if="products.length === 0">
          <td colspan="6" class="px-4 py-8 text-center text-slate-400">Veri bulunamadı.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

defineProps({ products: Array })

const expandedRow = ref(null)
const recentMovements = ref([])
const loadingMovements = ref(false)

const toggleRow = async (productId) => {
  if (expandedRow.value === productId) {
    expandedRow.value = null
    return
  }
  
  expandedRow.value = productId
  loadingMovements.value = true
  recentMovements.value = []
  
  try {
    const res = await axios.get(`http://${window.location.hostname}:5050/api/movements?product_id=${productId}`)
    recentMovements.value = res.data.slice(0, 5)
  } catch(e) {
    console.error(e)
  } finally {
    loadingMovements.value = false
  }
}
</script>
