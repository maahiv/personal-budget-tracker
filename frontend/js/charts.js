class BudgetCharts {
    constructor() {
        this.incomeChart = null;
        this.expenseChart = null;
        this.trendsChart = null;
    }

    renderIncomeChart(incomeByCategory) {
        const ctx = document.getElementById('incomeChart');
        if (!ctx) return;
        
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }

        const categories = Object.keys(incomeByCategory);
        const amounts = Object.values(incomeByCategory);

        // If no data, show message
        if (categories.length === 0) {
            ctx.parentElement.innerHTML = '<p class="no-data">No income data available</p>';
            return;
        }

        this.incomeChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
                        '#FFC107', '#FF9800', '#FF5722', '#795548'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Income by Category',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderExpenseChart(expensesByCategory) {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;
        
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        const categories = Object.keys(expensesByCategory);
        const amounts = Object.values(expensesByCategory);

        // If no data, show message
        if (categories.length === 0) {
            ctx.parentElement.innerHTML = '<p class="no-data">No expense data available</p>';
            return;
        }

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: [
                        '#F44336', '#E91E63', '#9C27B0', '#673AB7',
                        '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expenses by Category',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderMonthlyTrends(monthlyTrends) {
        const ctx = document.getElementById('trendsChart');
        if (!ctx) return;
        
        if (this.trendsChart) {
            this.trendsChart.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const income = monthlyTrends.map(t => t.income);
        const expenses = monthlyTrends.map(t => t.expenses);

        this.trendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: income,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expenses,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Trends',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    }
}

const budgetCharts = new BudgetCharts();