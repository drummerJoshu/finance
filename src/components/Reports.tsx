import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, BarChart3, PieChart, TrendingUp, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const COLORS = ['#65A30D', '#84CC16', '#A3E635', '#BEF264', '#D9F99D', '#ECFCCB'];

export const Reports: React.FC = () => {
  const { transactions, getMonthlyData, getCategoryData } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [reportType, setReportType] = useState('overview');

  // Generate monthly data for the selected period
  const generateMonthlyData = () => {
    const months = selectedPeriod === '6months' ? 6 : 12;
    return Array.from({ length: months }, (_, i) => {
      const month = subMonths(new Date(), months - 1 - i);
      const data = getMonthlyData(month);
      return {
        month: format(month, 'MMM yyyy'),
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      };
    });
  };

  const monthlyData = generateMonthlyData();
  const categoryData = getCategoryData();
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report as ${format}`);
    alert(`${reportType} report exported as ${format.toUpperCase()}! (This is a demo)`);
  };

  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const netSavings = totalIncome - totalExpenses;
  const avgMonthlyIncome = totalIncome / monthlyData.length;
  const avgMonthlyExpenses = totalExpenses / monthlyData.length;

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
            Financial Reports
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Analyze your financial data with detailed reports
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 bg-lime-accent text-light-base dark:text-dark-base px-4 py-2 rounded-xl font-medium hover:shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Report Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-2"
      >
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'income', label: 'Income Analysis', icon: TrendingUp },
            { id: 'expenses', label: 'Expense Breakdown', icon: PieChart },
            { id: 'trends', label: 'Trends', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                reportType === tab.id
                  ? 'bg-lime-accent text-light-base dark:text-dark-base shadow-sm'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-glass dark:hover:bg-dark-glass'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-lime-accent/10 to-lime-accent/5 border border-lime-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-lime-accent" />
            <span className="text-sm text-lime-accent font-medium">Total Income</span>
          </div>
          <h3 className="text-2xl font-bold text-lime-accent font-editorial">
            KES {totalIncome.toLocaleString()}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Avg: KES {avgMonthlyIncome.toLocaleString()}/month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Total Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-red-400 font-editorial">
            KES {totalExpenses.toLocaleString()}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Avg: KES {avgMonthlyExpenses.toLocaleString()}/month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border rounded-2xl p-6 ${
            netSavings >= 0 ? 'border-lime-accent/20' : 'border-red-400/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <PieChart className={`w-8 h-8 ${netSavings >= 0 ? 'text-lime-accent' : 'text-red-400'}`} />
            <span className={`text-sm font-medium ${netSavings >= 0 ? 'text-lime-accent' : 'text-red-400'}`}>
              Net Savings
            </span>
          </div>
          <h3 className={`text-2xl font-bold font-editorial ${
            netSavings >= 0 ? 'text-lime-accent' : 'text-red-400'
          }`}>
            KES {Math.abs(netSavings).toLocaleString()}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            {netSavings >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Savings Rate</span>
          </div>
          <h3 className="text-2xl font-bold text-light-text dark:text-dark-text font-editorial">
            {totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0}%
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Of total income
          </p>
        </motion.div>
      </div>

      {/* Report Content */}
      <motion.div
        key={reportType}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        {reportType === 'overview' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Financial Overview - {selectedPeriod === '6months' ? 'Last 6 Months' : 'Last 12 Months'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Income vs Expenses Chart */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Income vs Expenses
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#A0A0A0" fontSize={12} />
                    <YAxis stroke="#A0A0A0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(26, 31, 29, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#E8E8E8'
                      }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="income" fill="#65A30D" name="Income" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Net Savings Trend */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Net Savings Trend
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#A0A0A0" fontSize={12} />
                    <YAxis stroke="#A0A0A0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(26, 31, 29, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#E8E8E8'
                      }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Net Savings']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'expenses' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Expense Breakdown
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expense Categories Pie Chart */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Expenses by Category
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(26, 31, 29, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#E8E8E8'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Details */}
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Category Details
                </h4>
                <div className="space-y-3">
                  {pieData.map((category, index) => {
                    const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0;
                    return (
                      <div key={category.name} className="flex items-center justify-between p-3 bg-light-glass dark:bg-dark-glass rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-light-text dark:text-dark-text">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-light-text dark:text-dark-text">
                            KES {category.value.toLocaleString()}
                          </p>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {(reportType === 'income' || reportType === 'trends') && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {reportType === 'income' ? 'Income analysis' : 'Trend analysis'} coming soon!
            </p>
          </div>
        )}
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Export Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-400/20 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <FileText className="w-6 h-6 text-red-400" />
            <div className="text-left">
              <p className="font-medium text-light-text dark:text-dark-text">Export as PDF</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Professional report format</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-400/20 rounded-xl hover:bg-green-500/20 transition-all"
          >
            <BarChart3 className="w-6 h-6 text-green-400" />
            <div className="text-left">
              <p className="font-medium text-light-text dark:text-dark-text">Export as Excel</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Spreadsheet with formulas</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportReport('csv')}
            className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl hover:bg-blue-500/20 transition-all"
          >
            <Download className="w-6 h-6 text-blue-400" />
            <div className="text-left">
              <p className="font-medium text-light-text dark:text-dark-text">Export as CSV</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Raw data format</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};