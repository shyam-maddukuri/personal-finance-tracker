import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

const FALLBACK_COLORS = [
  '#0284c7', '#10b981', '#f59e0b', '#8b5cf6',
  '#ef4444', '#ec4899', '#14b8a6', '#64748b',
  '#3b82f6', '#84cc16'
];

const CategoryPieChart = ({ data = [], currency = '₹' }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-sky-600" />
          Spending by Category
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportional breakdown of your expenses
        </p>
      </div>

      <div className="h-64 mt-2 w-full flex items-center justify-center">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-xs text-center">
            <PieIcon className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
            <p>No expense data to display.</p>
            <p className="text-slate-500 mt-0.5">Add an expense to see your category breakdown.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => {
                  const color =
                    CATEGORY_COLORS[entry.name] ||
                    FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
              <Tooltip
                formatter={(val, name) => [
                  `${formatCurrency(val, currency)}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0a1624',
                  borderColor: '#1b344d',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#38bdf8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend list */}
      {hasData && (
        <div className="mt-3 pt-3 border-t border-slate-100 max-h-36 overflow-y-auto space-y-2 pr-1">
          {data.map((item, idx) => {
            const color =
              CATEGORY_COLORS[item.name] ||
              FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
            return (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-0.5"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-slate-700 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-900 shrink-0">
                  <span className="text-slate-500 text-[11px] font-normal">
                    {item.percentage}%
                  </span>
                  <span>{formatCurrency(item.value, currency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
