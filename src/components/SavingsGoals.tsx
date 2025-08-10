import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Edit3, Trash2, DollarSign } from 'lucide-react';
import { useData, SavingsGoal } from '../contexts/DataContext';
import { useForm } from 'react-hook-form';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

interface SavingsGoalForm {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

const goalCategories = [
  'Emergency Fund', 'Vacation', 'Car', 'House', 'Education', 
  'Wedding', 'Retirement', 'Investment', 'Electronics', 'Other'
];

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [showAddFunds, setShowAddFunds] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SavingsGoalForm>();
  const { register: registerFunds, handleSubmit: handleSubmitFunds, reset: resetFunds } = useForm<{ amount: number }>();

  const onSubmit = (data: SavingsGoalForm) => {
    const goalData = {
      ...data,
      targetDate: new Date(data.targetDate),
      currency: 'KES',
    };

    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, goalData);
      toast.success('Savings goal updated successfully!');
      setEditingGoal(null);
    } else {
      addSavingsGoal(goalData);
      toast.success('Savings goal created successfully!');
    }

    reset();
    setShowForm(false);
  };

  const onAddFunds = (data: { amount: number }) => {
    if (showAddFunds) {
      const goal = savingsGoals.find(g => g.id === showAddFunds);
      if (goal) {
        const newAmount = Math.min(goal.currentAmount + data.amount, goal.targetAmount);
        updateSavingsGoal(showAddFunds, { currentAmount: newAmount });
        toast.success(`Added KES ${data.amount.toLocaleString()} to ${goal.name}!`);
      }
    }
    resetFunds();
    setShowAddFunds(null);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    reset({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: format(goal.targetDate, 'yyyy-MM-dd'),
      category: goal.category,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(id);
      toast.success('Savings goal deleted successfully!');
    }
  };

  const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const completedGoals = savingsGoals.filter(goal => goal.currentAmount >= goal.targetAmount);
  const activeGoals = savingsGoals.filter(goal => goal.currentAmount < goal.targetAmount);

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
            Savings Goals
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Set and track your financial goals
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true);
            setEditingGoal(null);
            reset();
          }}
          className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </motion.button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-lime-accent" />
            <span className="text-sm text-lime-accent font-medium">Total Saved</span>
          </div>
          <h3 className="text-3xl font-bold text-lime-accent font-editorial">
            KES {totalCurrentAmount.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Target Amount</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            KES {totalTargetAmount.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Progress</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            {overallProgress.toFixed(1)}%
          </h3>
          <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-2 mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-2 bg-purple-400 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">Completed</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            {completedGoals.length}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            of {savingsGoals.length} goals
          </p>
        </motion.div>
      </div>

      {/* Goal Form Modal */}
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
                {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Goal Name
                  </label>
                  <input
                    {...register('name', { required: 'Goal name is required' })}
                    type="text"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="e.g., Emergency Fund"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
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
                    {goalCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Target Amount (KES)
                    </label>
                    <input
                      {...register('targetAmount', { 
                        required: 'Target amount is required',
                        min: { value: 1, message: 'Target amount must be greater than 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                      placeholder="0.00"
                    />
                    {errors.targetAmount && (
                      <p className="text-red-400 text-sm mt-1">{errors.targetAmount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Current Amount (KES)
                    </label>
                    <input
                      {...register('currentAmount', { 
                        required: 'Current amount is required',
                        min: { value: 0, message: 'Current amount cannot be negative' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                      placeholder="0.00"
                    />
                    {errors.currentAmount && (
                      <p className="text-red-400 text-sm mt-1">{errors.currentAmount.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Target Date
                  </label>
                  <input
                    {...register('targetDate', { required: 'Target date is required' })}
                    type="date"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                  />
                  {errors.targetDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.targetDate.message}</p>
                  )}
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
                    {editingGoal ? 'Update' : 'Create'} Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddFunds(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 w-full max-w-sm"
            >
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
                Add Funds
              </h3>

              <form onSubmit={handleSubmitFunds(onAddFunds)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Amount to Add (KES)
                  </label>
                  <input
                    {...registerFunds('amount', { 
                      required: 'Amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddFunds(null)}
                    className="flex-1 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text hover:border-lime-accent/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-lime-accent text-light-base dark:text-dark-base rounded-xl font-medium hover:shadow-glow transition-all"
                  >
                    Add Funds
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Savings Goals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
          Your Savings Goals
        </h3>

        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savingsGoals.map((goal, index) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysLeft = differenceInDays(goal.targetDate, new Date());
              const isCompleted = goal.currentAmount >= goal.targetAmount;
              const isOverdue = daysLeft < 0 && !isCompleted;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 bg-light-glass dark:bg-dark-glass rounded-xl border transition-all group ${
                    isCompleted ? 'border-lime-accent/30 bg-lime-accent/5' : 
                    isOverdue ? 'border-red-400/30 bg-red-500/5' : 
                    'border-transparent hover:border-lime-accent/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial">
                          {goal.name}
                        </h4>
                        {isCompleted && (
                          <span className="text-xs bg-lime-accent/20 text-lime-accent px-2 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {goal.category}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-lime-accent font-editorial">
                        KES {goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        of KES {goal.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-light-glass dark:bg-dark-glass rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
                        className={`h-3 rounded-full ${
                          isCompleted ? 'bg-lime-accent' : 
                          isOverdue ? 'bg-red-400' : 
                          'bg-blue-400'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        isCompleted ? 'text-lime-accent' : 
                        isOverdue ? 'text-red-400' : 
                        'text-blue-400'
                      }`}>
                        {progress.toFixed(1)}% complete
                      </span>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {isCompleted ? 'Goal achieved!' : 
                         isOverdue ? `${Math.abs(daysLeft)} days overdue` :
                         `${daysLeft} days left`}
                      </span>
                    </div>

                    {!isCompleted && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          Remaining: KES {remaining.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setShowAddFunds(goal.id)}
                          className="text-sm bg-lime-accent/20 text-lime-accent px-3 py-1 rounded-full hover:bg-lime-accent/30 transition-colors"
                        >
                          Add Funds
                        </button>
                      </div>
                    )}

                    <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      Target date: {format(goal.targetDate, 'MMM dd, yyyy')}
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
              No savings goals yet. Create your first goal to start saving!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};