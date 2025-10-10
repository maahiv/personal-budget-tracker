const Transaction = require('../models/Transaction');

// Get all transactions for user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date: date || new Date()
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};