/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TileShapeType, TilingStats } from '../types/monotile';
import { Sliders, Play, Pause } from 'lucide-react';
import { SHAPE_DEFINITIONS } from '../lib/monotileEngine';

interface BottomShapeBarProps {
  currentShape: TileShapeType;
  onSelectShape: (shape: TileShapeType) => void;
  sliderValue: number;
  onSliderChange: (val: number) => void;
  stats: TilingStats;
}

/** 5 个标准形态对应的 sliderValue，按升序排列 */
const STOPS: number[] = [
  SHAPE_DEFINITIONS.chevron.sliderValue,  // 0
  SHAPE_DEFINITIONS.hat.sliderValue,      // ≈ 36.60
  SHAPE_DEFINITIONS.spectre.sliderValue,  // 50
  SHAPE_DEFINITIONS.turtle.sliderValue,   // ≈ 63.40
  SHAPE_DEFINITIONS.comet.sliderValue     // 100
].sort((a, b) => a - b);

/** 每段（关键点 → 关键点）持续时间，单位 ms。端点速度为 0，故停留感最强。 */
const SEG_DURATION_MS = 1000;

/** 重启播放时若当前位置距某关键点在阈值内，则吸附到该关键点 */
const SNAP_THRESHOLD = 0.5;

/** 严格递增/递减查找，返回 null 表示已到边界 */
function findNextStop(current: number, dir: 1 | -1): number | null {
  if (dir > 0) {
    for (const s of STOPS) if (s > current) return s;
    return null;
  } else {
    for (let i = STOPS.length - 1; i >= 0; i--) {
      if (STOPS[i] < current) return STOPS[i];
    }
    return null;
  }
}

function snapToStop(current: number): number {
  let nearest = STOPS[0];
  let minDiff = Infinity;
  for (const s of STOPS) {
    const d = Math.abs(s - current);
    if (d < minDiff) {
      minDiff = d;
      nearest = s;
    }
  }
  return minDiff < SNAP_THRESHOLD ? nearest : current;
}

export const BottomShapeBar: React.FC<BottomShapeBarProps> = ({
                                                                currentShape,
                                                                onSelectShape,
                                                                sliderValue,
                                                                onSliderChange,
                                                                stats
                                                              }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // 追踪最新 sliderValue（避免闭包捕获旧值）
  const sliderValueRef = useRef<number>(sliderValue);
  useEffect(() => {
    sliderValueRef.current = sliderValue;
  }, [sliderValue]);

  const isPlayingRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef<{
    s0: number;
    s1: number;
    t0: number;
    T: number;
    dir: 1 | -1;
  } | null>(null);

  // 卸载时清理
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const stopPlay = useCallback(() => {
    isPlayingRef.current = false;
    stateRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  /**
   * 每帧回调：
   *   position(t) = (s0+s1)/2 + (s0−s1)/2 · cos(π·t/T)
   *   → t=0 为 cos 波峰 (s0)，t=T 为 cos 波谷 (s1)
   *   → 两端速度为 0，关键点停留时间最长
   */
  const tick = useCallback(() => {
    if (!isPlayingRef.current) return;
    const st = stateRef.current;
    if (!st) return;

    const now = performance.now();
    const p = Math.min(1, (now - st.t0) / st.T);
    const mid = (st.s0 + st.s1) / 2;
    const amp = (st.s0 - st.s1) / 2;
    const s = mid + amp * Math.cos(Math.PI * p);

    sliderValueRef.current = s;
    onSliderChange(s);

    if (p >= 1) {
      // 当前段结束，准备下一段
      const current = st.s1;
      let dir = st.dir;

      // 边界反转
      if (dir === 1 && current >= STOPS[STOPS.length - 1]) {
        dir = -1;
      } else if (dir === -1 && current <= STOPS[0]) {
        dir = 1;
      }

      let next = findNextStop(current, dir);
      if (next === null) {
        dir = dir === 1 ? -1 : 1;
        next = findNextStop(current, dir);
      }
      if (next === null) {
        stopPlay();
        return;
      }

      stateRef.current = {
        s0: current,
        s1: next,
        t0: now,
        T: SEG_DURATION_MS,
        dir
      };
    }

    if (isPlayingRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [onSliderChange, stopPlay]);

  const startPlay = useCallback(() => {
    const raw = sliderValueRef.current;
    const start = snapToStop(raw);

    // 起点在左半边向右，右半边向左 → 视觉上更自然
    const mid = (STOPS[0] + STOPS[STOPS.length - 1]) / 2;
    let dir: 1 | -1 = start <= mid ? 1 : -1;
    let next = findNextStop(start, dir);
    if (next === null) {
      dir = dir === 1 ? -1 : 1;
      next = findNextStop(start, dir);
    }
    if (next === null) return;

    // 若发生吸附，立即同步位置（避免滑块卡在中间态）
    if (start !== raw) {
      sliderValueRef.current = start;
      onSliderChange(start);
    }

    stateRef.current = {
      s0: start,
      s1: next,
      t0: performance.now(),
      T: SEG_DURATION_MS,
      dir
    };
    isPlayingRef.current = true;
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [onSliderChange, tick]);

  const handlePlayToggle = () => {
    if (isPlaying) stopPlay();
    else startPlay();
  };

  // 用户拖拽滑块 → 停止播放
  const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlayingRef.current) stopPlay();
    onSliderChange(parseFloat(e.target.value));
  };

  // 用户点击刻度 → 停止播放并选择形态
  const handleTickClick = (shape: TileShapeType) => {
    if (isPlayingRef.current) stopPlay();
    onSelectShape(shape);
  };

  return (
      <footer
          className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 z-30 shadow-md transition-colors"
          aria-label="连续族滑动条"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-1.5">
          {/* Header row: label + parameter ratio */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>连续族形变滑动条</span>
            </div>
            <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
              参数比率
            </span>
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
              Tile({stats.parameterA.toFixed(2)}, {stats.parameterB.toFixed(2)})
            </span>
            </div>
          </div>

          {/* 播放按钮（左）+ 滑块（右） */}
          <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handlePlayToggle}
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                    isPlaying
                        ? 'bg-sky-600 text-white border-sky-500 hover:bg-sky-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={isPlaying ? '暂停播放' : '播放连续形变动画'}
                aria-label={isPlaying ? '暂停播放' : '播放连续形变动画'}
            >
              {isPlaying ? (
                  <Pause className="w-4 h-4" fill="currentColor" />
              ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
              )}
            </button>

            <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={sliderValue}
                onChange={handleSliderInput}
                className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                aria-label="Tile(a, b) 连续族滑动条"
            />
          </div>

          {/* Tick Labels for the 5 Canonical Shapes (click to jump) */}
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono px-0.5 select-none">
            <button
                type="button"
                onClick={() => handleTickClick('chevron')}
                className={`hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors ${
                    currentShape === 'chevron' ? 'font-bold text-sky-600 dark:text-sky-400' : ''
                }`}
                title="Tile(0, 1) - 雪佛龙"
            >
              雪佛龙 (0,1)
            </button>
            <button
                type="button"
                onClick={() => handleTickClick('hat')}
                className={`hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors ${
                    currentShape === 'hat' ? 'font-bold text-sky-600 dark:text-sky-400' : ''
                }`}
                title="Tile(1, √3) - 帽子"
            >
              帽子 (1,√3)
            </button>
            <button
                type="button"
                onClick={() => handleTickClick('spectre')}
                className={`hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors ${
                    currentShape === 'spectre' ? 'font-bold text-sky-600 dark:text-sky-400' : ''
                }`}
                title="Tile(1, 1) - 幽灵"
            >
              幽灵 (1,1)
            </button>
            <button
                type="button"
                onClick={() => handleTickClick('turtle')}
                className={`hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors ${
                    currentShape === 'turtle' ? 'font-bold text-sky-600 dark:text-sky-400' : ''
                }`}
                title="Tile(√3, 1) - 乌龟"
            >
              乌龟 (√3,1)
            </button>
            <button
                type="button"
                onClick={() => handleTickClick('comet')}
                className={`hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors ${
                    currentShape === 'comet' ? 'font-bold text-sky-600 dark:text-sky-400' : ''
                }`}
                title="Tile(1, 0) - 彗星"
            >
              彗星 (1,0)
            </button>
          </div>
        </div>
      </footer>
  );
};