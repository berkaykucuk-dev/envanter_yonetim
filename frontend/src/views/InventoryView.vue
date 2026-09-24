<template>
  <div class="bg-white rounded shadow-sm border border-slate-200">
    <div class="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <h3 class="font-semibold text-slate-700">Total Envanter (Kayıtlı Ürünler)</h3>
      <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">{{ products.length }} Çeşit</span>
    </div>
    <div class="p-0">
      <ProductTable :products="products" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductTable from '../components/organisms/ProductTable.vue'

const API_URL = `http://${window.location.hostname}:5050/api`
const products = ref([])

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`)
    products.value = res.data
  } catch(e) { console.error(e) }
}

onMounted(() => fetchProducts())
</script>
