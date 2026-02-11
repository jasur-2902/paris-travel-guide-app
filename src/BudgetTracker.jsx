import React, { useState } from 'react';
import { Euro, PiggyBank } from 'lucide-react';
import { parsePrice } from './utils';

export default function BudgetTracker({ items, budget, onBudgetChange }) {
  const [editing, setEditing] = useState(false);
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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm mb-4">
      <div className="flex items-center gap-1.5 text-gray-600">
        <Euro size={14} />
        <span>Spent: <strong className="text-gray-900">€{spent.toFixed(2)}</strong></span>
      </div>
      <span className="text-gray-300">|</span>
      <div className="text-gray-600">
        Planned: <strong className="text-gray-900">€{planned.toFixed(2)}</strong>
      </div>
      <span className="text-gray-300">|</span>
      <div className="text-gray-600">
        Total: <strong className="text-gray-900">€{total.toFixed(2)}</strong>
      </div>
      <span className="text-gray-300">|</span>
      <div className="flex items-center gap-1.5">
        <PiggyBank size={14} className="text-gray-400" />
        {editing ? (
          <div className="flex items-center gap-1">
            <span className="text-gray-600">€</span>
            <input
              type="number"
              min="0"
              step="10"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-20 border border-gray-300 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:border-blue-400"
              autoFocus
            />
            <button onClick={handleSave} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Save</button>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
          </div>
        ) : (
          <button onClick={() => { setInputVal(budget > 0 ? String(budget) : ''); setEditing(true); }}
            className="text-gray-600 hover:text-blue-600">
            {budget > 0 ? (
              <>Budget: <strong className="text-gray-900">€{budget.toFixed(2)}</strong></>
            ) : (
              <span className="text-gray-400 underline decoration-dashed">Set budget</span>
            )}
          </button>
        )}
      </div>
      {remaining !== null && (
        <>
          <span className="text-gray-300">|</span>
          <div className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            Remaining: <strong>€{remaining.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
}
