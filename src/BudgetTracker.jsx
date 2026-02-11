import React, { useState } from 'react';
import { Euro, PiggyBank, ChevronDown } from 'lucide-react';
import { parsePrice } from './utils';
import { useLanguage } from './i18n';

export default function BudgetTracker({ items, budget, onBudgetChange }) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [inputVal, setInputVal] = useState(budget > 0 ? String(budget) : '');

  const planned = items
    .filter(i => i.plannedDate && !i.completed)
    .reduce((sum, i) => sum + parsePrice(i.price), 0);

  const spent = items
    .filter(i => i.completed)
    .reduce((sum, i) => sum + parsePrice(i.price), 0);

  const total = planned + spent;
  const remaining = budget > 0 ? budget - spent : null;

  const handleSave = () => {
    const val = parseFloat(inputVal);
    onBudgetChange(val > 0 ? val : 0);
    setEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm mb-4">
      {/* Collapsed summary — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <Euro size={14} />
            {t('budget.spent')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{spent.toFixed(2)}</strong>
          </span>
          {budget > 0 && (
            <>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-1.5">
                <PiggyBank size={14} className="text-gray-400 dark:text-gray-500" />
                {t('budget.budget')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{budget.toFixed(2)}</strong>
              </span>
            </>
          )}
          {remaining !== null && (
            <>
              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
              <span className={`hidden sm:inline ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {t('budget.remaining')}: <strong>{'\u20AC'}{remaining.toFixed(2)}</strong>
              </span>
            </>
          )}
        </div>
        <ChevronDown size={16} className={`text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="text-gray-600 dark:text-gray-300">
              {t('budget.spent')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{spent.toFixed(2)}</strong>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="text-gray-600 dark:text-gray-300">
              {t('budget.planned')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{planned.toFixed(2)}</strong>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="text-gray-600 dark:text-gray-300">
              {t('budget.total')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{total.toFixed(2)}</strong>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-1.5">
              <PiggyBank size={14} className="text-gray-400 dark:text-gray-500" />
              {editing ? (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300">{'\u20AC'}</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="w-20 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:border-blue-400 bg-white dark:bg-gray-700 dark:text-gray-200"
                    autoFocus
                  />
                  <button onClick={handleSave} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium">{t('budget.save')}</button>
                  <button onClick={() => setEditing(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs">{t('budget.cancel')}</button>
                </div>
              ) : (
                <button onClick={() => { setInputVal(budget > 0 ? String(budget) : ''); setEditing(true); }}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {budget > 0 ? (
                    <>{t('budget.budget')}: <strong className="text-gray-900 dark:text-gray-100">{'\u20AC'}{budget.toFixed(2)}</strong></>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 underline decoration-dashed">{t('budget.setBudget')}</span>
                  )}
                </button>
              )}
            </div>
            {remaining !== null && (
              <>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <div className={remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {t('budget.remaining')}: <strong>{'\u20AC'}{remaining.toFixed(2)}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
