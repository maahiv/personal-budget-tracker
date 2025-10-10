class BudgetTrackerApp {
    constructor() {
        this.auth = auth;
        this.currentMonth = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.updateMonthDisplay();
    }

    checkAuth() {
        if (this.auth.isAuthenticated()) {
            this.showDashboard();
            this.updateAuthUI();
            this.loadDashboard();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Auth forms
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form')?.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Transaction form
        document.getElementById('transaction-form')?.addEventListener('submit', (e) => this.handleAddTransaction(e));
        document.getElementById('add-transaction-btn')?.addEventListener('click', () => this.showTransactionModal());
        document.getElementById('cancel-btn')?.addEventListener('click', () => this.hideTransactionModal());
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());
        
        // Month navigation
        document.getElementById('prev-month')?.addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month')?.addEventListener('click', () => this.changeMonth(1));
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const result = await this.auth.login(email, password);
        
        if (result.success) {
            this.showDashboard();
            this.updateAuthUI();
            this.loadDashboard();
        } else {
            alert('Login failed: ' + result.error);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        const result = await this.auth.register(name, email, password);
        
        if (result.success) {
            this.showDashboard();
            this.updateAuthUI();
            this.loadDashboard();
        } else {
            alert('Registration failed: ' + result.error);
        }
    }

    async handleAddTransaction(e) {
        e.preventDefault();
        
        const transactionData = {
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            amount: parseFloat(document.getElementById('amount').value),
            description: document.getElementById('description').value,
            date: document.getElementById('date').value
        };

        try {
            await transactions.addTransaction(transactionData);
            this.hideTransactionModal();
            this.loadDashboard();
            document.getElementById('transaction-form').reset();
        } catch (error) {
            alert('Failed to add transaction: ' + error.message);
        }
    }

    async loadDashboard() {
        if (!this.auth.isAuthenticated()) return;

        try {
            // Load summary
            const summary = await dashboard.getDashboardSummary(this.currentMonth, this.currentYear);
            if (summary) {
                this.updateSummaryUI(summary);
                budgetCharts.renderIncomeChart(summary.incomeByCategory);
                budgetCharts.renderExpenseChart(summary.expensesByCategory);
            }

            // Load transactions
            const transactionsList = await transactions.getTransactions();
            this.renderTransactions(transactionsList);

            // Load trends
            const trends = await dashboard.getMonthlyTrends(this.currentYear);
            budgetCharts.renderMonthlyTrends(trends);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateSummaryUI(summary) {
        document.getElementById('total-income').textContent = summary.totalIncome.toFixed(2);
        document.getElementById('total-expenses').textContent = summary.totalExpenses.toFixed(2);
        document.getElementById('balance').textContent = summary.balance.toFixed(2);
        
        // Update balance color based on value
        const balanceElement = document.getElementById('balance');
        if (summary.balance >= 0) {
            balanceElement.style.color = '#27ae60';
        } else {
            balanceElement.style.color = '#e74c3c';
        }
    }

    renderTransactions(transactionsList) {
        const container = document.getElementById('transactions-list');
        if (!container) return;

        if (transactionsList.length === 0) {
            container.innerHTML = '<p class="no-data">No transactions found. Add your first transaction!</p>';
            return;
        }

        container.innerHTML = '';

        transactionsList.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = `transaction-item ${transaction.type}`;
            transactionElement.innerHTML = `
                <div class="transaction-info">
                    <span class="category">${transaction.category}</span>
                    <span class="description">${transaction.description}</span>
                    <span class="date">${new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                <div class="transaction-amount">
                    <span class="amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                    </span>
                    <button class="delete-btn" data-id="${transaction._id}">Delete</button>
                </div>
            `;
            container.appendChild(transactionElement);
        });

        // Add delete event listeners
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this transaction?')) {
                    try {
                        await transactions.deleteTransaction(id);
                        this.loadDashboard();
                    } catch (error) {
                        alert('Failed to delete transaction: ' + error.message);
                    }
                }
            });
        });
    }

    showLogin() {
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        document.querySelector('.user-section').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.querySelector('.user-section').classList.remove('hidden');
    }

    showTransactionModal() {
        // Set today's date as default
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.getElementById('transaction-modal').classList.remove('hidden');
    }

    hideTransactionModal() {
        document.getElementById('transaction-modal').classList.add('hidden');
    }

    updateAuthUI() {
        if (this.auth.isAuthenticated()) {
            document.getElementById('user-info').textContent = `Welcome, ${this.auth.user.name}`;
        }
    }

    handleLogout() {
        this.auth.logout();
        this.showLogin();
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth > 12) {
            this.currentMonth = 1;
            this.currentYear++;
        } else if (this.currentMonth < 1) {
            this.currentMonth = 12;
            this.currentYear--;
        }
        this.updateMonthDisplay();
        this.loadDashboard();
    }

    updateMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('current-month').textContent = `${monthNames[this.currentMonth - 1]} ${this.currentYear}`;
    }
}

// Add no-data style to CSS
const style = document.createElement('style');
style.textContent = `
    .no-data {
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        padding: 2rem;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BudgetTrackerApp();
});