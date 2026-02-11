import React, { useState, useMemo } from 'react';
import { Lightbulb, X, CloudRain, CalendarDays, MapPin } from 'lucide-react';
import { getWeatherInfo } from './utils';
import { useLanguage } from './i18n';

export default function TripTips({ items, weather }) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('paris-trip-dismissed-tips') || '[]');
    } catch { return []; }
  });

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try { localStorage.setItem('paris-trip-dismissed-tips', JSON.stringify(next)); } catch {}
  };

  const tips = useMemo(() => {
    const result = [];
    const planned = items.filter(i => i.plannedDate);
    const unplanned = items.filter(i => !i.plannedDate && !i.hidden);

    // Tip: No plans yet
    if (planned.length === 0 && items.length > 0) {
      result.push({
        id: 'no-plans',
        icon: CalendarDays,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
        message: t('tips.noPlans'),
      });
    }

    // Tip: Too many activities on one day (5+)
    const byDate = {};
    planned.forEach(i => {
      if (!byDate[i.plannedDate]) byDate[i.plannedDate] = 0;
      byDate[i.plannedDate]++;
    });
    const busyDays = Object.entries(byDate).filter(([, count]) => count >= 5);
    if (busyDays.length > 0) {
      result.push({
        id: 'busy-day',
        icon: MapPin,
        color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
        message: t('tips.busyDay', { count: busyDays[0][1] }),
      });
    }

    // Tip: Rainy day — suggest indoor activities
    if (weather && Object.keys(weather).length > 0) {
      const rainyDates = Object.entries(weather)
        .filter(([date, w]) => {
          const info = getWeatherInfo(w.code);
          return ['CloudRain', 'CloudDrizzle', 'CloudLightning'].includes(info.icon);
        })
        .map(([date]) => date);
      const plannedRainy = planned.filter(i =>
        rainyDates.includes(i.plannedDate) && (i.type === 'Outdoor' || i.type === 'Mix')
      );
      if (plannedRainy.length > 0) {
        result.push({
          id: 'rainy-outdoor',
          icon: CloudRain,
          color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20',
          message: t('tips.rainyOutdoor'),
        });
      }
    }

    // Tip: Many unplanned activities
    if (unplanned.length > 5) {
      result.push({
        id: 'many-unplanned',
        icon: CalendarDays,
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
        message: t('tips.manyUnplanned', { count: unplanned.length }),
      });
    }

    return result.filter(tip => !dismissed.includes(tip.id));
  }, [items, weather, dismissed, t]);

  if (tips.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {tips.map(tip => {
        const Icon = tip.icon;
        return (
          <div key={tip.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border ${tip.color} border-current/10`}>
            <Lightbulb size={14} className="shrink-0 opacity-70" />
            <Icon size={14} className="shrink-0" />
            <span className="flex-1">{tip.message}</span>
            <button onClick={() => dismiss(tip.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity" aria-label="Dismiss tip">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
