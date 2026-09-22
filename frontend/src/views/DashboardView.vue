<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <p class="text-xs text-slate-500 uppercase font-semibold">Toplam Ürün Çeşidi</p>
        <p class="text-2xl font-bold text-slate-800">{{ stats.totalProducts }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <p class="text-xs text-slate-500 uppercase font-semibold">Kritik Stoktaki Ürünler</p>
        <p class="text-2xl font-bold text-red-600">{{ stats.criticalProducts }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <p class="text-xs text-slate-500 uppercase font-semibold">Son 7 Gün Hareket</p>
        <p class="text-2xl font-bold text-indigo-600">{{ stats.weeklyMovements }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow-sm border border-slate-200">
        <h3 class="font-semibold text-slate-700 mb-4">Giriş/Çıkış Özeti (Son 7 Gün)</h3>
        <div class="h-64 flex items-center justify-center bg-slate-50 text-slate-400 border border-dashed border-slate-200 rounded">
          <Bar v-if="chartData.labels" :data="chartData" :options="chartOptions" />
          <span v-else>Grafik yükleniyor...</span>
        </div>
      </div>
      
      <div class="bg-white rounded shadow-sm border border-slate-200">
        <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 class="font-semibold text-slate-700">Tüketim Hızı (Velocity) Tahmini</h3>
          <p class="text-xs text-slate-500">Son 7 günlük çıkış ortalamasına göre tahmini bitiş süreleri</p>
        </div>
        <div class="p-0">
          <table class="w-full text-sm text-left text-slate-500">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">Ürün</th>
                <th class="px-4 py-3 text-right">Mevcut</th>
                <th class="px-4 py-3 text-right">Günlük Tüketim</th>
                <th class="px-4 py-3 text-right">Tahmini Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in velocities" :key="v.id" class="border-b last:border-0 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-900">{{ v.name }}</td>
                <td class="px-4 py-3 text-right">{{ v.current }}</td>
                <td class="px-4 py-3 text-right text-red-500">-{{ v.dailyOut.toFixed(1) }}</td>
                <td class="px-4 py-3 text-right font-semibold" :class="v.daysLeft < 5 ? 'text-red-600' : 'text-emerald-600'">
                  <span v-if="v.daysLeft === Infinity">Hareketsiz</span>
                  <span v-else>{{ v.daysLeft }} Gün</span>
                </td>
              </tr>
              <tr v-if="velocities.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-slate-400">Yeterli hareket verisi yok.</td>
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
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const API_URL = 'http://localhost:5050/api'

const stats = ref({ totalProducts: 0, criticalProducts: 0, weeklyMovements: 0 })
const velocities = ref([])
const chartData = ref({})
const chartOptions = { responsive: true, maintainAspectRatio: false }

const fetchData = async () => {
  try {
    const [prodRes, moveRes] = await Promise.all([
      axios.get(`${API_URL}/products`),
      axios.get(`${API_URL}/movements`)
    ])
    
    const products = prodRes.data
    const movements = moveRes.data
    
    stats.value.totalProducts = products.length
    stats.value.criticalProducts = products.filter(p => p.current_stock < p.min_stock_level).length
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentMovements = movements.filter(m => new Date(m.createdAt) > sevenDaysAgo)
    stats.value.weeklyMovements = recentMovements.length

    // Velocity Hesaplama
    const outMovements = recentMovements.filter(m => m.movement_type === 'OUT' || m.movement_type === 'WASTE')
    const velocityMap = {}
    
    outMovements.forEach(m => {
      if(!velocityMap[m.product_id._id]) velocityMap[m.product_id._id] = 0;
      velocityMap[m.product_id._id] += m.quantity;
    })

    velocities.value = products.map(p => {
      const totalOut = velocityMap[p._id] || 0
      const dailyOut = totalOut / 7
      let daysLeft = Infinity
      if (dailyOut > 0) {
        daysLeft = Math.ceil(p.current_stock / dailyOut)
      }
      return { id: p._id, name: p.name, current: p.current_stock, dailyOut, daysLeft }
    }).sort((a,b) => a.daysLeft - b.daysLeft)

    // Chart Data (Son 7 gun grafikleri)
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toLocaleDateString('tr-TR', { weekday: 'short' })
    }).reverse()

    const inData = Array(7).fill(0)
    const outData = Array(7).fill(0)

    recentMovements.forEach(m => {
      const daysAgo = Math.floor((new Date() - new Date(m.createdAt)) / (1000 * 60 * 60 * 24))
      if(daysAgo >= 0 && daysAgo < 7) {
        const idx = 6 - daysAgo
        if(m.movement_type === 'IN') inData[idx] += m.quantity
        else outData[idx] += m.quantity
      }
    })

    chartData.value = {
      labels: dates,
      datasets: [
        { label: 'Giriş', backgroundColor: '#10b981', data: inData },
        { label: 'Çıkış', backgroundColor: '#f43f5e', data: outData }
      ]
    }
    
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => fetchData())
</script>
