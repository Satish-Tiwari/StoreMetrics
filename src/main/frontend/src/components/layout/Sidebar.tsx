import React from 'react';
import { LayoutDashboard, Store, MessageSquare, LogOut, Download, Moon, Sun, Monitor, AlertTriangle, TrendingUp, Settings, FileText, RefreshCcw } from 'lucide-react';
import type { TabId } from '@/types';
import { useTheme } from '@/components/providers/ThemeProvider';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: TabId | 'data-explorer'; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview Analytics', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'data-explorer', label: 'Data Explorer', icon: <Store className="w-4 h-4" /> },
  { id: 'sync',     label: 'Data Sync Manager',  icon: <RefreshCcw className="w-4 h-4" /> },
  { id: 'chat',     label: 'AI Assistant Chat',   icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'reports',  label: 'Reports Exporter',    icon: <FileText className="w-4 h-4" /> },
];

/**
 * Fixed left-hand sidebar with branding, store selector, navigation, and logout.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 bg-slate-950 flex flex-col justify-between shrink-0 border-r border-slate-800 text-white">
      {/* Top section */}
      <div>
        {/* Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            StoreMetrics
          </span>
        </div>


        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map(({ id, label, icon }) => {
            const isDataExplorer = id === 'data-explorer';
            const isActive = activeTab === id || (isDataExplorer && activeTab.startsWith('data-'));
            const [isExpanded, setIsExpanded] = React.useState(isActive);

            if (isDataExplorer) {
              return (
                <div key={id} className="space-y-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-full flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="pl-11 pr-4 py-1 space-y-1">
                      {['products', 'categories', 'orders', 'customers', 'coupons', 'refunds', 'reviews'].map(sub => (
                        <button
                          key={sub}
                          onClick={() => onTabChange(`data-${sub}` as TabId)}
                          className={`w-full text-left py-1.5 px-2 rounded-md text-sm transition ${
                            activeTab === `data-${sub}`
                              ? 'text-blue-400 font-medium'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="capitalize">{sub}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                  activeTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Theme / Logout */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-4">
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex justify-center p-1.5 rounded-md transition ${theme === 'light' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-white'}`}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex justify-center p-1.5 rounded-md transition ${theme === 'dark' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-white'}`}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex-1 flex justify-center p-1.5 rounded-md transition ${theme === 'system' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-white'}`}
            title="System Preference"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-semibold text-slate-300 text-sm">
              AD
            </div>
            <div className="truncate w-32">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Session Active</p>
              <p className="text-xs font-semibold truncate text-slate-300">Administrator</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
