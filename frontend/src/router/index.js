import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import InventoryView from '../views/InventoryView.vue'
import MovementLogsView from '../views/MovementLogsView.vue'
import MessageSettingsView from '../views/MessageSettingsView.vue'
import SystemLogsView from '../views/SystemLogsView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/inventory', name: 'Inventory', component: InventoryView },
  { path: '/logs', name: 'Logs', component: MovementLogsView },
  { path: '/settings', name: 'Settings', component: MessageSettingsView },
  { path: '/system-logs', name: 'SystemLogs', component: SystemLogsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
