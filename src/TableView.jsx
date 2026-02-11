import React from 'react';
import { Search, MapPin, Clock, Calendar, Euro, CloudSun, AlertTriangle, EyeOff, Eye, Trash2, ExternalLink } from 'lucide-react';
import { parseTimeToMinutes, getTypeColor, isClosedOnDate, getGoogleMapsUrl } from './utils';

export default function TableView({ items, sortConfig, requestSort, toggleComplete, updateDate, searchTerm, setSearchTerm, toggleHidden, deleteCustomItem, showHidden }) {
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <span className="text-gray-300 ml-1">↕</span>;
    return sortConfig.direction === 'ascending'
      ? <span className="text-blue-500 ml-1">↑</span>
      : <span className="text-blue-500 ml-1">↓</span>;
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
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Filter by activity or type..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          {items.filter(i => i.completed).length} done / {filteredData.length} shown
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-12 text-center">✓</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('plannedDate')}>
                <div className="flex items-center"><Calendar size={16} className="mr-2" /> Plan Date {getSortIcon('plannedDate')}</div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('activity')}>
                <div className="flex items-center">Activity {getSortIcon('activity')}</div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('type')}>
                <div className="flex items-center"><CloudSun size={16} className="mr-2" /> Type {getSortIcon('type')}</div>
              </th>
              <th className="px-6 py-4"><div className="flex items-center">Days Open</div></th>
              <th className="px-6 py-4"><div className="flex items-center"><Clock size={16} className="mr-2" /> Hours</div></th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('price')}>
                <div className="flex items-center"><Euro size={16} className="mr-2" /> Price {getSortIcon('price')}</div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => requestSort('time')}>
                <div className="flex items-center"><MapPin size={16} className="mr-2" /> Transit {getSortIcon('time')}</div>
              </th>
              <th className="px-4 py-4 w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => {
              const closed = isClosedOnDate(item.days, item.plannedDate);
              const isHidden = item.hidden;
              return (
                <tr key={item.id} className={`transition-colors ${
                  isHidden ? 'opacity-50 bg-gray-50/80' :
                  item.completed ? 'bg-gray-50 text-gray-400' : 'hover:bg-blue-50 text-gray-900'
                }`}>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <input type="date" min="2026-02-02" max="2026-02-23" value={item.plannedDate}
                        onChange={(e) => updateDate(item.id, e.target.value)}
                        className={`border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 ${item.completed ? 'bg-gray-100 text-gray-400' : 'bg-white'}`} />
                      {closed === true && (
                        <span title={`Closed on this day (open ${item.days})`}>
                          <AlertTriangle size={14} className="text-red-500" />
                        </span>
                      )}
                      {closed === 'maybe' && (
                        <span title="Check venue for exact open days">
                          <AlertTriangle size={14} className="text-yellow-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-medium ${item.completed ? 'line-through decoration-gray-400' : ''}`}>
                    <div className="flex items-center gap-2">
                      {item.activity}
                      {item.isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                          Custom
                        </span>
                      )}
                      <a href={getGoogleMapsUrl(item.lat, item.lon)} target="_blank" rel="noopener noreferrer"
                        title="Open in Google Maps" className="text-gray-300 hover:text-blue-500 transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.completed ? 'bg-gray-200 text-gray-500' : getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">{item.days}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.hours}</td>
                  <td className="px-6 py-4 font-medium text-xs">{item.price}</td>
                  <td className="px-6 py-4 text-xs">{item.time}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.isCustom ? (
                        <button onClick={() => deleteCustomItem(item.id)} title="Delete custom activity"
                          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      ) : (
                        <button onClick={() => toggleHidden(item.id)} title={isHidden ? 'Unhide activity' : 'Hide activity'}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                          {isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-12 text-center text-gray-500">No activities found matching your search.</div>
      )}
    </>
  );
}
