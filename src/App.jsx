import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import SpendingChart from './components/SpendingChart';
import { PlusCircle, List, BarChart3 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('add');
  const [transactions, setTransactions] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  const fetchTransactions = async (month) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions?month=${month}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchSpendingReport = async (month) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/spending-report?month=${month}`);
      setSpendingData(response.data);
    } catch (error) {
      console.error('Error fetching spending report:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedMonth);
    fetchSpendingReport(selectedMonth);
  }, [selectedMonth]);

  const handleTransactionAdded = () => {
    fetchTransactions(selectedMonth);
    fetchSpendingReport(selectedMonth);
  };

  const tabs = [
    { id: 'add', label: 'Add Transaction', icon: PlusCircle },
    { id: 'list', label: 'Transactions', icon: List },
    { id: 'chart', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600">
            Track your expenses and manage your budget effectively
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Month Selector for List and Chart tabs */}
          {(activeTab === 'list' || activeTab === 'chart') && (
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'add' && (
              <AddTransaction onTransactionAdded={handleTransactionAdded} />
            )}
            {activeTab === 'list' && (
              <TransactionList transactions={transactions} />
            )}
            {activeTab === 'chart' && (
              <SpendingChart data={spendingData} month={selectedMonth} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;