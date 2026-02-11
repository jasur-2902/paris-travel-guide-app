import React, { useState, useMemo } from 'react';
import { BarChart3, ChevronDown, CheckCircle2, MapPin, Clock, Euro, Footprints } from 'lucide-react';
import { parsePrice, parseTimeToMinutes, getTypeColor } from './utils';
import { useLanguage } from './i18n';

export default function TripStats({ items }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const planned = items.filter(i => i.plannedDate).length;
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Type breakdown
    const typeCounts = {};
    items.forEach(i => {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });
    const typeBreakdown = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1]);

    // Cost per day
    const daySpend = {};
    items.filter(i => i.plannedDate).forEach(i => {
      if (!daySpend[i.plannedDate]) daySpend[i.plannedDate] = 0;
      daySpend[i.plannedDate] += parsePrice(i.price);
    });
    const sortedDays = Object.entries(daySpend).sort((a, b) => b[1] - a[1]);
    const mostExpensiveDay = sortedDays[0] || null;

    // Total transit time (walking)
    const totalTransitMin = items.reduce((sum, i) => {
      const m = parseTimeToMinutes(i.time);
      return m === Infinity ? sum : sum + m;
    }, 0);

    // Total cost
    const totalCost = items.reduce((sum, i) => sum + parsePrice(i.price), 0);

    // Days planned
    const uniqueDays = new Set(items.filter(i => i.plannedDate).map(i => i.plannedDate));

    return {
      total, completed, planned, progressPct,
      typeBreakdown, mostExpensiveDay, totalTransitMin,
      totalCost, daysPlanned: uniqueDays.size,
    };
  }, [items]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm mb-4">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <BarChart3 size={14} className="text-blue-500" />
            <strong className="text-gray-900 dark:text-gray-100">{t('stats.title')}</strong>
          </span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-500" />
            {stats.completed}/{stats.total} {t('stats.completed')}
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            {stats.daysPlanned} {t('stats.daysPlanned')}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-700 space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{t('stats.progress')}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{stats.progressPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.progressPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total cost */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                <Euro size={12} />
                {t('stats.totalCost')}
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{'\u20AC'}{stats.totalCost.toFixed(2)}</div>
            </div>

            {/* Total transit */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                <Footprints size={12} />
                {t('stats.totalTransit')}
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalTransitMin >= 60
                  ? `${Math.floor(stats.totalTransitMin / 60)}h ${stats.totalTransitMin % 60}m`
                  : `${stats.totalTransitMin}m`
                }
              </div>
            </div>

            {/* Days planned */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                <MapPin size={12} />
                {t('stats.daysPlanned')}
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{stats.daysPlanned} {t('stats.days')}</div>
            </div>

            {/* Most expensive day */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                <Clock size={12} />
                {t('stats.priciest')}
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.mostExpensiveDay
                  ? `${'\u20AC'}${stats.mostExpensiveDay[1].toFixed(0)}`
                  : '—'
                }
              </div>
            </div>
          </div>

          {/* Type breakdown */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{t('stats.byType')}</div>
            <div className="flex flex-wrap gap-1.5">
              {stats.typeBreakdown.map(([type, count]) => (
                <span key={type} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
                  {type} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
