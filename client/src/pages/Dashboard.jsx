import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../utils/api';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalInvestments: 0,
    totalLoans: 0,
    expensesByCategory: {},
    investments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For now, using mock data. Will connect to API later
      setStats({
        totalExpenses: 2450.50,
        totalInvestments: 15750.00,
        totalLoans: 5000.00,
        expensesByCategory: {
          Food: 850,
          Transport: 420,
          Bills: 680,
          Fun: 300,
          Other: 200.50,
        },
        investments: [
          { name: 'AAPL', value: 5000 },
          { name: 'BTC', value: 8000 },
          { name: 'GOOGL', value: 2750 },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const expensePieData = {
    labels: Object.keys(stats.expensesByCategory),
    datasets: [
      {
        data: Object.values(stats.expensesByCategory),
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const investmentBarData = {
    labels: stats.investments.map((inv) => inv.name),
    datasets: [
      {
        label: 'Value ($)',
        data: stats.investments.map((inv) => inv.value),
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600">Welcome back!</span>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Expenses</p>
              <p className="text-3xl font-bold text-danger mt-2">
                ${stats.totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Investments</p>
              <p className="text-3xl font-bold text-success mt-2">
                ${stats.totalInvestments.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Loans</p>
              <p className="text-3xl font-bold text-primary mt-2">
                ${stats.totalLoans.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Expense Breakdown
          </h2>
          <div className="h-64">
            <Pie data={expensePieData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Investment Portfolio
          </h2>
          <div className="h-64">
            <Bar data={investmentBarData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
