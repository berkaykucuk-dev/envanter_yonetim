<template>
  <div class="bg-white rounded shadow-sm border border-slate-200">
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <h3 class="font-semibold text-slate-700">Giriş/Çıkış Logları</h3>
      <span class="text-xs text-slate-500">Son 50 hareket gösteriliyor</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-slate-500">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3">Tarih</th>
            <th class="px-4 py-3">Ürün (SKU)</th>
            <th class="px-4 py-3">İşlem</th>
            <th class="px-4 py-3 text-right">Miktar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in movements" :key="m._id" class="border-b last:border-0 hover:bg-slate-50">
            <td class="px-4 py-3">{{ new Date(m.createdAt).toLocaleString('tr-TR') }}</td>
            <td class="px-4 py-3 font-medium text-slate-900">{{ m.product_id?.name }} <span class="text-xs text-slate-400">({{ m.product_id?.sku_code }})</span></td>
            <td class="px-4 py-3">
              <span :class="m.movement_type === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded text-xs font-semibold">
                {{ m.movement_type }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-bold">{{ m.quantity }}</td>
          </tr>
          <tr v-if="movements.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-slate-400">Henüz hareket bulunmuyor.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const movements = ref([])
const API_URL = 'http://localhost:5050/api'

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/movements`)
    movements.value = res.data.slice(0, 50)
  } catch (error) {
    console.error(error)
  }
})
</script>
