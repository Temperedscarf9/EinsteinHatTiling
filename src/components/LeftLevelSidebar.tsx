/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

interface LeftLevelSidebarProps {
  generationLevel: number;
  onLevelChange: (lvl: number) => void;
  totalTiles: number;
}

export const LeftLevelSidebar: React.FC<LeftLevelSidebarProps> = ({
  generationLevel,
  onLevelChange,
  totalTiles
}) => {
  const levels = [
    { lvl: 6, label: '6 阶', tiles: '121393片', desc: '超大规模' },//极限规模
    { lvl: 5, label: '5 阶', tiles: '17711片', desc: '超大规模' },//超大铺砌
    { lvl: 4, label: '4 阶', tiles: '2584片', desc: '超大规模' },
    { lvl: 3, label: '3 阶', tiles: '377片', desc: '宏观平铺' },
    { lvl: 2, label: '2 阶', tiles: '55片', desc: '标准铺砌' },
    { lvl: 1, label: '1 阶', tiles: '8片', desc: '超瓷砖簇' },
    { lvl: 0, label: '0 阶', tiles: '1片', desc: '初始单片' }
  ];

  return (
    <aside
      className="w-20 sm:w-28 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-4 px-2 z-20 select-none shadow-xs"
      aria-label="阶数切换"
    >
      {/* Top Header */}
      <div className="flex flex-col items-center gap-1.5 pb-3 border-b border-slate-200 dark:border-slate-800 text-center">
        <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Layers className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
          阶数切换
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          Level
        </span>
      </div>

      {/* Quick Step Up Button */}
      <div className="flex flex-col items-center my-1">
        <button
          onClick={() => onLevelChange(Math.min(4, generationLevel + 1))}
          disabled={generationLevel >= 4}
          className="w-full py-1.5 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
          title="提升一阶 (+1 Level)"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Main 5 Level Buttons (0 阶 to 4 阶) */}
      <div className="flex flex-col gap-2 my-auto">
        {levels.map((item) => {
          const isActive = generationLevel === item.lvl;

          return (
            <button
              key={item.lvl}
              onClick={() => onLevelChange(item.lvl)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer border relative ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-500 shadow-sm ring-2 ring-sky-400/40 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
              title={`${item.label} (${item.desc})：${item.tiles}`}
            >
              <span className="text-xs font-bold leading-none mb-1">
                {item.label}
              </span>
              <span
                className={`text-[10px] font-mono leading-none ${
                  isActive ? 'text-sky-100' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                {item.tiles}
              </span>

              {/* Indicator dot */}
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-sky-300 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Step Down Button */}
      <div className="flex flex-col items-center my-1">
        <button
          onClick={() => onLevelChange(Math.max(0, generationLevel - 1))}
          disabled={generationLevel <= 0}
          className="w-full py-1.5 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
          title="降低一阶 (-1 Level)"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Summary */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">
          当前平铺
        </span>
        <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 block mt-0.5 tabular-nums">
          {totalTiles} 片
        </span>
      </div>
    </aside>
  );
};
