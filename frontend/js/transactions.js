class Transactions {
    constructor() {
        this.auth = auth;
    }

    async getTransactions() {
        try {
            const response = await fetch(`${API_BASE}/transactions`, {
                headers: this.auth.getAuthHeaders(),
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    async addTransaction(transactionData) {
        try {
            const response = await fetch(`${API_BASE}/transactions`, {
                method: 'POST',
                headers: this.auth.getAuthHeaders(),
                body: JSON.stringify(transactionData),
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async updateTransaction(id, transactionData) {
        try {
            const response = await fetch(`${API_BASE}/transactions/${id}`, {
                method: 'PUT',
                headers: this.auth.getAuthHeaders(),
                body: JSON.stringify(transactionData),
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to update transaction');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async deleteTransaction(id) {
        try {
            const response = await fetch(`${API_BASE}/transactions/${id}`, {
                method: 'DELETE',
                headers: this.auth.getAuthHeaders(),
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to delete transaction');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
}

const transactions = new Transactions();