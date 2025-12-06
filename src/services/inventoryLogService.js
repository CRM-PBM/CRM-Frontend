import api from './authService';

const INVENTORY_API = '/inventory';
const PRODUCTS_API = '/produk';

const inventoryLogService = {
    getProducts: async () => {
        const response = await api.get(`${PRODUCTS_API}?limit=1000`);
        return response.data;
    },

    getInventoryLogs: async (filters = {}) => {
        const response = await api.get(`${INVENTORY_API}/logs`, { params: filters });
        return response.data; 
    },

    getStatistics: async () => {
        const response = await api.get(`${INVENTORY_API}/statistik`);
        return response.data;
    },

    stockIn: async (data) => {
        const response = await api.post(`${INVENTORY_API}/stock-in`, data);
        return response.data;
    },

    adjustStock: async (data) => {
        const response = await api.post(`${INVENTORY_API}/adjust`, data);
        return response.data;
    },
};

export default inventoryLogService;