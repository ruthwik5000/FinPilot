import { useState, useEffect } from 'react';
import api from '../utils/api';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    tenure: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [calculatedEMI, setCalculatedEMI] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch loans from backend
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  // Calculate EMI: [P × r × (1+r)^n] / [(1+r)^n - 1]
  const calculateEMI = (principal, annualRate, months) => {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / months;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  useEffect(() => {
    if (formData.amount && formData.interestRate && formData.tenure) {
      const emi = calculateEMI(
        parseFloat(formData.amount),
        parseFloat(formData.interestRate),
        parseInt(formData.tenure)
      );
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI(0);
    }
  }, [formData.amount, formData.interestRate, formData.tenure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to backend API
      const response = await api.post('/loans', {
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        tenure: parseInt(formData.tenure),
      });

      // Add new loan to state
      setLoans([...loans, response.data]);
      
      // Reset form
      setFormData({
        amount: '',
        interestRate: '',
        tenure: '',
        startDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding loan:', error);
      alert('Failed to add loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateRemaining = (loan) => {
    const totalPaid = loan.emi * loan.paidMonths;
    const remaining = loan.amount - totalPaid;
    const progress = (loan.paidMonths / loan.tenure) * 100;
    return { remaining: Math.max(0, remaining), progress };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Loans</h1>
        </div>

        {/* Add Loan Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Loan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenure (months)
                </label>
                <input
                  type="number"
                  value={formData.tenure}
                  onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* EMI Display */}
            {calculatedEMI > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">Estimated Monthly EMI:</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  ${calculatedEMI.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Formula: [P × r × (1+r)^n] / [(1+r)^n - 1]
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Adding Loan...' : 'Add Loan'}
            </button>
          </form>
        </div>

        {/* Loan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No loans yet. Add your first loan above!
            </div>
          ) : (
            loans.map((loan) => {
              const { remaining, progress } = calculateRemaining(loan);

              return (
                <div key={loan._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="text-3xl font-bold text-gray-800">${loan.amount.toFixed(2)}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-primary text-sm font-semibold rounded-full">
                      {loan.interestRate}% p.a.
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly EMI:</span>
                      <span className="font-bold text-primary text-lg">${loan.emi.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance:</span>
                      <span className="font-semibold">${remaining.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tenure:</span>
                      <span className="font-semibold">{loan.paidMonths}/{loan.tenure} months</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Repayment Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-success h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
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

export default Loans;
