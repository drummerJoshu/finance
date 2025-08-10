import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Download, 
  Upload, 
  Trash2, 
  Key,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { user, logout, enableTwoFactor, enableBiometric } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'data', label: 'Data Management', icon: Download },
  ];

  const handleExportData = () => {
    // Mock data export
    toast.success('Data export started! You will receive an email when ready.');
  };

  const handleImportData = () => {
    // Mock data import
    toast.success('Data import feature coming soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
          Settings
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-2"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-2xl p-6"
      >
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Profile Information
            </h3>
            
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-lime-accent rounded-full flex items-center justify-center">
                <span className="text-light-base dark:text-dark-base font-bold text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {user?.name || 'User'}
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {user?.email}
                </p>
                <button className="text-lime-accent text-sm hover:underline mt-1">
                  Change profile picture
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Location
                </label>
                <select className="w-full px-4 py-3 bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors">
                  <option>Kenya</option>
                  <option>Uganda</option>
                  <option>Tanzania</option>
                  <option>Rwanda</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-lime-accent text-light-base dark:text-dark-base px-6 py-3 rounded-xl font-medium hover:shadow-glow transition-all"
            >
              Save Changes
            </motion.button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Security Settings
            </h3>

            {/* Password Change */}
            <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
              <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors"
                    />
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.twoFactorEnabled && (
                    <span className="text-xs bg-lime-accent/20 text-lime-accent px-2 py-1 rounded-full">
                      Enabled
                    </span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={enableTwoFactor}
                    disabled={user?.twoFactorEnabled}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      user?.twoFactorEnabled
                        ? 'bg-lime-accent/20 text-lime-accent cursor-not-allowed'
                        : 'bg-lime-accent text-light-base dark:text-dark-base hover:shadow-glow'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>{user?.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Biometric Authentication */}
            <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    Biometric Authentication
                  </h4>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Use fingerprint or face ID to secure your account
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.biometricEnabled && (
                    <span className="text-xs bg-lime-accent/20 text-lime-accent px-2 py-1 rounded-full">
                      Enabled
                    </span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={enableBiometric}
                    disabled={user?.biometricEnabled}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      user?.biometricEnabled
                        ? 'bg-lime-accent/20 text-lime-accent cursor-not-allowed'
                        : 'bg-lime-accent text-light-base dark:text-dark-base hover:shadow-glow'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{user?.biometricEnabled ? 'Enabled' : 'Enable Biometric'}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
              <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Active Sessions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-xl">
                  <div>
                    <p className="font-medium text-light-text dark:text-dark-text">Current Session</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Chrome on Windows • Nairobi, Kenya
                    </p>
                  </div>
                  <span className="text-xs bg-lime-accent/20 text-lime-accent px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Notification Preferences
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Budget Alerts', description: 'Get notified when you approach budget limits' },
                { label: 'Transaction Notifications', description: 'Receive alerts for new transactions' },
                { label: 'Bill Reminders', description: 'Reminders for upcoming bill payments' },
                { label: 'Savings Goal Updates', description: 'Progress updates on your savings goals' },
                { label: 'Investment Updates', description: 'Market updates and portfolio changes' },
                { label: 'Security Alerts', description: 'Important security notifications' },
                { label: 'Weekly Reports', description: 'Weekly financial summary emails' },
                { label: 'Monthly Reports', description: 'Detailed monthly financial reports' },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-light-glass dark:bg-dark-glass rounded-xl">
                  <div>
                    <p className="font-medium text-light-text dark:text-dark-text">{notification.label}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {notification.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={index < 4} />
                    <div className="w-11 h-6 bg-light-border dark:bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-accent"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              App Preferences
            </h3>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">Theme</h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              {/* Currency Settings */}
              <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Default Currency
                </h4>
                <select className="w-full md:w-auto px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors">
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>

              {/* Language Settings */}
              <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Language
                </h4>
                <select className="w-full md:w-auto px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors">
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Date Format
                </h4>
                <select className="w-full md:w-auto px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:border-lime-accent/50 transition-colors">
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
              Data Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Data */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportData}
                className="p-6 bg-lime-accent/10 border border-lime-accent/20 rounded-xl hover:bg-lime-accent/20 transition-all text-left"
              >
                <Download className="w-8 h-8 text-lime-accent mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Export Data
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Download all your financial data in CSV or JSON format
                </p>
              </motion.button>

              {/* Import Data */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImportData}
                className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-xl hover:bg-blue-500/20 transition-all text-left"
              >
                <Upload className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Import Data
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Import transactions from bank statements or other apps
                </p>
              </motion.button>

              {/* Backup Settings */}
              <div className="p-6 bg-light-glass dark:bg-dark-glass rounded-xl">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                  Automatic Backup
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-5 h-5 text-lime-accent bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded focus:ring-lime-accent focus:ring-2" defaultChecked />
                    <span className="text-light-text dark:text-dark-text">Enable automatic backup</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-5 h-5 text-lime-accent bg-light-glass dark:bg-dark-glass border border-light-border dark:border-dark-border rounded focus:ring-lime-accent focus:ring-2" />
                    <span className="text-light-text dark:text-dark-text">Include attachments in backup</span>
                  </label>
                </div>
              </div>

              {/* Delete Account */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteAccount}
                className="p-6 bg-red-500/10 border border-red-400/20 rounded-xl hover:bg-red-500/20 transition-all text-left"
              >
                <Trash2 className="w-8 h-8 text-red-400 mb-4" />
                <h4 className="text-lg font-semibold text-red-400 mb-2">
                  Delete Account
                </h4>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  Permanently delete your account and all associated data
                </p>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center space-x-2 bg-red-500/20 text-red-400 border border-red-400/20 px-6 py-3 rounded-xl font-medium hover:bg-red-500/30 transition-all"
        >
          <span>Sign Out</span>
        </motion.button>
      </motion.div>
    </div>
  );
};