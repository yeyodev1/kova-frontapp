export interface AdminNavItem {
  to: string
  name: string
  label: string
  short: string
  icon: string
  badge?: boolean
}

export const adminNav: AdminNavItem[] = [
  { to: '/admin', name: 'AdminDashboard', label: 'Panel', short: 'Panel', icon: 'fa-solid fa-chart-simple' },
  {
    to: '/admin/pedidos',
    name: 'AdminOrders',
    label: 'Pedidos',
    short: 'Pedidos',
    icon: 'fa-solid fa-receipt',
    badge: true,
  },
  { to: '/admin/productos', name: 'AdminProducts', label: 'Productos', short: 'Productos', icon: 'fa-solid fa-box' },
  { to: '/admin/dropi', name: 'AdminDropi', label: 'Importar de Dropi', short: 'Dropi', icon: 'fa-solid fa-cloud-arrow-down' },
  { to: '/admin/bot', name: 'AdminBot', label: 'Bot de WhatsApp', short: 'Bot', icon: 'fa-brands fa-whatsapp' },
  { to: '/admin/carritos', name: 'AdminLeads', label: 'Carritos abandonados', short: 'Carritos', icon: 'fa-solid fa-cart-arrow-down' },
  { to: '/admin/ajustes', name: 'AdminSettings', label: 'Ajustes', short: 'Ajustes', icon: 'fa-solid fa-sliders' },
]
