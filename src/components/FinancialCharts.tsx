'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/types/financial';

interface FinancialChartsProps {
  data: ChartData[];
  companyName: string;
}

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];

export default function FinancialCharts({
  data,
  companyName,
}: FinancialChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        차트를 표시할 데이터가 없습니다
      </div>
    );
  }

  const profitData = data.map((item) => ({
    year: item.year,
    매출액: (item.revenue || 0) / 100000000,
    영업이익: (item.operatingProfit || 0) / 100000000,
    당기순이익: (item.netIncome || 0) / 100000000,
  }));

  const assetData = data.map((item) => ({
    year: item.year,
    유동자산: (item.currentAssets || 0) / 100000000,
    비유동자산: (item.nonCurrentAssets || 0) / 100000000,
  }));

  const profitMarginData = data.map((item) => ({
    year: item.year,
    영업이익률:
      item.revenue && item.operatingProfit
        ? ((item.operatingProfit / item.revenue) * 100).toFixed(1)
        : 0,
    순이익률:
      item.revenue && item.netIncome
        ? ((item.netIncome / item.revenue) * 100).toFixed(1)
        : 0,
  }));

  const latestData = data[data.length - 1];
  const totalAssets = (latestData.currentAssets || 0) + (latestData.nonCurrentAssets || 0);
  const totalLiabilities =
    (latestData.currentLiabilities || 0) + (latestData.nonCurrentLiabilities || 0);
  const equity = latestData.equity || 0;

  const liabilityData = [
    { name: '부채', value: totalLiabilities / 100000000 },
    { name: '자본', value: equity / 100000000 },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return `${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          매출 • 이익 추이 (억 원)
        </h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} minWidth={500}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="매출액" fill="#3b82f6" />
              <Bar dataKey="영업이익" fill="#10b981" />
              <Bar dataKey="당기순이익" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          자산 구성 (억 원)
        </h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} minWidth={500}>
            <BarChart data={assetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="유동자산" stackId="a" fill="#3b82f6" />
              <Bar dataKey="비유동자산" stackId="a" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            부채 vs 자본
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={liabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value)}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liabilityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <div>총자산: {formatCurrency(totalAssets / 100000000)}만 원</div>
            <div>부채비율: {((totalLiabilities / (totalAssets || 1)) * 100).toFixed(1)}%</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            수익성 지표 (%)
          </h3>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={400}>
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="영업이익률"
                  stroke="#10b981"
                  dot={{ fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="순이익률"
                  stroke="#f59e0b"
                  dot={{ fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
