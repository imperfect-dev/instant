const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Backup methods
  async getBackups(params?: { page?: number; limit?: number; status?: string; type?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/backups${queryString}`);
  }

  async createBackup(data: { name: string; type: string; files?: any[] }) {
    return this.request('/backups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBackup(id: string) {
    return this.request(`/backups/${id}`);
  }

  async updateBackup(id: string, data: any) {
    return this.request(`/backups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBackup(id: string) {
    return this.request(`/backups/${id}`, {
      method: 'DELETE',
    });
  }

  async getBackupStats() {
    return this.request('/backups/stats/overview');
  }

  // Analytics methods
  async getDashboardAnalytics(timeRange?: string) {
    const queryString = timeRange ? `?timeRange=${timeRange}` : '';
    return this.request(`/analytics/dashboard${queryString}`);
  }

  async getPerformanceMetrics(timeRange?: string) {
    const queryString = timeRange ? `?timeRange=${timeRange}` : '';
    return this.request(`/analytics/performance${queryString}`);
  }

  // Schedule methods
  async getSchedules() {
    return this.request('/schedules');
  }

  async createSchedule(data: any) {
    return this.request('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(id: string, data: any) {
    return this.request(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(id: string) {
    return this.request(`/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  // File methods
  async uploadFiles(files: FormData) {
    return this.request('/files/upload', {
      method: 'POST',
      body: files,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async downloadFile(filename: string) {
    const response = await fetch(`${API_BASE_URL}/files/download/${filename}`);
    return response.blob();
  }

  async deleteFile(filename: string) {
    return this.request(`/files/${filename}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;