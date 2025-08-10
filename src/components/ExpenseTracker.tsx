import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Tag, Trash2, Edit3, Receipt } from 'lucide-react';
import { useData, Transaction } from '../contexts/DataContext';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ExpenseForm {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
  businessRelated: boolean;
}

const categories = {
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Other Income'],
  expense: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other']
};

export const ExpenseTracker: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExpenseForm>();
  const watchType = watch('type', 'expense');

  const onSubmit = (data: ExpenseForm) => {
    const transactionData = {
      ...data,
      date: new Date(data.date),
      currency: 'KES',
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      toast.success('Transaction updated successfully!');
      setEditingTransaction(null);
    } else {
      addTransaction(transactionData);
      toast.success('Transaction added successfully!');
    }

    reset();
    setShowForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    reset({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: format(transaction.date, 'yyyy-MM-dd'),
      recurring: transaction.recurring || false,
      businessRelated: transaction.businessRelated || false,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      toast.success('Transaction deleted successfully!');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            Expense Tracker
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Track your daily income and expenses
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true);
            setEditingTransaction(null);
            reset();
          }}
          className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Receipt className="w-8 h-8 text-lime-accent" />
            <span className="text-sm text-lime-accent font-medium">Total Income</span>
          </div>
          <h3 className="text-3xl font-bold text-lime-accent font-editorial">
            KES {totalIncome.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Receipt className="w-8 h-8 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Total Expenses</span>
          </div>
          <h3 className="text-3xl font-bold text-red-400 font-editorial">
            KES {totalExpenses.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            totalIncome - totalExpenses >= 0 ? 'border-lime-accent/20' : 'border-red-400/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <Receipt className={`w-8 h-8 ${totalIncome - totalExpenses >= 0 ? 'text-lime-accent' : 'text-red-400'}`} />
            <span className={`text-sm font-medium ${totalIncome - totalExpenses >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              Net Balance
            </span>
          </div>
          <h3 className={`text-3xl font-bold font-editorial ${
            totalIncome - totalExpenses >= 0 ? 'text-lime-accent' : 'text-red-400'
          }`}>
            KES {Math.abs(totalIncome - totalExpenses).toLocaleString()}
          </h3>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
          >
            <option value="all">All Categories</option>
            {[...categories.income, ...categories.expense].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {filteredTransactions.length} transactions
            </span>
          </div>
        </div>
      </motion.div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Type
                    </label>
                    <select
                      {...register('type', { required: 'Type is required' })}
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Category
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories[watchType].map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Amount (KES)
                  </label>
                  <input
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Description
                  </label>
                  <input
                    {...register('description', { required: 'Description is required' })}
                    type="text"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="Enter description"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Date
                  </label>
                  <input
                    {...register('date', { required: 'Date is required' })}
                    type="date"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                  />
                  {errors.date && (
                    <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      {...register('recurring')}
                      type="checkbox"
                      className="w-5 h-5 text-lime-accent bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded focus:ring-lime-accent focus:ring-2"
                    />
                    <span className="text-light-text dark:text-dark-text">Recurring transaction</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register('businessRelated')}
                      type="checkbox"
                      className="w-5 h-5 text-lime-accent bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded focus:ring-lime-accent focus:ring-2"
                    />
                    <span className="text-light-text dark:text-dark-text">Business related</span>
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-lime-accent text-light-base dark:text-dark-base rounded-xl font-medium hover:shadow-glow transition-all"
                  >
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-light-glass dark:bg-dark-glass rounded-xl hover:border-lime-accent/30 border border-transparent transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-lime-accent/20' : 'bg-red-500/20'
                  }`}>
                    <Receipt className={`w-6 h-6 ${
                      transaction.type === 'income' ? 'text-lime-accent' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-light-text dark:text-dark-text">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {transaction.category}
                      </span>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">•</span>
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {format(transaction.date, 'MMM dd, yyyy')}
                      </span>
                      {transaction.recurring && (
                        <>
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">•</span>
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                            Recurring
                          </span>
                        </>
                      )}
                      {transaction.businessRelated && (
                        <>
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">•</span>
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            Business
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold font-editorial ${
                      transaction.type === 'income' ? 'text-lime-accent' : 'text-light-text dark:text-dark-text'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                No transactions found. Add your first transaction to get started!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};