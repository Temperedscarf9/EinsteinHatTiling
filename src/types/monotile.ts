/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TileShapeType = 'comet' | 'turtle' | 'spectre' | 'hat' | 'chevron';

export interface TileShapeInfo {
  type: TileShapeType;
  name: string;
  chineseName: string;
  formula: string;
  ratioAtoB: string;
  aValue: number;
  bValue: number;
  sliderValue: number; // 0 to 100 on the continuum slider
  vertices: number;
  isAperiodic: boolean;
  classification: string;
  description: string;
  geometricNature: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RenderedPolygon {
  id: number;
  label: 'single' | 'unflipped' | 'flipped';
  pts: Point2D[];
  center: Point2D;
  area: number;
}

export type ColorTheme = 'academic' | 'blueprint' | 'morandi' | 'monochrome' | 'sunset';

export interface ColorScheme {
  id: ColorTheme;
  name: string;
  chineseName: string;
  background: string;
  canvasBg: string;
  gridLine: string;
  unflippedFill: string;
  flippedFill: string;
  singleFill: string;
  stroke: string;
  strokeWidth: number;
  accent: string;
}

export interface TilingStats {
  totalTiles: number;
  unflippedCount: number;
  flippedCount: number;
  reflectionRatio: number; // Target is ~1/7 (14.28%)
  generationLevel: number;
  parameterA: number;
  parameterB: number;
}
