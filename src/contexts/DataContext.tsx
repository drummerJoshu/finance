import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  recurring?: boolean;
  businessRelated?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  currency: string;
  period: 'monthly' | 'weekly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: Date;
  category: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  currency: string;
  type: 'stock' | 'crypto' | 'bond';
}

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  getMonthlyData: (month: Date) => { income: number; expenses: number; transactions: Transaction[] };
  getCategoryData: () => { [key: string]: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 150000,
    currency: 'KES',
    description: 'Monthly salary',
    date: new Date(),
    recurring: true,
  },
  {
    id: '2',
    type: 'expense',
    category: 'Food',
    amount: 2500,
    currency: 'KES',
    description: 'Grocery shopping',
    date: new Date(),
  },
  {
    id: '3',
    type: 'expense',
    category: 'Transport',
    amount: 1200,
    currency: 'KES',
    description: 'Matatu fare',
    date: new Date(),
  },
  {
    id: '4',
    type: 'expense',
    category: 'Rent',
    amount: 35000,
    currency: 'KES',
    description: 'Monthly rent',
    date: new Date(),
    recurring: true,
  },
  {
    id: '5',
    type: 'income',
    category: 'Freelance',
    amount: 25000,
    currency: 'KES',
    description: 'Web development project',
    date: new Date(),
    businessRelated: true,
  },
];

const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    limit: 15000,
    spent: 8500,
    currency: 'KES',
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Transport',
    limit: 8000,
    spent: 5200,
    currency: 'KES',
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Entertainment',
    limit: 5000,
    spent: 2100,
    currency: 'KES',
    period: 'monthly',
  },
];

const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 500000,
    currentAmount: 125000,
    currency: 'KES',
    targetDate: new Date(2024, 11, 31),
    category: 'Emergency',
  },
  {
    id: '2',
    name: 'Vacation to Dubai',
    targetAmount: 200000,
    currentAmount: 45000,
    currency: 'KES',
    targetDate: new Date(2024, 6, 15),
    category: 'Travel',
  },
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    symbol: 'SCOM',
    name: 'Safaricom PLC',
    shares: 100,
    currentPrice: 25.50,
    purchasePrice: 22.00,
    currency: 'KES',
    type: 'stock',
  },
  {
    id: '2',
    symbol: 'EQTY',
    name: 'Equity Group Holdings',
    shares: 50,
    currentPrice: 45.75,
    purchasePrice: 40.00,
    currency: 'KES',
    type: 'stock',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(mockSavingsGoals);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);

  // Transaction methods
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transaction } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Budget methods
  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...budget } : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Savings goal methods
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  // Investment methods
  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment = {
      ...investment,
      id: Date.now().toString(),
    };
    setInvestments(prev => [...prev, newInvestment]);
  };

  const updateInvestment = (id: string, investment: Partial<Investment>) => {
    setInvestments(prev => prev.map(i => i.id === id ? { ...i, ...investment } : i));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  // Utility methods
  const getMonthlyData = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => 
      t.date >= start && t.date <= end
    );
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, transactions: monthTransactions };
  };

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return categoryTotals;
  };

  return (
    <DataContext.Provider value={{
      transactions,
      budgets,
      savingsGoals,
      investments,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
      addInvestment,
      updateInvestment,
      deleteInvestment,
      getMonthlyData,
      getCategoryData,
    }}>
      {children}
    </DataContext.Provider>
  );
};