import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3, Edit3, Trash2 } from 'lucide-react';
import { useData, Investment } from '../contexts/DataContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface InvestmentForm {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  type: 'stock' | 'crypto' | 'bond';
}

export const InvestmentPortfolio: React.FC = () => {
  const { investments, addInvestment, updateInvestment, deleteInvestment } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvestmentForm>();

  const onSubmit = (data: InvestmentForm) => {
    const investmentData = {
      ...data,
      currency: 'KES',
    };

    if (editingInvestment) {
      updateInvestment(editingInvestment.id, investmentData);
      toast.success('Investment updated successfully!');
      setEditingInvestment(null);
    } else {
      addInvestment(investmentData);
      toast.success('Investment added successfully!');
    }

    reset();
    setShowForm(false);
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    reset({
      symbol: investment.symbol,
      name: investment.name,
      shares: investment.shares,
      currentPrice: investment.currentPrice,
      purchasePrice: investment.purchasePrice,
      type: investment.type,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      deleteInvestment(id);
      toast.success('Investment deleted successfully!');
    }
  };

  // Calculate portfolio metrics
  const totalValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const investmentsByType = investments.reduce((acc, inv) => {
    const value = inv.shares * inv.currentPrice;
    acc[inv.type] = (acc[inv.type] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

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
            Investment Portfolio
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Track your stocks, crypto, and other investments
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true);
            setEditingInvestment(null);
            reset();
          }}
          className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Investment</span>
        </motion.button>
      </motion.div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-lime-accent" />
            <span className="text-sm text-lime-accent font-medium">Total Value</span>
          </div>
          <h3 className="text-3xl font-bold text-lime-accent font-editorial">
            KES {totalValue.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Total Cost</span>
          </div>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
            KES {totalCost.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            totalGainLoss >= 0 ? 'border-lime-accent/20' : 'border-red-400/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-8 h-8 text-lime-accent" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
            <span className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              Gain/Loss
            </span>
          </div>
          <h3 className={`text-3xl font-bold font-editorial ${
            totalGainLoss >= 0 ? 'text-lime-accent' : 'text-red-400'
          }`}>
            {totalGainLoss >= 0 ? '+' : ''}KES {totalGainLoss.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            totalGainLossPercent >= 0 ? 'border-lime-accent/20' : 'border-red-400/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            {totalGainLossPercent >= 0 ? (
              <TrendingUp className="w-8 h-8 text-lime-accent" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
            <span className={`text-sm font-medium ${totalGainLossPercent >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              Return %
            </span>
          </div>
          <h3 className={`text-3xl font-bold font-editorial ${
            totalGainLossPercent >= 0 ? 'text-lime-accent' : 'text-red-400'
          }`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </h3>
        </motion.div>
      </div>

      {/* Investment Form Modal */}
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
                {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Symbol
                    </label>
                    <input
                      {...register('symbol', { required: 'Symbol is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                      placeholder="e.g., SCOM"
                    />
                    {errors.symbol && (
                      <p className="text-red-400 text-sm mt-1">{errors.symbol.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Type
                    </label>
                    <select
                      {...register('type', { required: 'Type is required' })}
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    >
                      <option value="stock">Stock</option>
                      <option value="crypto">Crypto</option>
                      <option value="bond">Bond</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Company/Asset Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="e.g., Safaricom PLC"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Shares/Units
                    </label>
                    <input
                      {...register('shares', { 
                        required: 'Shares is required',
                        min: { value: 0.01, message: 'Shares must be greater than 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                      placeholder="0"
                    />
                    {errors.shares && (
                      <p className="text-red-400 text-sm mt-1">{errors.shares.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Purchase Price (KES)
                    </label>
                    <input
                      {...register('purchasePrice', { 
                        required: 'Purchase price is required',
                        min: { value: 0.01, message: 'Price must be greater than 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                      placeholder="0.00"
                    />
                    {errors.purchasePrice && (
                      <p className="text-red-400 text-sm mt-1">{errors.purchasePrice.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Current Price (KES)
                  </label>
                  <input
                    {...register('currentPrice', { 
                      required: 'Current price is required',
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    placeholder="0.00"
                  />
                  {errors.currentPrice && (
                    <p className="text-red-400 text-sm mt-1">{errors.currentPrice.message}</p>
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
                    {editingInvestment ? 'Update' : 'Add'} Investment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial mb-6">
          Your Investments
        </h3>

        {investments.length > 0 ? (
          <div className="space-y-4">
            {investments.map((investment, index) => {
              const currentValue = investment.shares * investment.currentPrice;
              const costBasis = investment.shares * investment.purchasePrice;
              const gainLoss = currentValue - costBasis;
              const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

              return (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl border border-transparent hover:border-lime-accent/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        investment.type === 'stock' ? 'bg-blue-500/20' :
                        investment.type === 'crypto' ? 'bg-orange-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <span className={`font-bold text-sm ${
                          investment.type === 'stock' ? 'text-blue-400' :
                          investment.type === 'crypto' ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {investment.symbol}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-light-text dark:text-dark-text font-editorial">
                          {investment.name}
                        </h4>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary capitalize">
                          {investment.type} • {investment.shares} shares
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-light-text dark:text-dark-text font-editorial">
                          KES {currentValue.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          {gainLoss >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-lime-accent" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            gainLoss >= 0 ? 'text-lime-accent' : 'text-red-400'
                          }`}>
                            {gainLoss >= 0 ? '+' : ''}KES {gainLoss.toLocaleString()} ({gainLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(investment)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(investment.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">Current Price:</span>
                      <p className="font-medium text-light-text dark:text-dark-text">
                        KES {investment.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">Purchase Price:</span>
                      <p className="font-medium text-light-text dark:text-dark-text">
                        KES {investment.purchasePrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">Cost Basis:</span>
                      <p className="font-medium text-light-text dark:text-dark-text">
                        KES {costBasis.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              No investments yet. Add your first investment to start tracking your portfolio!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};