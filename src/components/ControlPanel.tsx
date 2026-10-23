/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TileShapeType, ColorTheme, TilingStats } from '../types/monotile';
import { SHAPE_DEFINITIONS, COLOR_THEMES } from '../lib/monotileEngine';
import { Palette, Eye, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  currentShape: TileShapeType;
  colorTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  showOutlines: boolean;
  onToggleOutlines: () => void;
  highlightReflected: boolean;
  onToggleHighlightReflected: () => void;
  showCenters: boolean;
  onToggleShowCenters: () => void;
  stats: TilingStats;
  onOpenInfoModal: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentShape,
  colorTheme,
  onThemeChange,
  showOutlines,
  onToggleOutlines,
  highlightReflected,
  onToggleHighlightReflected,
  showCenters,
  onToggleShowCenters,
  stats,
  onOpenInfoModal
}) => {
  const currentShapeInfo = SHAPE_DEFINITIONS[currentShape];

  return (
    <aside className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-y-auto flex flex-col p-5 gap-5 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          视觉与色彩控制
        </span>
        <button
          onClick={onOpenInfoModal}
          className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>数学背景</span>
        </button>
      </div>

      {/* 1. Display Toggles */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Eye className="w-3.5 h-3.5" />
          <span>渲染显示开关</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
            <span>高亮反射镜像手性 (1/7 比例)</span>
            <input
              type="checkbox"
              checked={highlightReflected}
              onChange={onToggleHighlightReflected}
              className="w-4 h-4 rounded text-sky-600 dark:text-sky-500 cursor-pointer accent-sky-600"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
            <span>显示几何外边框线条</span>
            <input
              type="checkbox"
              checked={showOutlines}
              onChange={onToggleOutlines}
              className="w-4 h-4 rounded text-sky-600 dark:text-sky-500 cursor-pointer accent-sky-600"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
            <span>标出瓷砖几何中心点</span>
            <input
              type="checkbox"
              checked={showCenters}
              onChange={onToggleShowCenters}
              className="w-4 h-4 rounded text-sky-600 dark:text-sky-500 cursor-pointer accent-sky-600"
            />
          </label>
        </div>
      </section>

      {/* 2. Color Theme Selection */}
      <section className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Palette className="w-3.5 h-3.5" />
          <span>配色主题 (Color Scheme)</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((themeKey) => {
            const theme = COLOR_THEMES[themeKey];
            const isSelected = colorTheme === themeKey;

            return (
              <button
                key={themeKey}
                onClick={() => onThemeChange(themeKey)}
                className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 dark:border-sky-400 bg-sky-50/60 dark:bg-sky-950/40 ring-1 ring-sky-400/50'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.unflippedFill }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: theme.flippedFill }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {theme.chineseName}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>


      {/* 6. Current Monotile Card */}
      <section className="mt-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {currentShapeInfo.chineseName}
          </span>
          <button
            onClick={onOpenInfoModal}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>详情</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentShapeInfo.description}
        </p>

        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-y-1.5 text-[11px]">
          <div>
            <span className="text-slate-400 dark:text-slate-500">边数：</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {currentShapeInfo.vertices} 边
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">手性：</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono">
              约 1/7 镜像
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">未翻转：</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
              {stats.unflippedCount}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500">镜像翻转：</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
              {stats.flippedCount} ({stats.reflectionRatio.toFixed(1)}%)
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
};
