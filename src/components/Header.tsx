import React from 'react';
import { Download, Info, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  onExportSVG: () => void;
  onExportPNG: () => void;
  onOpenInfoModal: () => void;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportSVG,
  onExportPNG,
  onOpenInfoModal,
  isSettingsOpen,
  onToggleSettings
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            Einstein Monotile Studio
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap">
            非周期“帽子”单瓷砖铺砌渲染
          </span>
        </div>
      </div>

      {/* Zone 2: Concise single-line navigation / feature items */}
      <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={onOpenInfoModal}
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>数学原理与背景</span>
        </button>
        <span className="text-slate-300 dark:text-slate-700 select-none">/</span>
        <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
          无需周期平移 · 强迫非周期性
        </span>
      </nav>

      {/* Zone 3: 1 primary action group */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleSettings}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer border ${
            isSettingsOpen
              ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
          }`}
          title="切换配色与线条设置面板"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="hidden sm:inline">视觉与配色</span>
        </button>

        <button
          onClick={onExportPNG}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          title="导出高分辨率 PNG 图像"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PNG</span>
        </button>

        <button
          onClick={onExportSVG}
          className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          title="导出无损矢量 SVG 文件"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">矢量</span>
          <span>SVG</span>
        </button>
      </div>
    </header>
  );
};
