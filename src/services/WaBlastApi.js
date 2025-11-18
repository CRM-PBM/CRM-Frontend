import api from "./authService";

const WABLAST_URL = "/wa-blast";

export const waBlastService = {
  getStatus: async () => {
    const response = await api.get(`${WABLAST_URL}/status`);
    return response.data;
  },

  connect: async () => {
    const response = await api.post(`${WABLAST_URL}/connect`);
    return response.data;
  },

  disconnect: async () => {
    const response = await api.delete(`${WABLAST_URL}/logout`);
    return response.data;
  },

  sendBlast: async (data) => {
    const response = await api.post(`${WABLAST_URL}/send`, data);
    return response.data;
  },

  getLogs: async () => {
    const response = await api.get(`${WABLAST_URL}/logs`);
    return response.data;
  },

  getBroadcastDetails: async (broadcastId) => {
    const response = await api.get(`${WABLAST_URL}/logs/${broadcastId}`);
    return response.data.data; // langsung array log penerima
  },

  getCustomers: async (limit = 100) => {
    const response = await api.get(`/pelanggan?limit=${limit}`);
    return response.data?.data || response.data || [];
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`${WABLAST_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (!response.data.success)
      throw new Error(response.data.message || "Upload gagal");
    return response.data.localPath;
  },

  getStats: async () => {
    const response = await api.get(`${WABLAST_URL}/statistics`);
    return response.data;
  },

  openMedia: async (mediaPath) => {
    try {
      const response = await api.get(`${WABLAST_URL}/${mediaPath}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
      window.open(url, "_blank");
    } catch (err) {
      console.error("Gagal buka media:", err);
    }
  }
};
