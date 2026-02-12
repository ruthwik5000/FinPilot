import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../utils/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  // Mock data for now
  useEffect(() => {
    setExpenses([
      { _id: '1', amount: 45.50, category: 'food', description: 'Grocery shopping', date: '2026-02-10' },
      { _id: '2', amount: 25.00, category: 'transport', description: 'Uber ride', date: '2026-02-11' },
      { _id: '3', amount: 120.00, category: 'bills', description: 'Internet bill', date: '2026-02-12' },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock adding expense
      const newExpense = {
        _id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
      };
      setExpenses([newExpense, ...expenses]);
      setFormData({
        amount: '',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setExpenses(expenses.filter((exp) => exp._id !== id));
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-red-500',
      transport: 'bg-yellow-500',
      bills: 'bg-blue-500',
      fun: 'bg-green-500',
      other: 'bg-purple-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      bills: '📄',
      fun: '🎉',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals).map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Expense Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Expense</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="bills">Bills</option>
                  <option value="fun">Fun</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </form>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No expenses yet</p>
                ) : (
                  expenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${getCategoryColor(expense.category)} rounded-full flex items-center justify-center text-white text-xl`}>
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                          <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-danger hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h2>
            {expenses.length > 0 ? (
              <div className="h-64">
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Add expenses to see breakdown</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
