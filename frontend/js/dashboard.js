class Dashboard {
    constructor() {
        this.auth = auth;
    }

    async getDashboardSummary(month, year) {
        try {
            const response = await fetch(`${API_BASE}/dashboard/summary?month=${month}&year=${year}`, {
                headers: this.auth.getAuthHeaders(),
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch dashboard summary');
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            return null;
        }
    }

    async getMonthlyTrends(year) {
        try {
            const response = await fetch(`${API_BASE}/dashboard/trends?year=${year}`, {
                headers: this.auth.getAuthHeaders(),
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch trends');
            }
        } catch (error) {
            console.error('Error fetching trends:', error);
            return [];
        }
    }
}

const dashboard = new Dashboard();