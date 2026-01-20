
export const translations = {
  // Sidebar
  dashboard: { en: 'Dashboard', es: 'Panel' },
  sales: { en: 'Sales', es: 'Ventas' },
  expenses: { en: 'Expenses', es: 'Gastos' },
  insights: { en: 'AI Insights', es: 'Insights IA' },
  inventory: { en: 'Inventory', es: 'Inventario' },
  managementSuite: { en: 'Management Suite', es: 'Suite de Gestión' },
  quickActions: { en: 'Quick Actions', es: 'Acciones Rápidas' },
  sale: { en: 'Sale', es: 'Venta' },
  expense: { en: 'Expense', es: 'Gasto' },
  reports: { en: 'Reports', es: 'Reportes' },

  // Header
  netProfit: { en: 'Net Profit', es: 'Beneficio Neto' },

  // Dashboard
  totalRevenue: { en: 'Total Revenue', es: 'Ingresos Totales' },
  totalExpenses: { en: 'Total Expenses', es: 'Gastos Totales' },
  profitMargin: { en: 'Profit Margin', es: 'Margen de Beneficio' },
  revenueVsExpenses: { en: 'Revenue vs Expenses', es: 'Ingresos vs Gastos' },
  recentActivity: { en: 'Recent Activity', es: 'Actividad Reciente' },
  viewAllTransactions: { en: 'View All Transactions', es: 'Ver Todas las Transacciones' },
  noRecentTransactions: { en: 'No recent transactions', es: 'No hay transacciones recientes' },
  last7Days: { en: 'Last 7 Days', es: 'Últimos 7 Días' },
  last30Days: { en: 'Last 30 Days', es: 'Últimos 30 Días' },

  // Transaction List
  searchPlaceholder: { en: 'Search', es: 'Buscar' },
  filter: { en: 'Filter', es: 'Filtrar' },
  sort: { en: 'Sort', es: 'Ordenar' },
  date: { en: 'Date', es: 'Fecha' },
  description: { en: 'Description', es: 'Descripción' },
  category: { en: 'Category', es: 'Categoría' },
  amount: { en: 'Amount', es: 'Monto' },
  noRecords: { en: 'No records found', es: 'No se encontraron registros' },

  // Forms
  addNew: { en: 'Add New', es: 'Agregar Nuevo' },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  save: { en: 'Save', es: 'Guardar' },
  enterValidAmount: { en: 'Please enter a valid amount greater than 0.', es: 'Por favor ingrese un monto válido mayor a 0.' },
  optional: { en: 'Optional', es: 'Opcional' },
  addDetails: { en: 'Add details...', es: 'Agregar detalles...' },
  selectCategory: { en: 'Select Category', es: 'Seleccionar Categoría' },

  // Inventory
  productName: { en: 'Product Name', es: 'Nombre del Producto' }, 
  quantity: { en: 'Quantity', es: 'Cantidad' },
  price: { en: 'Price', es: 'Precio' },
  costPrice: { en: 'Cost Price', es: 'Costo' },
  margin: { en: 'Margin', es: 'Margen' },
  sku: { en: 'SKU', es: 'SKU' },
  supplier: { en: 'Supplier', es: 'Proveedor' },
  profitableProducts: { en: 'Most Profitable Products', es: 'Productos Más Rentables' },
  lowStockAlerts: { en: 'Low Stock Alerts', es: 'Alertas de Stock Bajo' },
  purchaseHistory: { en: 'Purchase History', es: 'Historial de Compras' },
  addProduct: { en: 'Add Product', es: 'Agregar Producto' },
  editProduct: { en: 'Edit Product', es: 'Editar Producto' },
  productsSeen: { en: 'Products', es: 'Productos' },
  stock: { en: 'Stock', es: 'Stock' },
  lowStock: { en: 'Low Stock', es: 'Stock Bajo' },
  outOfStock: { en: 'Out of Stock', es: 'Sin Stock' },
  
  // Generic
  delete: { en: 'Delete', es: 'Eliminar' },
  edit: {en: 'Edit', es: 'Editar'},
  actions: { en: 'Actions', es: 'Acciones' },
  selectProduct: { en: '-- Select Product --', es: '-- Seleccionar Producto --' },

  // Insights
  aiBusinessAdvisor: { en: 'AI Business Advisor', es: 'Asesor de Negocios IA' },
  getInsightsIntro: { en: 'Get intelligent insights based on your revenue, expenses, and transaction history.', es: 'Obtenga información inteligente basada en sus ingresos, gastos e historial de transacciones.' },
  generateInsights: { en: 'Generate Insights', es: 'Generar Insights' },
  analyzing: { en: 'Analyzing...', es: 'Analizando...' },
  readyToAnalyze: { en: 'Ready to Analyze Your Data', es: 'Listo para analizar sus datos' },
  clickToAnalyze: { en: 'Click the button above to have Gemini AI review your business performance and suggest areas for improvement or growth.', es: 'Haga clic en el botón de arriba para que Gemini AI revise el rendimiento de su negocio y sugiera áreas de mejora o crecimiento.' },
  observationRequired: { en: 'Observation Required', es: 'Observación Requerida' },
  pleaseAddTransactions: { en: 'Please add some transactions first to allow for analysis.', es: 'Por favor agregue algunas transacciones primero para permitir el análisis.' },
  failedToGenerate: { en: 'Failed to generate insights. Check your API configuration.', es: 'Error al generar insights. Verifique su configuración de API.' },
  lastAnalyzed: { en: 'Last analyzed', es: 'Último análisis' },
  poweredBy: { en: 'Powered by Gemini 1.5 Flash', es: 'Impulsado por Gemini 1.5 Flash' },
} as const;

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations;
