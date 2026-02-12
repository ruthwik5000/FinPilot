import { useState, useEffect } from 'react';
import api from '../utils/api';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [formData, setFormData] = useState({
    asset: '',
    type: 'stock',
    quantity: '',
    investedAmount: '',
  });
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    setInvestments([
      {
        _id: '1',
        asset: 'AAPL',
        type: 'stock',
        quantity: 10,
        investedAmount: 1500,
        currentPrice: 175.50,
        currentValue: 1755,
      },
      {
        _id: '2',
        asset: 'BTC',
        type: 'crypto',
        quantity: 0.5,
        investedAmount: 20000,
        currentPrice: 45000,
        currentValue: 22500,
      },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock adding investment
      const newInvestment = {
        _id: Date.now().toString(),
        ...formData,
        quantity: parseFloat(formData.quantity),
        investedAmount: parseFloat(formData.investedAmount),
        currentPrice: 100, // Mock price
        currentValue: parseFloat(formData.quantity) * 100,
      };
      setInvestments([...investments, newInvestment]);
      setFormData({ asset: '', type: 'stock', quantity: '', investedAmount: '' });
    } catch (error) {
      console.error('Error adding investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = (investment) => {
    const profit = investment.currentValue - investment.investedAmount;
    const percentage = ((profit / investment.investedAmount) * 100).toFixed(2);
    return { profit, percentage };
  };

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalProfit = totalPortfolioValue - totalInvested;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Investments</h1>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <p className="text-sm opacity-90">Total Portfolio Value</p>
          <p className="text-4xl font-bold mt-2">${totalPortfolioValue.toFixed(2)}</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-sm">Invested: ${totalInvested.toFixed(2)}</span>
            <span className={`text-sm font-semibold ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} ({((totalProfit / totalInvested) * 100).toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Add Investment Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Investment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Asset Symbol (e.g., AAPL, BTC)"
              value={formData.asset}
              onChange={(e) => setFormData({ ...formData, asset: e.target.value.toUpperCase() })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="stock">Stock</option>
              <option value="crypto">Crypto</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount Invested"
              value={formData.investedAmount}
              onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
              required
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

        {/* Investment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No investments yet. Add your first investment above!
            </div>
          ) : (
            investments.map((investment) => {
              const { profit, percentage } = calculateProfit(investment);
              const isProfit = profit >= 0;

              return (
                <div key={investment._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{investment.asset}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                        investment.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {investment.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold">{investment.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invested:</span>
                      <span className="font-semibold">${investment.investedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-semibold">${investment.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="font-bold text-lg">${investment.currentValue.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
                      <span>Profit/Loss:</span>
                      <span>
                        {isProfit ? '+' : ''}{profit.toFixed(2)} ({percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Investments;
