import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Euro, EyeOff, Eye, Trash2, ExternalLink } from 'lucide-react';
import { getDayLabel, getTypeColor, isClosedOnDate, parsePrice, parseTimeToMinutes, getGoogleMapsUrl } from './utils';

export default function DayPlanner({ items, toggleComplete, updateDate, toggleHidden, deleteCustomItem, showHidden }) {
  // Group items by planned date
  const scheduled = {};
  const unscheduled = [];

  items.forEach(item => {
    if (item.plannedDate) {
      if (!scheduled[item.plannedDate]) scheduled[item.plannedDate] = [];
      scheduled[item.plannedDate].push(item);
    } else {
      unscheduled.push(item);
    }
  });

  const sortedDates = Object.keys(scheduled).sort();

  const ActionButton = ({ item }) => {
    if (item.isCustom) {
      return (
        <button onClick={() => deleteCustomItem(item.id)} title="Delete custom activity"
          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors shrink-0">
          <Trash2 size={14} />
        </button>
      );
    }
    return (
      <button onClick={() => toggleHidden(item.id)} title={item.hidden ? 'Unhide activity' : 'Hide activity'}
        className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors shrink-0">
        {item.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {sortedDates.length === 0 && unscheduled.length === items.length && (
        <div className="text-center py-12 text-gray-400">
          No dates planned yet. Assign dates in the Table view to see your itinerary here.
        </div>
      )}

      {sortedDates.map(date => {
        const dayItems = scheduled[date];
        const totalCost = dayItems.reduce((sum, i) => sum + parsePrice(i.price), 0);
        const totalTransit = dayItems.reduce((sum, i) => {
          const m = parseTimeToMinutes(i.time);
          return m === Infinity ? sum : sum + m;
        }, 0);
        const hasWarnings = dayItems.some(i => isClosedOnDate(i.days, date));

        return (
          <div key={date} className={`bg-white rounded-xl border ${hasWarnings ? 'border-red-200' : 'border-gray-200'} overflow-hidden`}>
            {/* Day header */}
            <div className={`px-5 py-3 flex items-center justify-between ${hasWarnings ? 'bg-red-50' : 'bg-blue-50'}`}>
              <h3 className="font-semibold text-gray-800">{getDayLabel(date)}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Euro size={13} /> €{totalCost.toFixed(2)}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> ~{totalTransit} min transit</span>
                <span>{dayItems.filter(i => i.completed).length}/{dayItems.length} done</span>
              </div>
            </div>

            {/* Activities */}
            <ul className="divide-y divide-gray-100">
              {dayItems.map(item => {
                const closed = isClosedOnDate(item.days, date);
                return (
                  <li key={item.id} className={`px-5 py-3 flex items-start gap-3 ${
                    item.hidden ? 'opacity-50 bg-gray-50/80' : item.completed ? 'bg-gray-50' : ''
                  }`}>
                    <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {item.activity}
                        </span>
                        <a href={getGoogleMapsUrl(item.lat, item.lon)} target="_blank" rel="noopener noreferrer"
                          title="Open in Google Maps" className="text-gray-300 hover:text-blue-500 transition-colors">
                          <ExternalLink size={12} />
                        </a>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${item.completed ? 'bg-gray-200 text-gray-500' : getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{item.hours}</span>
                        <span>{item.price}</span>
                        <span>{item.time}</span>
                        <span className="text-gray-400">{item.location}</span>
                      </div>
                      {closed === true && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium">
                          <AlertTriangle size={12} />
                          Likely closed on this day (open {item.days})
                        </div>
                      )}
                      {closed === 'maybe' && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-yellow-600 font-medium">
                          <AlertTriangle size={12} />
                          Open on select days only — check venue
                        </div>
                      )}
                    </div>
                    <ActionButton item={item} />
                    <button
                      onClick={() => updateDate(item.id, '')}
                      className="text-[10px] text-gray-400 hover:text-red-500 shrink-0 mt-1"
                      title="Remove from this day"
                    >
                      remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Unscheduled */}
      {unscheduled.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">Unscheduled ({unscheduled.length})</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {unscheduled.map(item => (
              <li key={item.id} className={`px-5 py-2.5 flex items-center gap-3 ${item.hidden ? 'opacity-50 bg-gray-50/80' : ''}`}>
                <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer shrink-0" />
                <span className={`flex-1 text-sm flex items-center gap-1.5 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.activity}
                  <a href={getGoogleMapsUrl(item.lat, item.lon)} target="_blank" rel="noopener noreferrer"
                    title="Open in Google Maps" className="text-gray-300 hover:text-blue-500 transition-colors inline-flex">
                    <ExternalLink size={12} />
                  </a>
                  {item.isCustom && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                      Custom
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-400">{item.days}</span>
                <span className="text-xs text-gray-400">{item.price}</span>
                <ActionButton item={item} />
                <input type="date" min="2026-02-02" max="2026-02-23"
                  value="" onChange={(e) => updateDate(item.id, e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
