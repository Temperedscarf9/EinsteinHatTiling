/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D, RenderedPolygon, TileShapeInfo, TileShapeType, ColorScheme, ColorTheme } from '../types/monotile';

export const SQRT3 = Math.sqrt(3);
export const HR3 = 0.5 * SQRT3;
const PI = Math.PI;

/* ============================================================================
 * UI 层数据（未改动）
 * ========================================================================== */

export const SHAPE_DEFINITIONS: Record<TileShapeType, TileShapeInfo> = {
  chevron: {
    type: 'chevron', name: 'Chevron', chineseName: '雪佛龙 (Chevron)',
    formula: 'Tile(0, 1)', ratioAtoB: '0 : 1',
    aValue: 0, bValue: 1 + SQRT3, sliderValue: 0, vertices: 4, isAperiodic: false,
    classification: '退化周期极限态 (四角形 / Tetriamond)',
    description: '当 a=0 时，8 条 a-边全部退化为点，瓷砖退化为由 4 个正三角形组成的四菱形 (Tetriamond)。在该边界情形下允许形成简单的周期性铺砌。',
    geometricNature: '四菱形 (Tetriamond)，4 个正三角形拼合，周期性铺砌'
  },
  hat: {
    type: 'hat', name: 'Hat', chineseName: '帽子瓷砖 (Hat)',
    formula: 'Tile(1, √3)', ratioAtoB: '1 : √3',
    aValue: 1, bValue: SQRT3, sliderValue: 100 / (1 + SQRT3), vertices: 14, isAperiodic: true,
    classification: '非周期单瓷砖 (Aperiodic Monotile / Einstein)',
    description: '2023年3月由 David Smith、Craig Kaplan 等数学家宣布的划时代发现，成功解决了长达数十年未解的单瓷砖非周期铺砌问题 (Einstein Problem)。无需任何匹配标记，仅由自身几何形态即可强制铺满整个平面且永不周期重复。',
    geometricNature: '14边形风筝多边形 (Polykite)，由 8 个 60°-90°-120°-90° 风筝形拼合'
  },
  spectre: {
    type: 'spectre', name: 'Spectre', chineseName: '幽灵瓷砖 (Spectre / Tile(1,1))',
    formula: 'Tile(1, 1)', ratioAtoB: '1 : 1',
    aValue: (1 + SQRT3) / 2, bValue: (1 + SQRT3) / 2, sliderValue: 50, vertices: 14, isAperiodic: true,
    classification: '等边非周期过渡态 (Equilateral Tile(1,1))',
    description: '连续族 Tile(a,b) 中 a=b 时的对称对称多边形。其所有 14 条边的长度完全相等。当在边上施加微小的定向曲线时，即可演化为完全不需镜像反射的手性单瓷砖 Spectre。',
    geometricNature: '等边 14 边形，所有边长完全相等，所有内角均为 90°、120° 或 240°'
  },
  turtle: {
    type: 'turtle', name: 'Turtle', chineseName: '乌龟瓷砖 (Turtle)',
    formula: 'Tile(√3, 1)', ratioAtoB: '√3 : 1',
    aValue: SQRT3, bValue: 1, sliderValue: (100 * SQRT3) / (1 + SQRT3), vertices: 14, isAperiodic: true,
    classification: '双对偶非周期单瓷砖 (Dual Aperiodic Monotile)',
    description: 'Hat 瓷砖在连续族参数对调后的对偶形态。与 Hat 具有完全相同的组合剖分结构与层次超瓷砖替换规则，同样强制形成非周期铺砌，但展现出类似海龟背壳的饱满多边形轮廓。',
    geometricNature: '14边形风筝多边形，较长的 a 边 (√3) 与较短的 b 边 (1)'
  },
  comet: {
    type: 'comet', name: 'Comet', chineseName: '彗星瓷砖 (Comet)',
    formula: 'Tile(1, 0)', ratioAtoB: '1 : 0',
    aValue: 1 + SQRT3, bValue: 0, sliderValue: 100, vertices: 8, isAperiodic: false,
    classification: '退化周期极限态 (八菱形 / Octiamond)',
    description: '当 b=0 时，6 条 b-边全部退化为点，瓷砖退化为由 8 个正三角形组成的八菱形 (Octiamond)。如同 Chevron 一样，该形状是证明 Hat 瓷砖非周期性时的关键边界工具。',
    geometricNature: '八角多边形 (Octiamond)，8 个正三角形拼合，周期性铺砌'
  }
};

export const COLOR_THEMES: Record<ColorTheme, ColorScheme> = {
  academic: {
    id: 'academic', name: 'Academic Classic', chineseName: '学术经典蓝白',
    background: '#F8FAFC', canvasBg: '#FFFFFF', gridLine: '#E2E8F0',
    unflippedFill: '#E0F2FE', flippedFill: '#0284C7', singleFill: '#F0F9FF',
    stroke: '#0F172A', strokeWidth: 1.2, accent: '#0284C7'
  },
  blueprint: {
    id: 'blueprint', name: 'Blueprint Dark', chineseName: '蓝图工程深色',
    background: '#0B132B', canvasBg: '#0F172A', gridLine: '#1E293B',
    unflippedFill: '#1E3A8A', flippedFill: '#38BDF8', singleFill: '#172554',
    stroke: '#E2E8F0', strokeWidth: 1.2, accent: '#38BDF8'
  },
  morandi: {
    id: 'morandi', name: 'Morandi Minimalist', chineseName: '莫兰迪大地色',
    background: '#FDFBF7', canvasBg: '#FBF8F3', gridLine: '#EAE5DB',
    unflippedFill: '#E9E4DC', flippedFill: '#C86D51', singleFill: '#EFEBE4',
    stroke: '#3C3836', strokeWidth: 1.2, accent: '#C86D51'
  },
  monochrome: {
    id: 'monochrome', name: 'Monochrome Ink', chineseName: '水墨单色极简',
    background: '#F5F5F5', canvasBg: '#FAFAFA', gridLine: '#E5E5E5',
    unflippedFill: '#FFFFFF', flippedFill: '#525252', singleFill: '#F5F5F5',
    stroke: '#171717', strokeWidth: 1.4, accent: '#171717'
  },
  sunset: {
    id: 'sunset', name: 'Warm Sunset', chineseName: '日落暖阳',
    background: '#FFFDF9', canvasBg: '#FFFDF8', gridLine: '#F3E8D8',
    unflippedFill: '#FEF3C7', flippedFill: '#F43F5E', singleFill: '#FFFBEB',
    stroke: '#451A03', strokeWidth: 1.2, accent: '#F43F5E'
  }
};

/* ============================================================================
 * 仿射变换（6 元组）：[a, b, tx, c, d, ty]
 *   (x, y) -> (a*x + b*y + tx, c*x + d*y + ty)
 * ========================================================================== */

export type Transform = [number, number, number, number, number, number];
export interface Pt { x: number; y: number; }

export const IDENT: Transform = [1, 0, 0, 0, 1, 0];

export function mul(T: Transform, E: Transform): Transform {
  return [
    T[0] * E[0] + T[1] * E[3],
    T[0] * E[1] + T[1] * E[4],
    T[0] * E[2] + T[1] * E[5] + T[2],
    T[3] * E[0] + T[4] * E[3],
    T[3] * E[1] + T[4] * E[4],
    T[3] * E[2] + T[4] * E[5] + T[5]
  ];
}

export function inv(T: Transform): Transform {
  const det = T[0] * T[4] - T[1] * T[3];
  return [
    T[4] / det,
    -T[1] / det,
    (T[1] * T[5] - T[2] * T[4]) / det,
    -T[3] / det,
    T[0] / det,
    (T[2] * T[3] - T[0] * T[5]) / det
  ];
}

export function trot(ang: number): Transform {
  return [Math.cos(ang), -Math.sin(ang), 0, Math.sin(ang), Math.cos(ang), 0];
}

export function ttrans(tx: number, ty: number): Transform {
  return [1, 0, tx, 0, 1, ty];
}

export function rotAbout(p: Pt, ang: number): Transform {
  return mul(ttrans(p.x, p.y), mul(trot(ang), ttrans(-p.x, -p.y)));
}

export function transPt(T: Transform, p: Pt): Pt {
  return { x: T[0] * p.x + T[1] * p.y + T[2], y: T[3] * p.x + T[4] * p.y + T[5] };
}

export const pt = (x: number, y: number): Pt => ({ x, y });
export const padd = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
export const psub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });

export function matchSeg(t: Pt, e: Pt): Transform {
  return [e.x - t.x, t.y - e.y, t.x, e.y - t.y, e.x - t.x, t.y];
}

export function matchTwo(t1: Pt, t2: Pt, a1: Pt, a2: Pt): Transform {
  return mul(matchSeg(a1, a2), inv(matchSeg(t1, t2)));
}

export function intersect(a: Pt, b: Pt, c: Pt, d: Pt): Pt {
  const denom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);
  const t = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / denom;
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
}
interface LevelCache {
  hats: LeafHat[];
  parts: Float64Array[];
  avgAx: number;
  avgAy: number;
  avgBx: number;
  avgBy: number;
}
/* ============================================================================
 * HAT 形状（13 顶点）+ HAT_PARTS 累积拆分
 * ========================================================================== */

export const hexPt = (x: number, y: number): Pt => pt(x + 0.5 * y, HR3 * y);

export const HAT: Pt[] = [
  hexPt(0, 0),
  hexPt(-1, -1), hexPt(0, -2), hexPt(2, -2), hexPt(2, -1),
  hexPt(4, -2), hexPt(5, -1), hexPt(4, 0), hexPt(3, 0),
  hexPt(2, 2), hexPt(0, 3), hexPt(0, 2), hexPt(-1, 2)
];

/** 每条边长为 √3 时归入 "b" 累积，否则归入 "a" 累积 */
export const HAT_PARTS: number[][] = (() => {
  const out: number[][] = [[0, 0, 0, 0]];
  let acc = [0, 0, 0, 0];
  for (let i = 0; i < 12; i++) {
    const dx = HAT[i + 1].x - HAT[i].x;
    const dy = HAT[i + 1].y - HAT[i].y;
    acc = Math.abs(Math.hypot(dx, dy) - Math.sqrt(3)) < 1e-6
        ? [acc[0], acc[1], acc[2] + dx, acc[3] + dy]
        : [acc[0] + dx, acc[1] + dy, acc[2], acc[3]];
    out.push(acc);
  }
  return out;
})();

export function polyArea(xs: number[], ys: number[]): number {
  let a = 0;
  for (let i = 0; i < xs.length; i++) {
    const j = (i + 1) % xs.length;
    a += xs[i] * ys[j] - xs[j] * ys[i];
  }
  return Math.abs(a) / 2;
}

const HAT_AREA = polyArea(HAT.map(p => p.x), HAT.map(p => p.y));

/* ============================================================================
 * 叶子 / 元瓷砖结构
 * ========================================================================== */

export type TileKind = 'H' | 'T' | 'P' | 'F';

export interface HatLeaf {
  hat: true;
  type: TileKind;
  reflected: boolean;
  shape: Pt[];
  level: -1;
}

export function hatTile(type: TileKind, reflected: boolean): HatLeaf {
  return { hat: true, type, reflected, shape: HAT, level: -1 };
}

export class Meta {
  shape: Pt[];
  type: string;
  level: number;
  children: { T: Transform; g: HatLeaf | Meta }[] = [];

  constructor(shape: Pt[], type: string, level: number) {
    this.shape = shape;
    this.type = type;
    this.level = level;
  }

  add(T: Transform, g: HatLeaf | Meta): void {
    this.children.push({ T, g });
  }

  evalChild(idx: number, vertIdx: number): Pt {
    const c = this.children[idx];
    const shape = (c.g as Meta).shape ?? HAT;
    return transPt(c.T, shape[vertIdx]);
  }

  recentre(): void {
    let cx = 0, cy = 0;
    for (const p of this.shape) { cx += p.x; cy += p.y; }
    cx /= this.shape.length;
    cy /= this.shape.length;
    this.shape = this.shape.map(p => pt(p.x - cx, p.y - cy));
    const T = ttrans(-cx, -cy);
    for (const c of this.children) {
      c.T = mul(T, c.T);
    }
  }
}

/* ============================================================================
 * 初始元瓷砖 (H, T, P, F)
 * ========================================================================== */

export function initialTiles(): [Meta, Meta, Meta, Meta] {
  // ---- H ----
  const t0 = hatTile('H', false);
  const t1 = hatTile('H', true);
  const hShape = [
    pt(0, 0), pt(4, 0), pt(4.5, HR3),
    pt(2.5, 5 * HR3), pt(1.5, 5 * HR3), pt(-0.5, HR3)
  ];
  const H = new Meta(hShape, 'H', 0);
  H.add(matchTwo(HAT[5], HAT[7], H.shape[5], H.shape[0]), t0);
  H.add(matchTwo(HAT[9], HAT[11], H.shape[1], H.shape[2]), t0);
  H.add(matchTwo(HAT[5], HAT[7], H.shape[3], H.shape[4]), t0);
  H.add(
      mul(ttrans(2.5, HR3), mul([-0.5, -HR3, 0, HR3, -0.5, 0], [0.5, 0, 0, 0, -0.5, 0])),
      t1
  );

  // ---- T ----
  const tShape = [pt(0, 0), pt(3, 0), pt(1.5, 3 * HR3)];
  const T = new Meta(tShape, 'T', 0);
  T.add([0.5, 0, 0.5, 0, 0.5, HR3], hatTile('T', false));

  // ---- P ----
  const off = mul(ttrans(0, 2 * HR3), mul([0.5, HR3, 0, -HR3, 0.5, 0], [0.5, 0, 0, 0, 0.5, 0]));
  const pShape = [pt(0, 0), pt(4, 0), pt(3, 2 * HR3), pt(-1, 2 * HR3)];
  const P = new Meta(pShape, 'P', 0);
  const pi = hatTile('P', false);
  P.add([0.5, 0, 1.5, 0, 0.5, HR3], pi);
  P.add(off, pi);

  // ---- F ----
  const fShape = [pt(0, 0), pt(3, 0), pt(3.5, HR3), pt(3, 2 * HR3), pt(-1, 2 * HR3)];
  const F = new Meta(fShape, 'F', 0);
  const fr = hatTile('F', false);
  F.add([0.5, 0, 1.5, 0, 0.5, HR3], fr);
  F.add(off, fr);

  return [H, T, P, F];
}

/* ============================================================================
 * RULES（29 条）+ Patch + Metatiles
 * ========================================================================== */

type Rule =
    | [string]
    | [number, number, TileKind, number]
    | [number, number, number, number, TileKind, number];

export const RULES: Rule[] = [
  ['H'],
  [0, 0, 'P', 2],
  [1, 0, 'H', 2],
  [2, 0, 'P', 2],
  [3, 0, 'H', 2],
  [4, 4, 'P', 2],
  [0, 4, 'F', 3],
  [2, 4, 'F', 3],
  [4, 1, 3, 2, 'F', 0],
  [8, 3, 'H', 0],
  [9, 2, 'P', 0],
  [10, 2, 'H', 0],
  [11, 4, 'P', 2],
  [12, 0, 'H', 2],
  [13, 0, 'F', 3],
  [14, 2, 'F', 1],
  [15, 3, 'H', 4],
  [8, 2, 'F', 1],
  [17, 3, 'H', 4],
  [18, 0, 'P', 2],
  [19, 0, 'H', 2],
  [20, 4, 'F', 3],
  [20, 0, 'P', 2],
  [22, 0, 'H', 2],
  [23, 4, 'F', 3],
  [23, 0, 'F', 3],
  [16, 0, 'P', 2],
  [9, 4, 0, 2, 'T', 2],
  [4, 0, 'F', 3]
];

export function constructPatch(tiles: [Meta, Meta, Meta, Meta]): Meta {
  const byType: Record<TileKind, Meta> = { H: tiles[0], T: tiles[1], P: tiles[2], F: tiles[3] };
  const patch = new Meta([], 'patch', -2);

  for (const rule of RULES) {
    if (rule.length === 1) {
      patch.add(IDENT, byType[rule[0] as TileKind]);
    } else if (rule.length === 4) {
      const [pIdx, eIdx, tt, teIdx] = rule;
      const pc = patch.children[pIdx];
      const pShape = (pc.g as Meta).shape;
      const o = transPt(pc.T, pShape[(eIdx + 1) % pShape.length]);
      const n = transPt(pc.T, pShape[eIdx]);
      const tpl = byType[tt];
      const tplShape = tpl.shape;
      patch.add(matchTwo(tplShape[teIdx], tplShape[(teIdx + 1) % tplShape.length], o, n), tpl);
    } else {
      const [p1, e1, p2, e2, tt, teIdx] = rule;
      const c1 = patch.children[p1];
      const c2 = patch.children[p2];
      const o = transPt(c2.T, (c2.g as Meta).shape[e2]);
      const n = transPt(c1.T, (c1.g as Meta).shape[e1]);
      const tpl = byType[tt];
      const tplShape = tpl.shape;
      patch.add(matchTwo(tplShape[teIdx], tplShape[(teIdx + 1) % tplShape.length], o, n), tpl);
    }
  }
  return patch;
}

export function constructMetatiles(patch: Meta, level: number): [Meta, Meta, Meta, Meta] {
  const a = patch.evalChild(8, 2);
  const l = patch.evalChild(21, 2);
  const h = transPt(rotAbout(a, -2 * PI / 3), l);
  const o = patch.evalChild(7, 2);
  const n = patch.evalChild(25, 2);
  const inter = intersect(a, h, patch.evalChild(6, 2), o);
  let s = psub(patch.evalChild(6, 2), inter);

  // ---- H ----
  const hq: Pt[] = [inter, a];
  s = transPt(trot(-PI / 3), s);
  hq.push(padd(hq[1], s));
  hq.push(patch.evalChild(14, 2));
  s = transPt(trot(-PI / 3), s);
  hq.push(psub(hq[3], s));
  hq.push(patch.evalChild(6, 2));
  const newH = new Meta(hq, 'H', level);
  for (const idx of [0, 9, 16, 27, 26, 6, 1, 8, 10, 15]) {
    const ch = patch.children[idx];
    newH.add(ch.T, ch.g);
  }

  // ---- P ----
  const pq: Pt[] = [o, padd(o, psub(a, inter)), a, inter];
  const newP = new Meta(pq, 'P', level);
  for (const idx of [7, 2, 3, 4, 28]) {
    const ch = patch.children[idx];
    newP.add(ch.T, ch.g);
  }

  // ---- F ----
  const fq: Pt[] = [
    l,
    patch.evalChild(24, 2),
    patch.evalChild(25, 0),
    n,
    padd(n, psub(inter, a))
  ];
  const newF = new Meta(fq, 'F', level);
  for (const idx of [21, 20, 22, 23, 24, 25]) {
    const ch = patch.children[idx];
    newF.add(ch.T, ch.g);
  }

  // ---- T ----
  const p2 = hq[2];
  const y = padd(hq[1], psub(hq[4], hq[5]));
  const g = transPt(rotAbout(y, -PI / 3), p2);
  const tq: Pt[] = [y, g, p2];
  const newT = new Meta(tq, 'T', level);
  newT.add(patch.children[11].T, patch.children[11].g);

  [newH, newT, newP, newF].forEach(m => m.recentre());
  return [newH, newT, newP, newF];
}

/* ============================================================================
 * 连续族权重：tileWeights(deg)
 *   deg = 0  → comet      (b 权重 0)
 *   deg = 30 → turtle
 *   deg = 45 → spectre
 *   deg = 60 → hat         (还原原始 HAT)
 *   deg = 90 → chevron    (a 权重 0)
 * ========================================================================== */

export function tileWeights(deg: number): { a: number; c: number } {
  const rad = (deg * PI) / 180;
  const a0 = 2 * Math.cos(rad);
  const c0 = (2 * Math.sin(rad)) / Math.sqrt(3);
  const xs = HAT_PARTS.map(p => a0 * p[0] + c0 * p[2]);
  const ys = HAT_PARTS.map(p => a0 * p[1] + c0 * p[3]);
  const areaXf = Math.max(1e-6, polyArea(xs, ys));
  const n = Math.sqrt(HAT_AREA / areaXf);
  return { a: a0 * n, c: c0 * n };
}

export function getABFromSlider(sliderVal: number): { a: number; b: number } {
  const v = Math.max(0, Math.min(100, sliderVal)) / 100.0;
  const alpha = 1 + SQRT3;
  return { a: alpha * v, b: alpha * (1 - v) };
}

function angleFromAB(a: number, b: number): number {
  return (Math.atan2(b, a) * 180) / PI;
}

/* ============================================================================
 * 预计算各级替换树
 * ========================================================================== */

export const PRECOMPUTED_SYSTEMS: [Meta, Meta, Meta, Meta][] = (() => {
  const systems: [Meta, Meta, Meta, Meta][] = [];
  let tiles = initialTiles();
  systems.push(tiles);
  for (let lvl = 1; lvl <= 6; lvl++) {
    const patch = constructPatch(tiles);
    tiles = constructMetatiles(patch, lvl);
    systems.push(tiles);
  }
  return systems;
})();

/* ============================================================================
 * 收集叶子 hat + Flood-fill 建立每片 hat 的参数化
 * ========================================================================== */

interface LeafHat {
  xs: Float64Array;
  ys: Float64Array;
  type: TileKind;
  reflected: boolean;
}



function collectHats(node: HatLeaf | Meta, T: Transform, out: LeafHat[]): void {
  if ((node as HatLeaf).hat) {
    const leaf = node as HatLeaf;
    const xs = new Float64Array(13);
    const ys = new Float64Array(13);
    for (let i = 0; i < 13; i++) {
      xs[i] = T[0] * HAT[i].x + T[1] * HAT[i].y + T[2];
      ys[i] = T[3] * HAT[i].x + T[4] * HAT[i].y + T[5];
    }
    out.push({ xs, ys, type: leaf.type, reflected: leaf.reflected });
  } else {
    const meta = node as Meta;
    for (const c of meta.children) {
      collectHats(c.g, mul(T, c.T), out);
    }
  }
}

function floodFill(hats: LeafHat[]): LevelCache {
  const keyOf = (x: number, y: number) => `${Math.round(512 * x)},${Math.round(512 * y)}`;

  const vmap = new Map<string, number[]>();
  for (let h = 0; h < hats.length; h++) {
    for (let v = 0; v < 13; v++) {
      const k = keyOf(hats[h].xs[v], hats[h].ys[v]);
      let list = vmap.get(k);
      if (!list) { list = []; vmap.set(k, list); }
      list.push(16 * h + v);
    }
  }

  // 起点选择：距离世界原点最近的那片 hat 的顶点 0
  // （与原正确源码一致：以最近的 tile 为传播起点；不影响最终质心结果）
  let startHat = 0;
  let bestDist = Infinity;
  for (let h = 0; h < hats.length; h++) {
    const d = Math.hypot(hats[h].xs[0], hats[h].ys[0]);
    if (d < bestDist) { bestDist = d; startHat = h; }
  }

  const parts: (Float64Array | null)[] = new Array(hats.length).fill(null);
  const stack: [number, number, number, number, number, number][] = [
    [startHat, 0, 0, 0, 0, 0]
  ];

  while (stack.length > 0) {
    const [hIdx, vIdx, ax, ay, bx, by] = stack.pop()!;
    if (parts[hIdx]) continue;
    const h = hats[hIdx];
    const out = new Float64Array(52);
    let d = ax, f = ay, g = bx, t = by;
    for (let i = 0; i < 13; i++) {
      const v = (vIdx + i) % 13;
      if (i > 0) {
        const prev = (v + 12) % 13;
        const dx = h.xs[v] - h.xs[prev];
        const dy = h.ys[v] - h.ys[prev];
        if (Math.abs(Math.hypot(dx, dy) - HR3) < 1e-6) {
          g += dx; t += dy;
        } else {
          d += dx; f += dy;
        }
      }
      out[4 * v] = d;
      out[4 * v + 1] = f;
      out[4 * v + 2] = g;
      out[4 * v + 3] = t;
    }
    parts[hIdx] = out;

    for (let v = 0; v < 13; v++) {
      const k = keyOf(h.xs[v], h.ys[v]);
      const adj = vmap.get(k)!;
      for (const code of adj) {
        const oh = code >> 4;
        const ov = code & 15;
        if (!parts[oh]) {
          stack.push([
            oh, ov,
            out[4 * v], out[4 * v + 1], out[4 * v + 2], out[4 * v + 3]
          ]);
        }
      }
    }
  }

  // ★ 关键修复：对所有 hat 的所有 13 个顶点的 parts 求平均
  const partsArr = parts as Float64Array[];
  let sumAx = 0, sumAy = 0, sumBx = 0, sumBy = 0;
  const count = hats.length * 13;
  for (const p of partsArr) {
    for (let v = 0; v < 13; v++) {
      sumAx += p[4 * v];
      sumAy += p[4 * v + 1];
      sumBx += p[4 * v + 2];
      sumBy += p[4 * v + 3];
    }
  }

  return {
    hats,
    parts: partsArr,
    avgAx: sumAx / count,
    avgAy: sumAy / count,
    avgBx: sumBx / count,
    avgBy: sumBy / count
  };
}

const levelCaches: (LevelCache | undefined)[] = [];

function getLevelCache(level: number): LevelCache {
  if (!levelCaches[level]) {
    const root = PRECOMPUTED_SYSTEMS[level][0];
    const hats: LeafHat[] = [];
    collectHats(root, IDENT, hats);
    levelCaches[level] = floodFill(hats);
  }
  return levelCaches[level]!;
}

/* ============================================================================
 * 渲染：对每片 hat 用它自己的 parts + 全局 (aW, cW) 变形
 * ========================================================================== */

export function generatePolygons(
    level: number,
    a: number,
    b: number,
    _mode: 'H8' | 'H7' = 'H8'
): RenderedPolygon[] {
  const safeLevel = Math.max(0, Math.min(PRECOMPUTED_SYSTEMS.length - 1, level));
  const c = getLevelCache(safeLevel);
  const deg = angleFromAB(a, b);
  const { a: aW, c: cW } = tileWeights(deg);

  const polygons: RenderedPolygon[] = [];
  for (let i = 0; i < c.hats.length; i++) {
    const hat = c.hats[i];
    const parts = c.parts[i];
    if (!parts) continue;

    const pts: Point2D[] = [];
    let cx = 0, cy = 0;
    for (let v = 0; v < 13; v++) {
      // ★ 减去全局质心 avg → 任意 (aW, cW) 下质心恒在原点
      const x = aW * (parts[4 * v]     - c.avgAx)
          + cW * (parts[4 * v + 2] - c.avgBx);
      const y = aW * (parts[4 * v + 1] - c.avgAy)
          + cW * (parts[4 * v + 3] - c.avgBy);
      pts.push({ x, y });
      cx += x; cy += y;
    }
    cx /= 13;
    cy /= 13;

    let area = 0;
    for (let v = 0; v < 13; v++) {
      const p1 = pts[v];
      const p2 = pts[(v + 1) % 13];
      area += p1.x * p2.y - p2.x * p1.y;
    }
    area = Math.abs(area) * 0.5;

    polygons.push({
      id: i,
      label: hat.reflected ? 'flipped' : 'unflipped',
      pts,
      center: { x: cx, y: cy },
      area
    });
  }
  return polygons;
}

/* ============================================================================
 * 包围盒（未改动）
 * ========================================================================== */

export function computeBoundingBox(polygons: RenderedPolygon[]): {
  minX: number; maxX: number; minY: number; maxY: number;
  width: number; height: number; centerX: number; centerY: number;
} {
  if (polygons.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const poly of polygons) {
    for (const p of poly.pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const width = maxX - minX;
  const height = maxY - minY;
  return {
    minX, maxX, minY, maxY, width, height,
    centerX: (minX + maxX) * 0.5,
    centerY: (minY + maxY) * 0.5
  };
}