import React from 'react';
import { Calendar, Tag, DollarSign } from 'lucide-react';

function TransactionList({ transactions }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No transactions found
        </h3>
        <p className="text-gray-500">
          Start by adding your first transaction to see it here.
        </p>
      </div>
    );
  }

  const totalAmount = transactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount);
  }, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Transactions ({transactions.length})
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    <Tag className="inline w-3 h-3 mr-1" />
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(transaction.timestamp)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
                {transaction.currency !== 'USD' && (
                  <p className="text-xs text-gray-500">
                    {transaction.currency}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;