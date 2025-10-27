import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { EditableText } from '../EditableText';
import type { FinancialSummary, ThrustFinancials, StrategicObjective } from '../../types';
import { Banknote, Landmark, TrendingDown, TrendingUp, Edit } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface FinancialsContentProps {
  isAdminMode?: boolean;
  summary?: FinancialSummary;
  thrustData?: ThrustFinancials[];
  objectives?: StrategicObjective[];
  onUpdateSummary?: (field: keyof FinancialSummary, value: string | number) => void;
  onUpdateThrust?: (id: number, field: 'budget' | 'spending', value: number) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MYR',
        notation: 'compact',
        maximumFractionDigits: 2
    }).format(value);
};

const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600 dark:text-green-400';
    if (variance < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-slate-400';
};

export const FinancialsContent: React.FC<FinancialsContentProps> = ({
  isAdminMode = false,
  summary,
  thrustData = [],
  objectives = [],
  onUpdateSummary,
  onUpdateThrust
}) => {
  if (!summary) return <div>Loading...</div>;

  const variance = summary.budget - summary.spending;
  
  const objectivesFinancials = objectives.map(obj => {
    const relevantThrusts = thrustData.filter(t => obj.thrusts.includes(t.thrustId));
    const budget = relevantThrusts.reduce((acc, curr) => acc + curr.budget, 0);
    const spending = relevantThrusts.reduce((acc, curr) => acc + curr.spending, 0);
    return {
      title: obj.title,
      budget,
      spending
    };
  });

  const barChartData = {
    labels: objectivesFinancials.map(o => o.title),
    datasets: [
      {
        label: 'Budget',
        data: objectivesFinancials.map(o => o.budget),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spending',
        data: objectivesFinancials.map(o => o.spending),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
        }
      },
      title: {
        display: true,
        text: 'Budget vs. Spending by Strategic Objective',
        color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
        font: {
            size: 16
        }
      },
      tooltip: {
         callbacks: {
            label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += formatCurrency(context.parsed.y);
                }
                return label;
            }
         }
      }
    },
    scales: {
        x: {
            ticks: {
                 color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
            },
            grid: {
                color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569',
                callback: function(value: any) {
                    return formatCurrency(value);
                }
            },
            grid: {
                color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
        }
    }
  };

  const objectiveColors = objectives.map(obj => {
    const colorMap: Record<string, string> = {
      blue: 'rgba(54, 162, 235, 0.7)',
      purple: 'rgba(153, 102, 255, 0.7)',
      green: 'rgba(75, 192, 192, 0.7)',
      red: 'rgba(255, 99, 132, 0.7)',
    };
    return colorMap[obj.color] || 'rgba(201, 203, 207, 0.7)';
  });

  const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              position: 'bottom' as const,
              labels: {
                  color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
                  padding: 20,
              }
          },
          title: {
              display: true,
              color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
              font: {
                  size: 16
              }
          },
          tooltip: {
              callbacks: {
                  label: function(context: any) {
                      const label = context.label || '';
                      const value = context.raw as number;
                      const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                      return `${label}: ${formatCurrency(value)} (${percentage})`;
                  }
              }
          }
      }
  };

  const budgetPieData = {
      labels: objectivesFinancials.map(o => o.title),
      datasets: [{
          label: 'Budget',
          data: objectivesFinancials.map(o => o.budget),
          backgroundColor: objectiveColors,
          borderColor: objectiveColors.map(c => c.replace('0.7', '1')),
          borderWidth: 1,
      }],
  };

  const spendingPieData = {
      labels: objectivesFinancials.map(o => o.title),
      datasets: [{
          label: 'Spending',
          data: objectivesFinancials.map(o => o.spending),
          backgroundColor: objectiveColors,
          borderColor: objectiveColors.map(c => c.replace('0.7', '1')),
          borderWidth: 1,
      }],
  };

  const budgetPieOptions = { ...pieChartOptions, plugins: { ...pieChartOptions.plugins, title: { ...pieChartOptions.plugins.title, text: 'Budget Allocation by Objective' } } };
  const spendingPieOptions = { ...pieChartOptions, plugins: { ...pieChartOptions.plugins, title: { ...pieChartOptions.plugins.title, text: 'Spending Distribution by Objective' } } };


  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <EditableText
          isAdminMode={isAdminMode}
          initialValue={summary.title}
          onSave={(newValue) => onUpdateSummary && onUpdateSummary('title', newValue)}
          label="Financials Page Title"
          textClassName="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          inputClassName="text-3xl font-bold text-center"
        />
        <EditableText
          isAdminMode={isAdminMode}
          initialValue={summary.subtitle}
          onSave={(newValue) => onUpdateSummary && onUpdateSummary('subtitle', newValue)}
          label="Financials Page Subtitle"
          textClassName="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto"
          isTextarea
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full"><Landmark className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.budget)}</p>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-full"><Banknote className="w-8 h-8 text-red-600 dark:text-red-400" /></div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Spending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.spending)}</p>
            </div>
        </div>
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className={`${variance >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'} p-4 rounded-full`}>
                {variance >= 0 ? <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" /> : <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Variance</p>
                <p className={`text-3xl font-bold ${getVarianceColor(variance)}`}>{formatCurrency(variance)}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <div className="h-96">
                  <Pie options={budgetPieOptions} data={budgetPieData} />
              </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <div className="h-96">
                  <Pie options={spendingPieOptions} data={spendingPieData} />
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="h-96">
            <Bar options={barChartOptions} data={barChartData} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-slate-700">Detailed Financials by Thrust</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-slate-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Thrust</th>
                        <th scope="col" className="px-6 py-3 text-right">Budget</th>
                        <th scope="col" className="px-6 py-3 text-right">Spending</th>
                        <th scope="col" className="px-6 py-3 text-right">Variance</th>
                    </tr>
                </thead>
                <tbody>
                    {thrustData.map(thrust => {
                        const thrustVariance = thrust.budget - thrust.spending;
                        return (
                            <tr key={thrust.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    T{thrust.thrustId}: {thrust.thrustTitle}
                                </th>
                                <td className="px-6 py-4 text-right">
                                    <EditableText
                                        isAdminMode={isAdminMode}
                                        initialValue={formatCurrency(thrust.budget)}
                                        onSave={(newValue) => onUpdateThrust?.(thrust.id, 'budget', Number(newValue.replace(/[^0-9.-]+/g,"")))}
                                        label={`Budget for T${thrust.id}`}
                                        textClassName='font-mono'
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <EditableText
                                        isAdminMode={isAdminMode}
                                        initialValue={formatCurrency(thrust.spending)}
                                        onSave={(newValue) => onUpdateThrust?.(thrust.id, 'spending', Number(newValue.replace(/[^0-9.-]+/g,"")))}
                                        label={`Spending for T${thrust.id}`}
                                        textClassName='font-mono'
                                    />
                                </td>
                                <td className={`px-6 py-4 text-right font-bold font-mono ${getVarianceColor(thrustVariance)}`}>
                                    {formatCurrency(thrustVariance)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};