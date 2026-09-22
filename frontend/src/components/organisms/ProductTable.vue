<template>
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
</script>