import React, { useState } from 'react';
import axios from 'axios';
import { DollarSign, Calendar, Tag, Globe } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

function AddTransaction({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0]
  });
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchExchangeRate = async () => {
    if (formData.currency === 'USD') {
      setExchangeRate(null);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/exchange-rate?from=${formData.currency}&to=USD`
      );
      setExchangeRate(response.data);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_BASE_URL}/transactions`, {
        userId: 1, // Hardcoded user ID
        amount: parseFloat(formData.amount),
        category: formData.category,
        currency: formData.currency,
        date: formData.date
      });

      setMessage('Transaction added successfully!');
      setFormData({
        amount: '',
        category: '',
        currency: 'USD',
        date: new Date().toISOString().split('T')[0]
      });
      setExchangeRate(null);
      onTransactionAdded();
    } catch (error) {
      setMessage('Error adding transaction. Please try again.');
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (formData.currency && formData.currency !== 'USD') {
      fetchExchangeRate();
    } else {
      setExchangeRate(null);
    }
  }, [formData.currency]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CURRENCIES.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {exchangeRate && (
            <p className="text-sm text-gray-600 mt-1">
              1 {formData.currency} = ${exchangeRate.rate.toFixed(4)} USD
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="inline w-4 h-4 mr-1" />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>

        {message && (
          <p className={`text-sm text-center ${
            message.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddTransaction;