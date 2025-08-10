import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
// Make sure the Dashboard component exists at this path, or update the path if needed
// import { Dashboard } from './components/Dashboard';
// If the file is named Dashboard.tsx or Dashboard/index.tsx, this import should work.
// Otherwise, update the path to the correct location, e.g.:
// import { Dashboard } from './components/dashboard/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { BudgetPlanner } from './components/BudgetPlanner';
import { BusinessTools } from './components/BusinessTools';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { SavingsGoals } from './components/SavingsGoals';
import { InvestmentPortfolio } from './components/InvestmentPortfolio';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('expenses');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-lime-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ExpenseTracker />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'budget':
        return <BudgetPlanner />;
      case 'savings':
        return <SavingsGoals />;
      case 'business':
        return <BusinessTools />;
      case 'investments':
        return <InvestmentPortfolio />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <ExpenseTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-light-base dark:bg-dark-base text-light-text dark:text-dark-text font-editorial transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-accent/5 dark:bg-lime-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lime-accent/3 dark:bg-lime-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="flex h-screen relative">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;