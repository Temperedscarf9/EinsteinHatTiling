/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ExternalLink, BookOpen, Award, Compass, Sparkles } from 'lucide-react';
import { SHAPE_DEFINITIONS } from '../lib/monotileEngine';

interface TileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TileDetailModal: React.FC<TileDetailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                “爱因斯坦”非周期单瓷砖与 Tile(a, b) 连续族
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The Einstein Monotile Problem &amp; Continuous Tile Family
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Section 1: The Einstein Problem */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Award className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3>历史突破：爱因斯坦单瓷砖问题 (Einstein Monotile)</h3>
            </div>
            <p>
              在几何与拓扑学中，“Einstein”并非源于著名物理学家爱因斯坦，而是德语中“<b>ein Stein</b>”（意为“一块石头/瓷砖”）的双关语。几十年来，数学界一直在追寻：<b>是否存在一种单一形状的多边形，它能无缝密铺整个平面，并且形成的任何铺砌都绝不可能周期性重复？</b>
            </p>
            <p>
              1974年罗杰·彭罗斯 (Roger Penrose) 提出了著名的彭罗斯拼图，但需要 2 种瓷砖（风筝与飞镖）。直到 <b>2023年3月</b>，业余数学家 David Smith 与数学家 Joseph Samuel Myers、Craig S. Kaplan 和 Chaim Goodman-Strauss 共同发表论文，宣布发现了首个真正的非周期单瓷砖——“<b>帽子</b>”（The Hat），完美终结了这一半个世纪的数学难题。
            </p>
          </section>

          {/* Section 2: Continuous Tile(a, b) Family */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3>五大代表形态：Tile(a, b) 连续族</h3>
            </div>
            <p>
              论文作者们进一步证明，“帽子”并非孤立的存在，而是属于一个连续参数多边形族 <b>Tile(a, b)</b>。在这族多边形中，14条边的朝向固定，但边长分别由参数 $a$（8条边）与 $b$（6条边）控制。所有非退化的 Tile(a, b) 共享完全相同的组合替换与超瓷砖铺砌性质！
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {Object.values(SHAPE_DEFINITIONS).map((tile) => (
                <div
                  key={tile.type}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {tile.chineseName}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                      {tile.formula}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {tile.geometricNature}
                  </p>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    分类：{tile.classification}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: 1/7 Chirality Theorem */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3>严格的 1/7 镜像翻转比例定理</h3>
            </div>
            <p>
              在帽子瓷砖的任意无限铺砌中，必须同时使用未翻转的标准定向瓷砖与镜像翻转的瓷砖。严格的遍历理论证明，翻转瓷砖在整个平面中的渐进出现频率精确等于：
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-center text-sm font-bold text-sky-600 dark:text-sky-400">
              比例 = 1 / 7 ≈ 14.2857%
            </div>
            <p>
              本应用在画布中将这部分镜像瓷砖以高亮强调展示，您可以观察到它们以高度离散且永不周期重复的形式嵌入在浩瀚的瓷砖阵列中。
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <a
            href="https://arxiv.org/abs/2303.10798"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
          >
            <span>阅读原始论文 (arXiv:2303.10798)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
          >
            关闭 (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
