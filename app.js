const STORAGE_KEY = 'invgest-ia-data-v1';
const SESSION_KEY = 'invgest-ia-session-v1';

// Estos son los datos de inicio que se usan la primera vez que se abre la aplicación.
const SEED_DATA = {
	suppliers: [
		{ id: 'prov-001', name: 'Distribuidora Central', leadTimeDays: 3 },
		{ id: 'prov-002', name: 'Alimentos del Valle', leadTimeDays: 5 },
		{ id: 'prov-003', name: 'Comercializadora Norte', leadTimeDays: 4 },
		{ id: 'prov-004', name: 'Limpieza Integral', leadTimeDays: 2 }
	],
	products: [
		{ id: 'P-1001', name: 'Café molido 500 g', category: 'Abarrotes', stock: 8, minimumStock: 12, unitCost: 86.5, supplierId: 'prov-001', salesHistory: [5, 6, 4, 7, 5, 8, 6, 5, 7, 6, 4, 7, 6, 5] },
		{ id: 'P-1002', name: 'Leche entera 1 L', category: 'Lácteos', stock: 24, minimumStock: 18, unitCost: 24, supplierId: 'prov-002', salesHistory: [7, 8, 6, 9, 8, 7, 10, 8, 9, 7, 8, 10, 7, 9] },
		{ id: 'P-1003', name: 'Arroz integral 1 kg', category: 'Abarrotes', stock: 6, minimumStock: 10, unitCost: 32.5, supplierId: 'prov-001', salesHistory: [3, 4, 4, 5, 3, 6, 4, 5, 3, 4, 6, 4, 5, 3] },
		{ id: 'P-1004', name: 'Jabón líquido 750 ml', category: 'Limpieza', stock: 19, minimumStock: 8, unitCost: 48, supplierId: 'prov-004', salesHistory: [2, 2, 3, 1, 3, 2, 4, 2, 3, 2, 2, 3, 1, 4] },
		{ id: 'P-1005', name: 'Aceite de oliva 500 ml', category: 'Abarrotes', stock: 3, minimumStock: 8, unitCost: 118, supplierId: 'prov-003', salesHistory: [4, 3, 5, 4, 5, 6, 4, 5, 3, 6, 5, 4, 6, 5] },
		{ id: 'P-1006', name: 'Yogur natural 1 kg', category: 'Lácteos', stock: 14, minimumStock: 10, unitCost: 56, supplierId: 'prov-002', salesHistory: [3, 4, 3, 5, 4, 3, 4, 5, 3, 4, 6, 3, 5, 4] },
		{ id: 'P-1007', name: 'Papel higiénico 12 pzas', category: 'Hogar', stock: 5, minimumStock: 9, unitCost: 92, supplierId: 'prov-003', salesHistory: [3, 4, 5, 3, 5, 4, 6, 4, 3, 5, 4, 6, 4, 5] },
		{ id: 'P-1008', name: 'Detergente en polvo 2 kg', category: 'Limpieza', stock: 31, minimumStock: 12, unitCost: 74.5, supplierId: 'prov-004', salesHistory: [4, 3, 5, 4, 3, 4, 5, 3, 6, 4, 5, 3, 4, 5] }
	],
	transactions: [
		{ id: 'MOV-2041', date: '2026-10-31T16:20:00', type: 'Venta', productId: 'P-1002', productName: 'Leche entera 1 L', quantity: 2, user: 'María López', note: 'Venta de mostrador' },
		{ id: 'MOV-2040', date: '2026-10-31T14:05:00', type: 'Entrada', productId: 'P-1006', productName: 'Yogur natural 1 kg', quantity: 12, user: 'Samuel Vilchez', note: 'Recepción de proveedor' },
		{ id: 'MOV-2039', date: '2026-10-30T12:42:00', type: 'Venta', productId: 'P-1001', productName: 'Café molido 500 g', quantity: 1, user: 'María López', note: 'Venta de mostrador' },
		{ id: 'MOV-2038', date: '2026-10-29T10:15:00', type: 'Salida', productId: 'P-1003', productName: 'Arroz integral 1 kg', quantity: 1, user: 'Samuel Vilchez', note: 'Producto dañado' },
		{ id: 'MOV-2037', date: '2026-10-28T17:30:00', type: 'Venta', productId: 'P-1005', productName: 'Aceite de oliva 500 ml', quantity: 2, user: 'María López', note: 'Venta de mostrador' },
		{ id: 'MOV-2036', date: '2026-10-27T09:10:00', type: 'Entrada', productId: 'P-1008', productName: 'Detergente en polvo 2 kg', quantity: 10, user: 'Samuel Vilchez', note: 'Recepción de proveedor' },
		{ id: 'MOV-2035', date: '2026-10-26T13:22:00', type: 'Venta', productId: 'P-1007', productName: 'Papel higiénico 12 pzas', quantity: 1, user: 'María López', note: 'Venta de mostrador' }
	],
	users: [
		{ id: 'usr-001', username: 'admin', password: 'Admin123', name: 'Samuel Vilchez', role: 'Administrador', active: true },
		{ id: 'usr-002', username: 'dependiente', password: 'Venta123', name: 'María López', role: 'Dependiente', active: true },
		{ id: 'usr-003', username: 'delegado', password: 'Delegado123', name: 'Carlos Mendoza', role: 'Delegado', active: true }
	],
	replenishments: []
};

let state = structuredClone(SEED_DATA);
let currentUser = null;
let toastTimeout;
let persistenceQueue = Promise.resolve();
let geminiApiKey = '';
let geminiModel = 'gemini-2.5-flash';
let aiRecommendations = null;
let aiAnalysisStatus = 'local';
let aiAnalysisTimer;
let aiAnalysisSequence = 0;
let lastAlertSignature = '';
let serverSyncTimer;
let serverSyncInProgress = false;
let availableGeminiModels = [];

// Atajos para encontrar elementos de la página sin repetir tanto código.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

// Evita que un texto escrito por el usuario se interprete como parte de la página.
function escapeHTML(value) {
	return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function saveData() {
	const serialized = JSON.stringify(state);
	localStorage.setItem(STORAGE_KEY, serialized);
	if (location.protocol === 'file:') return;
	persistenceQueue = persistenceQueue.catch(() => {}).then(async () => {
		const response = await fetch('./api/data', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: serialized
		});
		if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
	}).catch((error) => {
		console.warn('No se pudo actualizar data.json:', error);
	});
}

function isAdmin(user = currentUser) {
	return user?.role === 'Administrador';
}

function canManageCatalog(user = currentUser) {
	return isAdmin(user) || user?.role === 'Delegado';
}

function canApproveReplenishment(user = currentUser) {
	return isAdmin(user) || user?.role === 'Delegado';
}

function hasDataCollections(data) {
	return data && typeof data === 'object' && ['products', 'suppliers', 'transactions', 'users', 'replenishments'].every((key) => Array.isArray(data[key]));
}

function normalizeState(savedState) {
	const normalized = { ...structuredClone(SEED_DATA), ...savedState };
	normalized.users = (savedState.users ?? SEED_DATA.users).map((user) => ({ ...user, active: user.active !== false }));
	if (!normalized.users.some((user) => user.username === 'delegado')) {
		normalized.users.push(structuredClone(SEED_DATA.users.find((user) => user.username === 'delegado')));
	}
	return normalized;
}

// Prefiere el estado compartido del servidor y usa localStorage solo como respaldo sin backend.
async function loadData() {
	try {
		const response = await fetch('./api/data', { cache: 'no-store' });
		if (response.ok) {
			const serverState = await response.json();
			if (hasDataCollections(serverState)) {
				state = normalizeState(serverState);
				const serialized = JSON.stringify(state);
				localStorage.setItem(STORAGE_KEY, serialized);
				if (JSON.stringify(serverState) !== serialized) saveData();
				return;
			}
		}
	} catch {
		// Static hosting keeps working from the browser's saved copy below.
	}

	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		try {
			const savedState = JSON.parse(saved);
			if (!hasDataCollections(savedState)) throw new Error('Estado local inválido');
			state = normalizeState(savedState);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			return;
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
	try {
		const response = await fetch('./data.json', { cache: 'no-store' });
		if (!response.ok) throw new Error('No fue posible leer data.json');
		const seedState = await response.json();
		state = hasDataCollections(seedState) ? normalizeState(seedState) : structuredClone(SEED_DATA);
	} catch {
		state = structuredClone(SEED_DATA);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function syncServerState() {
	if (!currentUser || serverSyncInProgress || location.protocol === 'file:') return;
	serverSyncInProgress = true;
	try {
		await persistenceQueue.catch(() => {});
		const localSnapshot = localStorage.getItem(STORAGE_KEY);
		const response = await fetch('./api/data', { cache: 'no-store' });
		if (!response.ok) return;
		const serverState = await response.json();
		if (!hasDataCollections(serverState)) return;
		const nextState = normalizeState(serverState);
		const serialized = JSON.stringify(nextState);
		if (serialized === JSON.stringify(state) || localStorage.getItem(STORAGE_KEY) !== localSnapshot) return;
		const inventoryChanged = JSON.stringify(state.products) !== JSON.stringify(nextState.products) || JSON.stringify(state.suppliers) !== JSON.stringify(nextState.suppliers);
		state = nextState;
		currentUser = state.users.find((user) => user.id === localStorage.getItem(SESSION_KEY) && user.active !== false) ?? null;
		if (!currentUser) {
			showLogin();
			return;
		}
		localStorage.setItem(STORAGE_KEY, serialized);
		render();
		setView(location.hash.slice(1) || 'dashboard');
		if (inventoryChanged) scheduleGeminiAnalysis();
	} catch (error) {
		console.warn('No se pudieron sincronizar los datos del servidor:', error);
	} finally {
		serverSyncInProgress = false;
	}
}

function startServerSync() {
	clearInterval(serverSyncTimer);
	serverSyncTimer = setInterval(syncServerState, 3000);
}

function supplierName(supplierId) {
	return state.suppliers.find((supplier) => supplier.id === supplierId)?.name ?? 'Sin proveedor';
}

function stockStatus(product) {
	// La mitad del mínimo marca una alerta crítica; debajo del mínimo marca stock bajo.
	if (product.stock <= Math.max(2, Math.floor(product.minimumStock / 2))) return 'critical';
	if (product.stock < product.minimumStock) return 'low';
	return 'healthy';
}

function statusLabel(status) {
	return ({ critical: 'Crítico', low: 'Bajo', healthy: 'Saludable' })[status];
}

// La cobertura objetivo contempla el plazo del proveedor más 7 días de seguridad.
function getRecommendations() {
	return state.products.map((product) => {
		const history = product.salesHistory?.length ? product.salesHistory : [0];
		// Se usa el promedio guardado para estimar cuánto se vende en un día.
		const dailyDemand = history.reduce((sum, amount) => sum + amount, 0) / history.length;
		const leadTime = state.suppliers.find((supplier) => supplier.id === product.supplierId)?.leadTimeDays ?? 4;
		const safetyStock = Math.max(5, Math.ceil(dailyDemand * 2));
		const targetStock = Math.max(product.minimumStock, Math.ceil(dailyDemand * leadTime) + safetyStock);
		const quantity = Math.max(0, targetStock - product.stock);
		const coverageDays = dailyDemand > 0 ? Math.floor(product.stock / dailyDemand) : Infinity;
		if (quantity === 0 || (product.stock >= product.minimumStock && coverageDays > leadTime + 7)) return null;
		const alreadyApproved = state.replenishments.some((item) => item.productId === product.id && item.status === 'Aprobado');
		const requestedQuantity = state.replenishments.filter((item) => item.productId === product.id && item.status === 'Solicitado').reduce((sum, item) => sum + item.quantity, 0);
		return { product, dailyDemand, leadTime, targetStock, quantity, coverageDays, alreadyApproved, requestedQuantity };
	}).filter(Boolean).sort((a, b) => a.coverageDays - b.coverageDays);
}

function getVisibleRecommendations() {
	if (!aiRecommendations) return getRecommendations();
	const baseline = new Map(getRecommendations().map((item) => [item.product.id, item]));
	const suggestions = new Map(baseline);
	for (const suggestion of aiRecommendations) {
		const product = state.products.find((item) => item.id === suggestion.productId);
		if (!product || !Number.isInteger(suggestion.recommendedQuantity) || suggestion.recommendedQuantity < 0 || suggestion.recommendedQuantity > 1000000) continue;
		const minimum = Number.isInteger(suggestion.suggestedMinimumStock) ? suggestion.suggestedMinimumStock : product.minimumStock;
		const targetStock = Math.max(5, product.minimumStock, Math.min(1000000, minimum));
		const quantity = Math.min(suggestion.recommendedQuantity, Math.max(0, targetStock - product.stock));
		if (quantity === 0) continue;
		const history = product.salesHistory?.length ? product.salesHistory : [0];
		const dailyDemand = history.reduce((sum, amount) => sum + amount, 0) / history.length;
		const leadTime = state.suppliers.find((supplier) => supplier.id === product.supplierId)?.leadTimeDays ?? 4;
		const prior = baseline.get(product.id);
		const requestedQuantity = state.replenishments.filter((item) => item.productId === product.id && item.status === 'Solicitado').reduce((sum, item) => sum + item.quantity, 0);
		suggestions.set(product.id, {
			product, dailyDemand, leadTime, targetStock, quantity,
			coverageDays: dailyDemand > 0 ? Math.floor(product.stock / dailyDemand) : Infinity,
			alreadyApproved: prior?.alreadyApproved ?? false,
			requestedQuantity,
			urgency: ['urgente', 'pronto', 'preventivo'].includes(suggestion.urgency) ? suggestion.urgency : 'preventivo',
			reason: typeof suggestion.reason === 'string' ? suggestion.reason.slice(0, 240) : ''
		});
	}
	return [...suggestions.values()].sort((left, right) => left.coverageDays - right.coverageDays);
}

function scheduleGeminiAnalysis() {
	if (!geminiApiKey) return;
	clearTimeout(aiAnalysisTimer);
	aiRecommendations = null;
	aiAnalysisStatus = 'pending';
	const requestId = ++aiAnalysisSequence;
	renderRecommendations();
	aiAnalysisTimer = setTimeout(() => runGeminiAnalysis(requestId), 650);
}

async function runGeminiAnalysis(requestId) {
	if (!geminiApiKey || requestId !== aiAnalysisSequence) return;
	aiAnalysisStatus = 'loading';
	renderRecommendations();
	const inventory = state.products.map((product) => {
		const history = product.salesHistory?.length ? product.salesHistory : [0];
		const supplier = state.suppliers.find((item) => item.id === product.supplierId);
		return {
			productId: product.id,
			name: product.name,
			category: product.category,
			stock: product.stock,
			configuredMinimum: product.minimumStock,
			dailyAverage: history.reduce((sum, amount) => sum + amount, 0) / history.length,
			salesHistory: history.slice(-30),
			supplier: supplier?.name ?? 'Sin proveedor',
			leadTimeDays: supplier?.leadTimeDays ?? 4
		};
	});
	try {
		const response = await fetch('./api/gemini/replenishment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ apiKey: geminiApiKey, model: geminiModel, inventory })
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || `Error HTTP ${response.status}`);
		if (requestId !== aiAnalysisSequence) return;
		aiRecommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
		aiAnalysisStatus = 'ready';
		render();
		const urgent = getVisibleRecommendations().filter((item) => item.urgency === 'urgente');
		const signature = urgent.map((item) => `${item.product.id}:${item.quantity}`).sort().join('|');
		if (signature && signature !== lastAlertSignature) showToast(`Gemini detectó ${urgent.length} reposición${urgent.length === 1 ? '' : 'es'} urgentes.`, 'error');
		lastAlertSignature = signature;
	} catch (error) {
		if (requestId !== aiAnalysisSequence) return;
		aiRecommendations = null;
		aiAnalysisStatus = 'error';
		renderRecommendations();
		showToast(`Gemini no pudo analizar el inventario: ${error.message}`, 'error');
	}
}

function render() {
	// Cada cambio vuelve a dibujar los paneles para que todos muestren los mismos datos.
	renderHeader();
	renderDashboard();
	renderInventory();
	renderSuppliers();
	renderUsers();
	renderRecommendations();
	renderReports();
}

function renderHeader() {
	const today = new Date();
	$('#dashboard-date').textContent = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(today).toLocaleUpperCase('es');
	$('#today-label').textContent = new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).format(today);
	$('#user-name').textContent = currentUser.name;
	$('#user-role').textContent = currentUser.role.toUpperCase();
	$('#user-avatar').textContent = currentUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
	$('#add-product-button').hidden = !canManageCatalog();
	$('#supplier-management').hidden = !canManageCatalog();
	$('#admin-nav-link').hidden = !isAdmin();
	$('#app-shell').classList.toggle('is-admin', isAdmin());
	$('#ai-settings-button').classList.toggle('is-configured', Boolean(geminiApiKey));
	$('#ai-settings-button').setAttribute('aria-pressed', String(Boolean(geminiApiKey)));
	$('#export-button').hidden = !canManageCatalog();
	$('#nav-alert-count').textContent = getVisibleRecommendations().filter((item) => !item.alreadyApproved).length;
}

function movementMarkup(transaction) {
	const className = transaction.type.toLowerCase().replaceAll(' ', '-');
	return `<span class="movement-label ${escapeHTML(className)}">${escapeHTML(transaction.type)}</span>`;
}

function transactionRows(transactions, compact = false) {
	if (!transactions.length) return `<div class="empty-state">No hay movimientos para mostrar.</div>`;
	return `<table class="${compact ? '' : 'report-table'}"><thead><tr><th>Fecha</th><th>Movimiento</th><th>Producto</th><th>Cantidad</th><th>Usuario</th>${compact ? '' : '<th>Detalle</th>'}</tr></thead><tbody>${transactions.map((item) => `<tr><td>${dateFormat.format(new Date(item.date))}</td><td>${movementMarkup(item)}</td><td><span class="table-primary">${escapeHTML(item.productName)}</span></td><td>${item.quantity === 0 ? '—' : item.type === 'Solicitud de reposición' ? `${item.quantity} solicitadas` : `${item.type === 'Venta' || item.type === 'Salida' ? '−' : '+'}${item.quantity}`}</td><td>${escapeHTML(item.user)}</td>${compact ? '' : `<td>${escapeHTML(item.note || '—')}</td>`}</tr>`).join('')}</tbody></table>`;
}

function renderDashboard() {
	// Las cifras principales se obtienen directamente del stock y los movimientos guardados.
	const inventoryValue = state.products.reduce((sum, product) => sum + product.stock * product.unitCost, 0);
	const critical = state.products.filter((product) => product.stock < product.minimumStock);
	const sales = state.transactions.filter((item) => item.type === 'Venta');
	const salesUnits = sales.reduce((sum, item) => sum + item.quantity, 0);
	const metrics = [
		['Productos activos', state.products.length, 'Referencias en catálogo', '▧'],
		['Unidades en stock', state.products.reduce((sum, product) => sum + product.stock, 0).toLocaleString('es-MX'), `${critical.length} requieren atención`, '◫'],
		['Valor del inventario', money.format(inventoryValue), 'Costo estimado en existencias', '◇'],
		['Ventas registradas', salesUnits, `${sales.length} movimientos históricos`, '↗']
	];
	$('#metrics-grid').innerHTML = metrics.map(([label, value, foot, icon], index) => `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon" aria-hidden="true">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${index === 1 && critical.length ? `<span class="warning">${critical.length} bajo mínimo</span>` : index === 0 ? '<span class="positive">Catálogo actualizado</span>' : foot}</div></article>`).join('');

	const rotation = [...state.products].map((product) => ({ product, average: product.salesHistory.reduce((sum, amount) => sum + amount, 0) / product.salesHistory.length })).sort((a, b) => b.average - a.average).slice(0, 5);
	const maxAverage = Math.max(...rotation.map((item) => item.average), 1);
	$('#rotation-chart').innerHTML = rotation.map(({ product, average }) => `<div class="rotation-row"><span class="rotation-name" title="${escapeHTML(product.name)}">${escapeHTML(product.name)}</span><div class="rotation-track"><div class="rotation-fill" style="width:${Math.max(4, average / maxAverage * 100)}%"></div></div><span class="rotation-value">${average.toFixed(1)}</span></div>`).join('');

	$('#critical-count').textContent = critical.length;
	const priorityProducts = critical.sort((a, b) => a.stock / Math.max(1, a.minimumStock) - b.stock / Math.max(1, b.minimumStock)).slice(0, 4);
	$('#critical-list').innerHTML = priorityProducts.length ? priorityProducts.map((product) => `<div class="critical-item"><div class="critical-product"><b>${escapeHTML(product.name)}</b><span>${escapeHTML(product.category)} · mínimo ${product.minimumStock}</span></div><span class="stock-pill ${stockStatus(product)}">${product.stock} uds.</span></div>`).join('') : '<div class="empty-state">No hay productos debajo del mínimo.</div>';
	$('#recent-transactions').innerHTML = transactionRows([...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), true);
}

function renderInventory() {
	// La búsqueda, categoría y estado de stock se aplican juntos antes de mostrar la tabla.
	const categories = [...new Set(state.products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'es'));
	const selectedCategory = $('#category-filter').value;
	$('#category-filter').innerHTML = '<option value="">Todas las categorías</option>' + categories.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join('');
	$('#category-filter').value = categories.includes(selectedCategory) ? selectedCategory : '';
	$('#product-supplier').innerHTML = state.suppliers.map((supplier) => `<option value="${escapeHTML(supplier.id)}">${escapeHTML(supplier.name)}</option>`).join('');
	const query = $('#inventory-search').value.trim().toLocaleLowerCase('es');
	const category = $('#category-filter').value;
	const stockFilter = $('#stock-filter').value;
	const filtered = state.products.filter((product) => {
		const matchesText = `${product.name} ${product.category} ${product.id}`.toLocaleLowerCase('es').includes(query);
		const matchesCategory = !category || product.category === category;
		const status = stockStatus(product);
		const matchesStock = !stockFilter || (stockFilter === 'critical' ? status === 'critical' : stockFilter === 'low' ? status !== 'healthy' : status === 'healthy');
		return matchesText && matchesCategory && matchesStock;
	}).sort((a, b) => a.name.localeCompare(b.name, 'es'));
	$('#inventory-count').textContent = `${filtered.length} productos`;
	if (!filtered.length) {
		$('#inventory-table').innerHTML = '<div class="empty-state">No se encontraron productos con esos filtros.</div>';
		return;
	}
	const actionHeader = canManageCatalog() ? '<th>Acciones</th>' : '';
	$('#inventory-table').innerHTML = `<table class="inventory-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Existencia</th><th>Costo unitario</th><th>Valor en stock</th><th>Proveedor</th>${actionHeader}</tr></thead><tbody>${filtered.map((product) => `<tr><td><span class="table-primary">${escapeHTML(product.name)}</span><div class="table-secondary">${escapeHTML(product.id)}</div></td><td>${escapeHTML(product.category)}</td><td><span class="stock-cell"><span class="stock-pill ${stockStatus(product)}">${product.stock} uds. · ${statusLabel(stockStatus(product))}</span></span><div class="table-secondary">Mínimo: ${product.minimumStock}</div></td><td>${money.format(product.unitCost)}</td><td>${money.format(product.stock * product.unitCost)}</td><td>${escapeHTML(supplierName(product.supplierId))}</td>${canManageCatalog() ? `<td><div class="table-actions"><button class="small-action" type="button" data-edit="${escapeHTML(product.id)}">Editar</button></div></td>` : ''}</tr>`).join('')}</tbody></table>`;
}

function renderSuppliers() {
	// Cuenta cuántos productos están asociados a cada proveedor.
	$('#supplier-count').textContent = `${state.suppliers.length} proveedores`;
	$('#suppliers-table').innerHTML = `<table class="management-table"><thead><tr><th>Proveedor</th><th>Plazo de entrega</th><th>Productos asociados</th></tr></thead><tbody>${state.suppliers.map((supplier) => {
		const productCount = state.products.filter((product) => product.supplierId === supplier.id).length;
		return `<tr><td><span class="table-primary">${escapeHTML(supplier.name)}</span></td><td>${supplier.leadTimeDays} días</td><td>${productCount}</td></tr>`;
	}).join('')}</tbody></table>`;
}

function renderUsers() {
	// Cada cuenta puede tener un rol y un estado; el usuario actual no puede bloquearse a sí mismo.
	$('#user-count').textContent = `${state.users.length} cuentas`;
	const activeAdmins = state.users.filter((user) => user.active && user.role === 'Administrador').length;
	$('#users-table').innerHTML = `<table class="management-table users-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${state.users.map((user) => {
		const isCurrentUser = user.id === currentUser.id;
		const isLastActiveAdmin = user.active && user.role === 'Administrador' && activeAdmins <= 1;
		const roleOptions = ['Administrador', 'Delegado', 'Dependiente'].map((role) => `<option value="${role}" ${user.role === role ? 'selected' : ''}>${role}</option>`).join('');
		return `<tr><td><span class="table-primary">${escapeHTML(user.name)}</span><div class="table-secondary">@${escapeHTML(user.username)}${isCurrentUser ? ' · Tú' : ''}</div></td><td><select class="role-select" data-user-role="${escapeHTML(user.id)}" ${isCurrentUser ? 'disabled' : ''}>${roleOptions}</select></td><td><span class="account-status ${user.active ? 'active' : 'inactive'}">${user.active ? 'Activo' : 'Inactivo'}</span></td><td><div class="table-actions"><button class="small-action" type="button" data-user-active="${escapeHTML(user.id)}" ${isCurrentUser ? 'disabled' : ''}>${user.active ? 'Desactivar' : 'Activar'}</button><button class="small-action" type="button" data-user-delete="${escapeHTML(user.id)}" ${isCurrentUser || isLastActiveAdmin ? 'disabled' : ''}>Eliminar</button></div></td></tr>`;
	}).join('')}</tbody></table>`;
}

function renderRecommendations() {
	const recommendations = getVisibleRecommendations();
	const pending = recommendations.filter((item) => !item.alreadyApproved);
	$('#ai-engine-status').textContent = !geminiApiKey || aiAnalysisStatus === 'error' ? 'CÁLCULO LOCAL' : aiAnalysisStatus === 'ready' ? 'GEMINI ACTIVO' : 'GEMINI · ANALIZANDO';
	if (!geminiApiKey) {
		$('#ai-summary').textContent = pending.length ? `Análisis local: ${pending.length} producto${pending.length === 1 ? '' : 's'} requiere${pending.length === 1 ? '' : 'n'} reposición. Configura Gemini para obtener recomendaciones con IA.` : 'Análisis local activo. Configura Gemini para obtener recomendaciones con IA.';
	} else if (aiAnalysisStatus === 'pending' || aiAnalysisStatus === 'loading') {
		$('#ai-summary').textContent = 'Gemini está analizando existencias, demanda e intervalos de entrega...';
	} else if (aiAnalysisStatus === 'error') {
		$('#ai-summary').textContent = 'Gemini no está disponible. Se muestran las recomendaciones calculadas localmente.';
	} else {
		$('#ai-summary').textContent = pending.length ? `Gemini detectó ${pending.length} producto${pending.length === 1 ? '' : 's'} para reponer según demanda, existencias y plazo de entrega.` : 'Gemini no detecta reposiciones pendientes con los datos actuales.';
	}
	$('#analysis-time').textContent = geminiApiKey && aiAnalysisStatus === 'ready' ? `GEMINI · ${new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' }).format(new Date())}` : 'REVISIÓN LOCAL';
	if (!recommendations.length) {
		$('#recommendation-list').innerHTML = '<div class="recommendation-empty">No hay reposiciones pendientes. Las sugerencias se actualizan cuando cambian existencias o demanda.</div>';
		return;
	}
	$('#recommendation-list').innerHTML = recommendations.map(({ product, dailyDemand, leadTime, targetStock, quantity, coverageDays, alreadyApproved, requestedQuantity, urgency, reason }) => {
		const priority = urgency ?? (coverageDays <= leadTime ? 'urgente' : coverageDays <= leadTime + 2 ? 'pronto' : 'preventivo');
		const urgent = priority === 'urgente';
		const estimatedCost = quantity * product.unitCost;
		const orderMoment = coverageDays <= leadTime ? 'Solicitar hoy' : `En ${Math.max(0, coverageDays - leadTime)} días`;
		const approval = alreadyApproved ? '<span class="approved-label">Pedido aprobado</span>' : canApproveReplenishment() ? `<button type="button" class="button button-primary" data-approve="${escapeHTML(product.id)}">Aprobar pedido</button>` : '<span class="approved-label">Pendiente de aprobación</span>';
		return `<article class="recommendation-card"><div class="recommendation-top"><span class="recommendation-category">${escapeHTML(product.category)} · ${escapeHTML(supplierName(product.supplierId))}</span><span class="priority-label ${urgent ? 'urgent' : ''}">${urgent ? 'Urgente' : priority === 'pronto' ? 'Próxima' : 'Preventiva'}</span></div><h3>${escapeHTML(product.name)}</h3><div class="recommendation-stats"><div><span>Cantidad sugerida</span><b>${quantity} unidades</b></div><div><span>Existencia actual</span><b>${product.stock} uds.</b></div><div><span>Cobertura estimada</span><b>${Number.isFinite(coverageDays) ? `${coverageDays} días` : 'Sin demanda'}</b></div></div>${reason ? `<p class="ai-reason">${escapeHTML(reason)}</p>` : ''}<div class="recommendation-foot"><p>${orderMoment} · ${money.format(estimatedCost)} estimados${requestedQuantity ? `<span class="request-total">Solicitudes acumuladas: ${requestedQuantity} uds.</span>` : ''}</p><div class="recommendation-actions"><button type="button" class="button button-secondary" data-request-refill="${escapeHTML(product.id)}">Solicitar relleno</button>${approval}</div></div><div class="table-secondary">Promedio ${dailyDemand.toFixed(1)} uds./día · Entrega ${leadTime} días · Mínimo sugerido ${targetStock} uds.</div></article>`;
	}).join('');
}

function openGeminiSettings() {
	$('#gemini-api-key').value = '';
	availableGeminiModels = [];
	$('#gemini-model').innerHTML = '<option value="">Carga modelos disponibles</option>';
	$('#gemini-config-status').textContent = geminiApiKey ? 'Clave configurada para esta sesión. Puedes reemplazarla o quitarla.' : 'La clave solo se mantiene en memoria hasta cerrar sesión.';
	$('#gemini-settings-dialog').showModal();
}

async function loadGeminiModels() {
	const apiKey = $('#gemini-api-key').value.trim();
	if (!apiKey) {
		$('#gemini-config-status').textContent = 'Ingresa primero tu clave API de Gemini.';
		$('#gemini-api-key').focus();
		return;
	}
	const button = $('#load-gemini-models');
	button.disabled = true;
	button.textContent = 'Consultando modelos...';
	try {
		const response = await fetch('./api/gemini/models', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ apiKey })
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || `Error HTTP ${response.status}`);
		const models = (result.models ?? []).filter((model) => /^gemini-[A-Za-z0-9._-]{1,80}$/.test(model.id));
		if (!models.length) throw new Error('La clave no tiene modelos que admitan generación de contenido.');
		const select = $('#gemini-model');
		availableGeminiModels = models.map((model) => model.id);
		select.innerHTML = models.map((model) => `<option value="${escapeHTML(model.id)}">${escapeHTML(model.name)} · ${escapeHTML(model.id)}</option>`).join('');
		select.value = models.some((model) => model.id === geminiModel) ? geminiModel : models[0].id;
		$('#gemini-config-status').textContent = `${models.length} modelos disponibles para esta clave. Selecciona uno y guarda para analizar.`;
	} catch (error) {
		$('#gemini-config-status').textContent = error.message;
	} finally {
		button.disabled = false;
		button.textContent = 'Cargar modelos disponibles';
	}
}

function saveGeminiSettings() {
	const apiKey = $('#gemini-api-key').value.trim();
	const model = $('#gemini-model').value.trim();
	if (!apiKey || !availableGeminiModels.includes(model)) {
		$('#gemini-config-status').textContent = 'Ingresa tu clave y carga un modelo disponible antes de analizar.';
		return;
	}
	geminiApiKey = apiKey;
	geminiModel = model;
	$('#gemini-api-key').value = '';
	$('#gemini-config-status').textContent = 'Clave guardada solo en memoria para esta sesión.';
	$('#gemini-settings-dialog').close();
	renderHeader();
	scheduleGeminiAnalysis();
}

function clearGeminiSettings() {
	geminiApiKey = '';
	geminiModel = 'gemini-2.5-flash';
	availableGeminiModels = [];
	aiRecommendations = null;
	aiAnalysisStatus = 'local';
	aiAnalysisSequence += 1;
	clearTimeout(aiAnalysisTimer);
	$('#gemini-api-key').value = '';
	$('#gemini-model').innerHTML = '<option value="">Carga modelos disponibles</option>';
	$('#gemini-config-status').textContent = 'Clave quitada. La reposición continúa con el cálculo local.';
	$('#gemini-settings-dialog').close();
	renderHeader();
	renderRecommendations();
}

function handleRefillRequest(event) {
	const button = event.target.closest('[data-request-refill]');
	if (!button || !currentUser || !state.replenishments) return;
	const recommendation = getVisibleRecommendations().find((item) => item.product.id === button.dataset.requestRefill);
	if (!recommendation || recommendation.quantity <= 0) return;
	state.replenishments.push({
		id: `SOL-${Date.now()}-${state.replenishments.length + 1}`,
		productId: recommendation.product.id,
		quantity: recommendation.quantity,
		status: 'Solicitado',
		date: new Date().toISOString(),
		user: currentUser.name
	});
	addTransaction('Solicitud de reposición', recommendation.product, recommendation.quantity, 'Solicitud opcional de relleno');
	saveData();
	render();
	showToast(`Solicitud de ${recommendation.quantity} unidades agregada.`);
}

function getFilteredTransactions() {
	// Las fechas se comparan como año-mes-día para incluir correctamente el día completo.
	const from = $('#report-from').value;
	const to = $('#report-to').value;
	const type = $('#transaction-filter').value;
	return [...state.transactions].filter((transaction) => {
		const day = transaction.date.slice(0, 10);
		return (!from || day >= from) && (!to || day <= to) && (!type || transaction.type === type);
	}).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderReports() {
	const transactions = getFilteredTransactions();
	$('#reports-table').innerHTML = transactionRows(transactions);
	$('#report-result-count').textContent = `${transactions.length} movimiento${transactions.length === 1 ? '' : 's'}`;
	const from = $('#report-from').value;
	const to = $('#report-to').value;
	$('#report-period-label').textContent = from || to ? `${from || 'Inicio'} — ${to || 'Hoy'}` : 'Historial completo';
}

function setView(view) {
	// Solo se muestra una sección a la vez; el nombre de la vista también queda en la dirección.
	const allowedViews = ['dashboard', 'inventory', 'replenishment', 'reports', 'users'];
	if (!allowedViews.includes(view) || (view === 'users' && !isAdmin())) view = 'dashboard';
	$$('.view').forEach((section) => section.classList.toggle('is-visible', section.id === `view-${view}`));
	$$('.nav-link').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
	const label = ({ dashboard: 'Panel general', inventory: 'Inventario', replenishment: 'Reposición IA', reports: 'Reportes e historial', users: 'Gestión de usuarios' })[view];
	$('#topbar-section').textContent = label;
	history.replaceState(null, '', `#${view}`);
	if (view === 'inventory') renderInventory();
	if (view === 'replenishment') renderRecommendations();
	if (view === 'reports') renderReports();
	if (view === 'users') renderUsers();
}

function showToast(message, type = 'success') {
	const toast = document.createElement('div');
	toast.className = `toast${type === 'error' ? ' error' : ''}`;
	toast.textContent = message;
	$('#toast-region').replaceChildren(toast);
	clearTimeout(toastTimeout);
	toastTimeout = setTimeout(() => toast.remove(), 3200);
}

function showApp() {
	$('#login-screen').hidden = true;
	$('#app-shell').hidden = false;
	render();
	const requestedView = location.hash.slice(1);
	setView(requestedView || 'dashboard');
	startServerSync();
}

function showLogin() {
	currentUser = null;
	clearInterval(serverSyncTimer);
	geminiApiKey = '';
	geminiModel = 'gemini-2.5-flash';
	aiRecommendations = null;
	aiAnalysisStatus = 'local';
	aiAnalysisSequence += 1;
	clearTimeout(aiAnalysisTimer);
	if ($('#gemini-settings-dialog').open) $('#gemini-settings-dialog').close();
	localStorage.removeItem(SESSION_KEY);
	$('#app-shell').hidden = true;
	$('#login-screen').hidden = false;
}

function addTransaction(type, product, quantity, note) {
	// Todas las acciones importantes guardan quién las realizó y cuándo ocurrieron.
	state.transactions.unshift({
			id: `MOV-${Date.now()}-${state.transactions.length + 1}`,
		date: new Date().toISOString(),
		type,
		productId: product.id,
		productName: product.name,
		quantity,
		user: currentUser.name,
		note
	});
}

function openProductForm(product = null) {
	if (!canManageCatalog()) return;
	$('#product-form').reset();
	$('#product-form-error').hidden = true;
	$('#product-id').value = product?.id ?? '';
	$('#product-form-title').textContent = product ? 'Editar producto' : 'Agregar producto';
	$('#product-name').value = product?.name ?? '';
	$('#product-category').value = product?.category ?? '';
	$('#product-stock').value = product?.stock ?? 0;
	$('#product-minimum').value = product?.minimumStock ?? 1;
	$('#product-cost').value = product?.unitCost ?? '';
	$('#product-supplier').value = product?.supplierId ?? state.suppliers[0]?.id ?? '';
	$('#product-form-wrap').hidden = false;
	$('#product-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
	$('#product-name').focus();
}

function exportCSV() {
	// El reporte usa los mismos filtros que están activos en pantalla.
	const rows = getFilteredTransactions();
	const header = ['ID', 'Fecha', 'Movimiento', 'Producto', 'Cantidad', 'Usuario', 'Detalle'];
	const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
	// El BOM ayuda a conservar los acentos al abrir el archivo en hojas de cálculo.
	const csv = [header, ...rows.map((item) => [item.id, item.date, item.type, item.productName, item.quantity, item.user, item.note])].map((row) => row.map(csvEscape).join(',')).join('\r\n');
	const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `invgest-reporte-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
	showToast(`${rows.length} movimientos exportados.`);
}

// Gestiona el inicio de sesión y devuelve al usuario a su sesión local.
function handleLogin(event) {
	event.preventDefault();
	const username = $('#login-username').value.trim();
	const password = $('#login-password').value;
	const user = state.users.find((item) => item.username === username && item.password === password && item.active !== false);
	if (!user) {
		$('#login-error').textContent = 'Usuario o contraseña incorrectos.';
		$('#login-error').hidden = false;
		return;
	}
	geminiApiKey = '';
	geminiModel = 'gemini-2.5-flash';
	aiRecommendations = null;
	aiAnalysisStatus = 'local';
	currentUser = user;
	localStorage.setItem(SESSION_KEY, user.id);
	$('#login-error').hidden = true;
	showApp();
}

// Valida y guarda cambios del catálogo desde el formulario compartido.
function handleProductSubmit(event) {
	event.preventDefault();
	if (!canManageCatalog()) return;
	const id = $('#product-id').value;
	const name = $('#product-name').value.trim();
	const category = $('#product-category').value.trim();
	const stock = Number($('#product-stock').value);
	const minimumStock = Number($('#product-minimum').value);
	const unitCost = Number($('#product-cost').value);
	const duplicate = state.products.some((product) => product.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es') && product.id !== id);
	if (!name || !category || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(minimumStock) || minimumStock < 0 || !Number.isFinite(unitCost) || unitCost <= 0) {
		$('#product-form-error').textContent = 'Revisa los campos: existencias enteras y costo mayor a cero.';
		$('#product-form-error').hidden = false;
		return;
	}
	if (duplicate) {
		$('#product-form-error').textContent = 'Ya existe un producto con ese nombre.';
		$('#product-form-error').hidden = false;
		return;
	}
	const existing = state.products.find((product) => product.id === id);
	if (existing) {
		const previous = { ...existing };
		Object.assign(existing, { name, category, stock, minimumStock, unitCost, supplierId: $('#product-supplier').value });
		if (stock !== previous.stock) {
			const quantity = Math.abs(stock - previous.stock);
			addTransaction(stock > previous.stock ? 'Entrada' : 'Salida', existing, quantity, 'Ajuste de existencias');
		} else if (['name', 'category', 'minimumStock', 'unitCost', 'supplierId'].some((key) => existing[key] !== previous[key])) {
			addTransaction('Actualización', existing, 0, 'Ficha del producto actualizada');
		}
		showToast('Producto actualizado correctamente.');
	} else {
		const product = { id: `P-${Date.now().toString().slice(-7)}`, name, category, stock, minimumStock, unitCost, supplierId: $('#product-supplier').value, salesHistory: Array(14).fill(0) };
		state.products.push(product);
		addTransaction(stock > 0 ? 'Entrada' : 'Actualización', product, stock, stock > 0 ? 'Stock inicial' : 'Producto creado sin existencias');
		showToast('Producto agregado al inventario.');
	}
	saveData();
	$('#product-form-wrap').hidden = true;
	render();
	scheduleGeminiAnalysis();
}

// Crea proveedores únicos y valida su plazo de entrega.
function handleSupplierSubmit(event) {
	event.preventDefault();
	if (!canManageCatalog()) return;
	const name = $('#supplier-name').value.trim();
	const leadTimeDays = Number($('#supplier-lead-time').value);
	const duplicate = state.suppliers.some((supplier) => supplier.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'));
	if (!name || !Number.isInteger(leadTimeDays) || leadTimeDays < 1 || leadTimeDays > 365) {
		$('#supplier-form-error').textContent = 'Indica un nombre y un plazo de entrega válido.';
		$('#supplier-form-error').hidden = false;
		return;
	}
	if (duplicate) {
		$('#supplier-form-error').textContent = 'Ya existe un proveedor con ese nombre.';
		$('#supplier-form-error').hidden = false;
		return;
	}
	state.suppliers.push({ id: `prov-${Date.now()}`, name, leadTimeDays });
	saveData();
	$('#supplier-form').reset();
	$('#supplier-lead-time').value = 3;
	$('#supplier-form-error').hidden = true;
	render();
	showToast('Proveedor agregado correctamente.');
}

// Crea cuentas locales después de validar identidad y permisos.
function handleUserSubmit(event) {
	event.preventDefault();
	if (!isAdmin()) return;
	const name = $('#account-name').value.trim();
	const username = $('#account-username').value.trim().toLocaleLowerCase('es');
	const password = $('#account-password').value;
	const role = $('#account-role').value;
	const duplicate = state.users.some((user) => user.username.toLocaleLowerCase('es') === username);
	if (!name || !/^[a-z0-9._-]{3,32}$/.test(username) || password.length < 6) {
		$('#user-form-error').textContent = 'Revisa el nombre, usuario (3 a 32 caracteres) y contraseña (mínimo 6).';
		$('#user-form-error').hidden = false;
		return;
	}
	if (duplicate) {
		$('#user-form-error').textContent = 'Ese nombre de usuario ya está registrado.';
		$('#user-form-error').hidden = false;
		return;
	}
	if (!['Administrador', 'Delegado', 'Dependiente'].includes(role)) return;
	state.users.push({ id: `usr-${Date.now()}`, username, password, name, role, active: true });
	saveData();
	$('#user-form').reset();
	$('#user-form-error').hidden = true;
	render();
	showToast('Usuario creado correctamente.');
}

// Actualiza roles sin permitir que desaparezca el último administrador activo.
function handleUserRoleChange(event) {
	const select = event.target.closest('[data-user-role]');
	if (!select || !isAdmin()) return;
	if (!['Administrador', 'Delegado', 'Dependiente'].includes(select.value)) {
		renderUsers();
		return;
	}
	const user = state.users.find((item) => item.id === select.dataset.userRole);
	if (!user) return;
	const activeAdmins = state.users.filter((item) => item.active && item.role === 'Administrador').length;
	if (user.active && user.role === 'Administrador' && select.value !== 'Administrador' && activeAdmins <= 1) {
		showToast('Debe permanecer al menos un administrador activo.', 'error');
		renderUsers();
		return;
	}
	user.role = select.value;
	saveData();
	render();
	showToast(`Rol actualizado para ${user.name}.`);
}

// Activa o desactiva una cuenta protegiendo el último administrador.
function handleUserStatusClick(event) {
	const button = event.target.closest('[data-user-active]');
	if (!button || !isAdmin()) return;
	const user = state.users.find((item) => item.id === button.dataset.userActive);
	if (!user || user.id === currentUser.id) return;
	const activeAdmins = state.users.filter((item) => item.active && item.role === 'Administrador').length;
	if (user.active && user.role === 'Administrador' && activeAdmins <= 1) {
		showToast('Debe permanecer al menos un administrador activo.', 'error');
		return;
	}
	user.active = !user.active;
	saveData();
	render();
	showToast(`Cuenta ${user.active ? 'activada' : 'desactivada'}.`);
}

function handleUserDeleteClick(event) {
	const button = event.target.closest('[data-user-delete]');
	if (!button || !isAdmin()) return;
	const user = state.users.find((item) => item.id === button.dataset.userDelete);
	if (!user || user.id === currentUser.id) return;
	const activeAdmins = state.users.filter((item) => item.active && item.role === 'Administrador').length;
	if (user.active && user.role === 'Administrador' && activeAdmins <= 1) {
		showToast('Debe permanecer al menos un administrador activo.', 'error');
		return;
	}
	if (!window.confirm(`¿Eliminar la cuenta de ${user.name} (@${user.username})?`)) return;
	state.users = state.users.filter((item) => item.id !== user.id);
	saveData();
	render();
	showToast('Usuario eliminado correctamente.');
}

// Convierte acciones de edición de la tabla en apertura del formulario.
function handleInventoryTableClick(event) {
	const editButton = event.target.closest('[data-edit]');
	if (editButton && canManageCatalog()) {
		openProductForm(state.products.find((product) => product.id === editButton.dataset.edit));
	}
}

// Registra una reposición aprobada como pedido y movimiento de inventario.
function handleReplenishmentApproval(event) {
	const button = event.target.closest('[data-approve]');
	if (!button || !canApproveReplenishment()) return;
	const recommendation = getRecommendations().find((item) => item.product.id === button.dataset.approve);
	if (!recommendation || recommendation.alreadyApproved) return;
	state.replenishments.push({ id: `REP-${Date.now()}`, productId: recommendation.product.id, quantity: recommendation.quantity, status: 'Aprobado', date: new Date().toISOString(), user: currentUser.name });
	addTransaction('Pedido aprobado', recommendation.product, recommendation.quantity, `Reposición · ${supplierName(recommendation.product.supplierId)}`);
	saveData();
	render();
	showToast(`Pedido de ${recommendation.quantity} unidades aprobado.`);
}

// Conecta navegación y controles comunes de la aplicación.
function bindNavigationEvents() {
	$('#logout-button').addEventListener('click', showLogin);
	$$('.nav-link').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
	$$('[data-goto]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.goto)));
	window.addEventListener('hashchange', () => {
		const requestedView = location.hash.slice(1);
		if (currentUser) setView(requestedView);
	});
	window.addEventListener('storage', (event) => {
		if (event.key !== STORAGE_KEY || !event.newValue) return;
		try {
			const previousState = event.oldValue ? JSON.parse(event.oldValue) : null;
			const savedState = JSON.parse(event.newValue);
			if (!savedState || typeof savedState !== 'object') return;
			state = { ...structuredClone(SEED_DATA), ...savedState };
			state.users = (savedState.users ?? SEED_DATA.users).map((user) => ({ ...user, active: user.active !== false }));
			currentUser = state.users.find((user) => user.id === localStorage.getItem(SESSION_KEY) && user.active) ?? null;
			if (!currentUser) {
				showLogin();
				return;
			}
			render();
			setView(location.hash.slice(1) || 'dashboard');
			if (previousState && (JSON.stringify(previousState.products) !== JSON.stringify(savedState.products) || JSON.stringify(previousState.suppliers) !== JSON.stringify(savedState.suppliers))) scheduleGeminiAnalysis();
		} catch {
			console.warn('No se pudieron cargar los cambios de otra pestaña.');
		}
	});
}

// Conecta el catálogo, sus filtros y las acciones sobre proveedores.
function bindCatalogEvents() {
	$('#add-product-button').addEventListener('click', () => openProductForm());
	$('#close-product-form').addEventListener('click', () => { $('#product-form-wrap').hidden = true; });
	$('#inventory-search').addEventListener('input', renderInventory);
	$('#category-filter').addEventListener('change', renderInventory);
	$('#stock-filter').addEventListener('change', renderInventory);
	$('#product-form').addEventListener('submit', handleProductSubmit);
	$('#supplier-form').addEventListener('submit', handleSupplierSubmit);
	$('#inventory-table').addEventListener('click', handleInventoryTableClick);
}

// Conecta la creación y administración de cuentas.
function bindUserEvents() {
	$('#user-form').addEventListener('submit', handleUserSubmit);
	$('#users-table').addEventListener('change', handleUserRoleChange);
	$('#users-table').addEventListener('click', handleUserStatusClick);
	$('#users-table').addEventListener('click', handleUserDeleteClick);
}

// Conecta filtros, exportación y aprobación de reposiciones.
function bindReportAndReplenishmentEvents() {
	$('#recommendation-list').addEventListener('click', handleReplenishmentApproval);
	$('#recommendation-list').addEventListener('click', handleRefillRequest);
	$('#report-filters').addEventListener('submit', (event) => { event.preventDefault(); renderReports(); });
	$('#clear-report-filters').addEventListener('click', () => { $('#report-filters').reset(); renderReports(); });
	$('#export-button').addEventListener('click', () => { if (canManageCatalog()) exportCSV(); });
}

function bindGeminiEvents() {
	$('#ai-settings-button').addEventListener('click', openGeminiSettings);
	$('#close-gemini-settings').addEventListener('click', () => {
		$('#gemini-settings-dialog').close();
		$('#gemini-api-key').value = '';
	});
	$('#gemini-settings-dialog').addEventListener('close', () => { $('#gemini-api-key').value = ''; });
	$('#load-gemini-models').addEventListener('click', loadGeminiModels);
	$('#save-gemini-settings').addEventListener('click', saveGeminiSettings);
	$('#clear-gemini-key').addEventListener('click', clearGeminiSettings);
}

function bindEvents() {
	// Cada grupo registra únicamente los eventos de una responsabilidad concreta.
	$('#login-form').addEventListener('submit', handleLogin);
	bindNavigationEvents();
	bindCatalogEvents();
	bindUserEvents();
	bindReportAndReplenishmentEvents();
	bindGeminiEvents();
}

async function initialize() {
	// Al abrir la página, primero se cargan los datos y luego se recupera la sesión guardada.
	await loadData();
	bindEvents();
	const sessionId = localStorage.getItem(SESSION_KEY);
	currentUser = state.users.find((user) => user.id === sessionId && user.active !== false) ?? null;
	if (currentUser) showApp();
	else $('#login-screen').hidden = false;
}

initialize();
