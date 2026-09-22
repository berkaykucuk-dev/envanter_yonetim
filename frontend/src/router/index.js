import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import InventoryView from '../views/InventoryView.vue'
import MovementLogsView from '../views/MovementLogsView.vue'
import MessageSettingsView from '../views/MessageSettingsView.vue'
import SystemLogsView from '../views/SystemLogsView.vue'
import StockControlView from '../views/StockControlView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/inventory', name: 'Inventory', component: InventoryView },
  { path: '/stock-control', name: 'StockControl', component: StockControlView },
  { path: '/logs', name: 'Logs', component: MovementLogsView },
  { path: '/settings', name: 'Settings', component: MessageSettingsView },
  { path: '/system-logs', name: 'SystemLogs', component: SystemLogsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

