import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, Calendar, Euro, AlertTriangle, EyeOff, Eye, Trash2, ExternalLink, Train, MessageSquare, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { parseTimeToMinutes, getTypeColor, isClosedOnDate, getGoogleMapsUrl } from './utils';
import { useLanguage } from './i18n';

export default function TableView({ items, sortConfig, requestSort, toggleComplete, updateDate, updateNotes, searchTerm, setSearchTerm, toggleHidden, deleteCustomItem, showHidden, simpleView }) {
  const { t } = useLanguage();
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close kebab menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <ArrowUpDown size={14} className="text-gray-300 dark:text-gray-600 ml-1" />;
    return sortConfig.direction === 'ascending'
      ? <ArrowUp size={14} className="text-blue-500 ml-1" />
      : <ArrowDown size={14} className="text-blue-500 ml-1" />;
  };

  const sortedData = React.useMemo(() => {
    let sortable = [...items];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'plannedDate') {
          if (!aVal) return 1;
          if (!bVal) return -1;
        }
        if (sortConfig.key === 'time') {
          aVal = parseTimeToMinutes(aVal);
          bVal = parseTimeToMinutes(bVal);
        }
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [items, sortConfig]);

  const filteredData = sortedData.filter(item =>
    item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder={t('table.filter')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('table.doneShown', { done: items.filter(i => i.completed).length, shown: filteredData.length })}
        </div>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-4 w-12 text-center">✓</th>
              <th className="px-4 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={() => requestSort('plannedDate')}>
                <div className="flex items-center"><Calendar size={16} className="mr-1" /> {t('table.date')} {getSortIcon('plannedDate')}</div>
              </th>
              <th className="px-4 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={() => requestSort('activity')}>
                <div className="flex items-center">{t('table.activity')} {getSortIcon('activity')}</div>
              </th>
              <th className="px-4 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={() => requestSort('type')}>
                <div className="flex items-center">{t('table.type')} {getSortIcon('type')}</div>
              </th>
              {!simpleView && <th className="px-4 py-4"><div className="flex items-center"><Train size={16} className="mr-1" /> {t('table.metro')}</div></th>}
              {!simpleView && <th className="px-4 py-4"><div className="flex items-center">{t('table.days')}</div></th>}
              {!simpleView && <th className="px-4 py-4"><div className="flex items-center"><Clock size={16} className="mr-1" /> {t('table.hours')}</div></th>}
              <th className="px-4 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={() => requestSort('price')}>
                <div className="flex items-center"><Euro size={16} className="mr-1" /> {t('table.price')} {getSortIcon('price')}</div>
              </th>
              {!simpleView && <th className="px-4 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" onClick={() => requestSort('time')}>
                <div className="flex items-center"><MapPin size={16} className="mr-1" /> {t('table.transit')} {getSortIcon('time')}</div>
              </th>}
              <th className="px-4 py-4 w-20 text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((item) => {
              const closed = isClosedOnDate(item.days, item.plannedDate);
              const isHidden = item.hidden;
              const isExpanded = expandedNoteId === item.id;
              return (
                <React.Fragment key={item.id}>
                  <tr className={`transition-colors ${
                    isHidden ? 'opacity-50 bg-gray-50/80 dark:bg-gray-800/50' :
                    item.completed ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100'
                  }`}>
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input type="date" value={item.plannedDate}
                          onChange={(e) => updateDate(item.id, e.target.value)}
                          className={`border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 ${item.completed ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-white dark:bg-gray-700 dark:text-gray-200'}`} />
                        {closed === true && (
                          <span title={t('table.closedOnDay', { days: item.days })}>
                            <AlertTriangle size={14} className="text-red-500" />
                          </span>
                        )}
                        {closed === 'maybe' && (
                          <span title={t('table.checkVenue')}>
                            <AlertTriangle size={14} className="text-amber-700 dark:text-amber-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-medium ${item.completed ? 'line-through decoration-gray-400 dark:decoration-gray-500' : ''}`}>
                      <div className="flex items-center gap-2">
                        {item.activity}
                        {item.isCustom && (
                          <span className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                            {t('table.custom')}
                          </span>
                        )}
                        <a href={getGoogleMapsUrl(item.lat, item.lon, item.activity)} target="_blank" rel="noopener noreferrer"
                          title={t('table.openMaps')} className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.completed ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400' : getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    {!simpleView && <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{item.metro || '—'}</td>}
                    {!simpleView && <td className="px-4 py-3 text-xs">{item.days}</td>}
                    {!simpleView && <td className="px-4 py-3 font-mono text-xs">{item.hours}</td>}
                    <td className="px-4 py-3 font-medium text-xs">{item.price}</td>
                    {!simpleView && (
                      <td className="px-4 py-3 text-xs">
                        <span className="flex items-center gap-1" title={
                          item.timeBreakdown
                            ? `${item.timeBreakdown.walk1}m walk → ${item.timeBreakdown.metro}m metro → ${item.timeBreakdown.walk2}m walk`
                            : ''
                        }>
                          {item.transitMethod === 'metro' && <Train size={12} className="text-indigo-500 shrink-0" />}
                          {item.time}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setExpandedNoteId(isExpanded ? null : item.id)}
                          title={item.notes ? t('table.editNote') : t('table.addNote')}
                          aria-label={item.notes ? t('table.editNote') : t('table.addNote')}
                          className={`p-2 rounded-lg transition-colors ${item.notes ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                          <MessageSquare size={14} />
                        </button>
                        {item.isCustom ? (
                          <button onClick={() => deleteCustomItem(item.id)} title={t('table.deleteCustom')}
                            aria-label={t('table.deleteCustom')}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <button onClick={() => toggleHidden(item.id)} title={isHidden ? t('table.unhide') : t('table.hide')}
                            aria-label={isHidden ? t('table.unhide') : t('table.hide')}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-blue-50/30 dark:bg-blue-900/10">
                      <td colSpan={simpleView ? 6 : 10} className="px-4 py-3">
                        <div className="flex items-start gap-2 max-w-2xl ml-8">
                          <MessageSquare size={14} className="text-gray-400 dark:text-gray-500 mt-1.5 shrink-0" />
                          <textarea
                            value={item.notes || ''}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            placeholder={t('table.notesPlaceholder')}
                            rows={2}
                            className="flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {filteredData.map((item) => {
          const closed = isClosedOnDate(item.days, item.plannedDate);
          const isHidden = item.hidden;
          const isMenuOpen = openMenuId === item.id;
          const isExpanded = expandedNoteId === item.id;
          return (
            <div key={item.id} className={`px-4 py-3 ${
              isHidden ? 'opacity-50 bg-gray-50/80 dark:bg-gray-800/50' :
              item.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
            }`}>
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer shrink-0" />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Activity name + type */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${
                      item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {item.activity}
                    </span>
                    {item.isCustom && (
                      <span className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                        {t('table.custom')}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.completed ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400' : getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>

                  {/* Date + Price + Closed warning */}
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <input type="date" value={item.plannedDate}
                        onChange={(e) => updateDate(item.id, e.target.value)}
                        className={`border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 ${item.completed ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-white dark:bg-gray-700 dark:text-gray-200'}`} />
                      {closed === true && (
                        <span title={t('table.closedOnDay', { days: item.days })}>
                          <AlertTriangle size={13} className="text-red-500" />
                        </span>
                      )}
                      {closed === 'maybe' && (
                        <span title={t('table.checkVenue')}>
                          <AlertTriangle size={13} className="text-amber-700 dark:text-amber-400" />
                        </span>
                      )}
                    </div>
                    <span className={`font-medium ${item.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      {item.price}
                    </span>
                    {item.notes && (
                      <MessageSquare size={12} className="text-blue-500" />
                    )}
                  </div>
                </div>

                {/* Kebab menu */}
                <div className="relative shrink-0" ref={isMenuOpen ? menuRef : null}>
                  <button onClick={() => setOpenMenuId(isMenuOpen ? null : item.id)}
                    aria-label={t('table.actions')}
                    aria-expanded={isMenuOpen}
                    className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                  {isMenuOpen && (
                    <div role="menu" className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-[180px] py-1 overflow-hidden">
                      {/* Notes */}
                      <button onClick={() => { setExpandedNoteId(isExpanded ? null : item.id); setOpenMenuId(null); }}
                        className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                        <MessageSquare size={14} className={item.notes ? 'text-blue-500' : 'text-gray-400'} />
                        {item.notes ? t('table.editNote') : t('table.addNote')}
                      </button>
                      {/* Maps */}
                      <a href={getGoogleMapsUrl(item.lat, item.lon, item.activity)} target="_blank" rel="noopener noreferrer"
                        onClick={() => setOpenMenuId(null)}
                        className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                        <ExternalLink size={14} className="text-gray-400" />
                        {t('table.openMaps')}
                      </a>
                      <div className="border-t border-gray-100 dark:border-gray-700" />
                      {/* Hide / Delete */}
                      {item.isCustom ? (
                        <button onClick={() => { deleteCustomItem(item.id); setOpenMenuId(null); }}
                          className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400">
                          <Trash2 size={14} />
                          {t('table.deleteCustom')}
                        </button>
                      ) : (
                        <button onClick={() => { toggleHidden(item.id); setOpenMenuId(null); }}
                          className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                          {isHidden ? <Eye size={14} className="text-gray-400" /> : <EyeOff size={14} className="text-gray-400" />}
                          {isHidden ? t('table.unhide') : t('table.hide')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded notes */}
              {isExpanded && (
                <div className="mt-2 ml-8">
                  <textarea
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder={t('table.notesPlaceholder')}
                    rows={2}
                    className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">{t('table.noResultsTitle')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('table.noResultsDesc')}</p>
        </div>
      )}
    </>
  );
}
