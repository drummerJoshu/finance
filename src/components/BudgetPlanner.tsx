import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, AlertTriangle, TrendingUp, Edit3, Trash2 } from 'lucide-react';
import { useData, Budget } from '../contexts/DataContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface BudgetForm {
  category: string;
  limit: number;
  period: 'monthly' | 'weekly';
}

const budgetCategories = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 
  'Healthcare', 'Shopping', 'Education', 'Savings', 'Other'
];

export const BudgetPlanner: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, transactions } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BudgetForm>();

  // Calculate spent amounts for each budget
  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { ...budget, spent };
  });

  const onSubmit = (data: BudgetForm) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, data);
      toast.success('Budget updated successfully!');
      setEditingBudget(null);
    } else {
      addBudget(data);
      toast.success('Budget created successfully!');
    }

    reset();
    setShowForm(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    reset({
      category: budget.category,
      limit: budget.limit,
      period: budget.period,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      toast.success('Budget deleted successfully!');
    }
  };

  const totalBudget = budgetsWithSpent.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetsWithSpent.reduce((sum, b) => sum + b.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const alertBudgets = budgetsWithSpent.filter(b => (b.spent / b.limit) * 100 >= 75);

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
            Budget Planner
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Set spending limits and track your progress
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true);
            setEditingBudget(null);
            reset();
          }}
          className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Budget</span>
        </motion.button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Total Budget</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            KES {totalBudget.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">Total Spent</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            KES {totalSpent.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            budgetUtilization >= 90 ? 'border-red-400/20' : budgetUtilization >= 75 ? 'border-orange-400/20' : 'border-lime-accent/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className={`w-8 h-8 ${
              budgetUtilization >= 90 ? 'text-red-400' : budgetUtilization >= 75 ? 'text-orange-400' : 'text-lime-accent'
            }`} />
            <span className={`text-sm font-medium ${
              budgetUtilization >= 90 ? 'text-red-400' : budgetUtilization >= 75 ? 'text-orange-400' : 'text-lime-accent'
            }`}>
              Utilization
            </span>
          </div>
          <h3 className={`text-3xl font-bold font-editorial ${
            budgetUtilization >= 90 ? 'text-red-400' : budgetUtilization >= 75 ? 'text-orange-400' : 'text-lime-accent'
          }`}>
            {budgetUtilization.toFixed(1)}%
          </h3>
          <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-2 mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`h-2 rounded-full ${
                budgetUtilization >= 90 ? 'bg-red-400' : budgetUtilization >= 75 ? 'bg-orange-400' : 'bg-lime-accent'
              }`}
            />
          </div>
        </motion.div>
      </div>

      {/* Budget Form Modal */}
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
              className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Category
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                  >
                    <option value="">Select category</option>
                    {budgetCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Budget Limit (KES)
                  </label>
                  <input
                    {...register('limit', { 
                      required: 'Budget limit is required',
                      min: { value: 1, message: 'Budget limit must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="0.00"
                  />
                  {errors.limit && (
                    <p className="text-red-400 text-sm mt-1">{errors.limit.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Period
                  </label>
                  <select
                    {...register('period', { required: 'Period is required' })}
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
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
                    {editingBudget ? 'Update' : 'Create'} Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-orange-500/10 border border-orange-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-orange-400 font-editorial">Budget Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertBudgets.map(budget => {
              const percentage = (budget.spent / budget.limit) * 100;
              return (
                <div key={budget.id} className="bg-orange-500/5 border border-orange-400/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-light-text dark:text-dark-text">{budget.category}</span>
                    <span className="text-orange-400 font-bold">{percentage.toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    KES {budget.spent.toLocaleString()} / {budget.limit.toLocaleString()}
                  </p>
                  <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-400' : 'bg-orange-400'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Budget List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
          Your Budgets
        </h3>

        {budgetsWithSpent.length > 0 ? (
          <div className="space-y-4">
            {budgetsWithSpent.map((budget, index) => {
              const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
              const remaining = budget.limit - budget.spent;
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl border border-transparent hover:border-lime-accent/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial">
                        {budget.category}
                      </h4>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary capitalize">
                        {budget.period} budget
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Spent: KES {budget.spent.toLocaleString()}
                      </span>
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Limit: KES {budget.limit.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
                        className={`h-3 rounded-full ${
                          percentage >= 100 ? 'bg-red-400' : 
                          percentage >= 75 ? 'bg-orange-400' : 
                          'bg-lime-accent'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        percentage >= 100 ? 'text-red-400' : 
                        percentage >= 75 ? 'text-orange-400' : 
                        'text-lime-accent'
                      }`}>
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className={`text-sm font-medium ${
                        remaining < 0 ? 'text-red-400' : 'text-light-text dark:text-dark-text'
                      }`}>
                        {remaining < 0 ? 'Over by' : 'Remaining'}: KES {Math.abs(remaining).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              No budgets created yet. Create your first budget to start tracking your spending!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};