const Transaction = require('../models/Transaction');

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user._id;

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Category-wise breakdown
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      incomeByCategory,
      expensesByCategory,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyTrends = Array(12).fill(0).map((_, i) => ({
      month: i + 1,
      income: 0,
      expenses: 0
    }));

    monthlyData.forEach(item => {
      const monthIndex = item._id.month - 1;
      if (item._id.type === 'income') {
        monthlyTrends[monthIndex].income = item.total;
      } else {
        monthlyTrends[monthIndex].expenses = item.total;
      }
    });

    res.json(monthlyTrends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getMonthlyTrends,
};