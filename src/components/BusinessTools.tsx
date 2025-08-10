import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

export const BusinessTools: React.FC = () => {
  const { transactions } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter business transactions
  const businessTransactions = transactions.filter(t => t.businessRelated);
  const businessIncome = businessTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const businessExpenses = businessTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const businessProfit = businessIncome - businessExpenses;

  const generateInvoice = () => {
    // Mock invoice generation
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 25000,
      client: 'Sample Client',
    };
    
    // In a real app, this would generate a PDF
    console.log('Generating invoice:', invoiceData);
    alert('Invoice generated! (This is a demo)');
  };

  const exportData = (format: 'csv' | 'excel') => {
    // Mock data export
    console.log(`Exporting business data as ${format}`);
    alert(`Business data exported as ${format.toUpperCase()}! (This is a demo)`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

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
            Business Tools
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Manage your business finances and generate reports
          </p>
        </div>
      </motion.div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-lime-accent" />
            <span className="text-sm text-lime-accent font-medium">Business Income</span>
          </div>
          <h3 className="text-3xl font-bold text-lime-accent font-editorial">
            KES {businessIncome.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Business Expenses</span>
          </div>
          <h3 className="text-3xl font-bold text-red-400 font-editorial">
            KES {businessExpenses.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            businessProfit >= 0 ? 'border-lime-accent/20' : 'border-red-400/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className={`w-8 h-8 ${businessProfit >= 0 ? 'text-lime-accent' : 'text-red-400'}`} />
            <span className={`text-sm font-medium ${businessProfit >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              Net Profit
            </span>
          </div>
          <h3 className={`text-3xl font-bold font-editorial ${
            businessProfit >= 0 ? 'text-lime-accent' : 'text-red-400'
          }`}>
            KES {Math.abs(businessProfit).toLocaleString()}
          </h3>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-2"
      >
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-lime-accent text-light-base dark:text-dark-base shadow-sm'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-glass dark:hover:bg-dark-glass'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Business Overview
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Business Transactions */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Recent Business Transactions
                </h4>
                <div className="space-y-3">
                  {businessTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-light-glass dark:bg-dark-glass rounded-xl">
                      <div>
                        <p className="font-medium text-light-text dark:text-dark-text">{transaction.description}</p>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {transaction.category} • {format(transaction.date, 'MMM dd')}
                        </p>
                      </div>
                      <span className={`font-bold ${
                        transaction.type === 'income' ? 'text-lime-accent' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateInvoice}
                    className="w-full flex items-center space-x-3 p-4 bg-lime-accent/10 border border-lime-accent/20 rounded-xl hover:bg-lime-accent/20 transition-all"
                  >
                    <FileText className="w-6 h-6 text-lime-accent" />
                    <div className="text-left">
                      <p className="font-medium text-light-text dark:text-dark-text">Generate Invoice</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Create professional invoices</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportData('csv')}
                    className="w-full flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl hover:bg-blue-500/20 transition-all"
                  >
                    <Download className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                      <p className="font-medium text-light-text dark:text-dark-text">Export Data</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Download CSV/Excel reports</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-400/20 rounded-xl hover:bg-purple-500/20 transition-all"
                  >
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-light-text dark:text-dark-text">Financial Health Score</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Analyze business performance</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
                Invoice Management
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateInvoice}
                className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Invoice</span>
              </motion.button>
            </div>

            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                No invoices yet. Create your first invoice to get started!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Business Reports
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('excel')}
                className="p-6 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 transition-all text-left"
              >
                <BarChart3 className="w-8 h-8 text-lime-accent mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Profit & Loss Report
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Comprehensive P&L statement for your business
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('csv')}
                className="p-6 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 transition-all text-left"
              >
                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Sales Report
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Detailed sales analysis and trends
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('excel')}
                className="p-6 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 transition-all text-left"
              >
                <FileText className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Tax Report
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Tax-ready financial statements
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('csv')}
                className="p-6 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 transition-all text-left"
              >
                <Download className="w-8 h-8 text-orange-400 mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Custom Export
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Export data in various formats
                </p>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};