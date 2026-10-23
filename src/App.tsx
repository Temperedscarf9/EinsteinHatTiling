/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useCallback } from 'react';
import { TileShapeType, ColorTheme, TilingStats, RenderedPolygon } from './types/monotile';
import {
  SHAPE_DEFINITIONS,
  COLOR_THEMES,
  generatePolygons,
  getABFromSlider,
  computeBoundingBox
} from './lib/monotileEngine';
import { Header } from './components/Header';
import { LeftLevelSidebar } from './components/LeftLevelSidebar';
import { BottomShapeBar } from './components/BottomShapeBar';
import { TileCanvas } from './components/TileCanvas';
import { ControlPanel } from './components/ControlPanel';
import { TileDetailModal } from './components/TileDetailModal';

export default function App() {
  // Main selected shape: default to 'hat'
  const [currentShape, setCurrentShape] = useState<TileShapeType>('hat');

  // Slider value [0, 100] on the continuum
  const [sliderValue, setSliderValue] = useState<number>(SHAPE_DEFINITIONS.hat.sliderValue);

  // Supertile inflation generation level (0 = 1 tile, 1 = 8 tiles, 2 = 55 tiles, 3 = 377 tiles, 4 = 2584 tiles)
  const [generationLevel, setGenerationLevel] = useState<number>(2);

  // Color theme
  const [colorTheme, setColorTheme] = useState<ColorTheme>('academic');

  // Visual display toggles
  const [showOutlines, setShowOutlines] = useState<boolean>(true);
  const [highlightReflected, setHighlightReflected] = useState<boolean>(true);
  const [showCenters, setShowCenters] = useState<boolean>(false);

  // Settings panel toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Info modal state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // When a preset shape is chosen, update both the shape and the slider
  const handleSelectShape = useCallback((shape: TileShapeType) => {
    setCurrentShape(shape);
    setSliderValue(SHAPE_DEFINITIONS[shape].sliderValue);
  }, []);

  // When slider is moved continuously, derive (a, b) and determine closest shape
  const handleSliderChange = useCallback((val: number) => {
    setSliderValue(val);

    // Identify nearest canonical shape within small tolerance
    const shapes: TileShapeType[] = ['chevron', 'hat', 'spectre', 'turtle', 'comet'];
    let nearest: TileShapeType = 'hat';
    let minDiff = Infinity;
    for (const s of shapes) {
      const diff = Math.abs(SHAPE_DEFINITIONS[s].sliderValue - val);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = s;
      }
    }
    if (minDiff < 4.0) {
      setCurrentShape(nearest);
    }
  }, []);

  // Derive (a, b) parameters from slider value
  const { a, b } = useMemo(() => {
    return getABFromSlider(sliderValue);
  }, [sliderValue]);

  // Generate tiling polygons
  const polygons = useMemo(() => {
    return generatePolygons(generationLevel, a, b, 'H8');
  }, [generationLevel, a, b]);

  // Statistics calculation
  const stats: TilingStats = useMemo(() => {
    let unflipped = 0;
    let flipped = 0;
    for (const poly of polygons) {
      if (poly.label === 'flipped') {
        flipped++;
      } else {
        unflipped++;
      }
    }
    const total = polygons.length;
    const ratio = total > 0 ? (flipped / total) * 100 : 0;
    return {
      totalTiles: total,
      unflippedCount: unflipped,
      flippedCount: flipped,
      reflectionRatio: ratio,
      generationLevel,
      parameterA: a,
      parameterB: b
    };
  }, [polygons, generationLevel, a, b]);

  const activeColorScheme = COLOR_THEMES[colorTheme];

  // SVG Export
  const handleExportSVG = useCallback(() => {
    if (polygons.length === 0) return;
    const bbox = computeBoundingBox(polygons);
    const pad = 10;
    const vbX = bbox.minX - pad;
    const vbY = bbox.minY - pad;
    const vbW = bbox.width + pad * 2;
    const vbH = bbox.height + pad * 2;

    const svgLines: string[] = [];
    svgLines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    svgLines.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}" width="${Math.round(vbW * 5)}" height="${Math.round(vbH * 5)}" style="background-color: ${activeColorScheme.canvasBg};">`
    );

    for (const poly of polygons) {
      const ptsStr = poly.pts.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
      let fill = activeColorScheme.unflippedFill;
      if (poly.label === 'flipped' && highlightReflected) {
        fill = activeColorScheme.flippedFill;
      }
      const strokeStr = showOutlines
        ? `stroke="${activeColorScheme.stroke}" stroke-width="${activeColorScheme.strokeWidth * 0.15}" stroke-linejoin="round"`
        : 'stroke="none"';

      svgLines.push(`  <polygon points="${ptsStr}" fill="${fill}" ${strokeStr} />`);
    }

    svgLines.push(`</svg>`);
    const blob = new Blob([svgLines.join('\n')], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monotile_${currentShape}_gen${generationLevel}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [polygons, activeColorScheme, highlightReflected, showOutlines, currentShape, generationLevel]);

  // PNG Export
  const handleExportPNG = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `monotile_${currentShape}_gen${generationLevel}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentShape, generationLevel]);

  const handleTileClick = useCallback((_tile: RenderedPolygon) => {
    // Optional tile click hook
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Top Bar Header (Compact and clean) */}
      <Header
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
      />

      {/* Main Center Area: Left Level Switcher + Central Viewport Canvas + Optional Right Settings */}
      <main className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Side: Generation Level Switcher (阶数切换) */}
        <LeftLevelSidebar
          generationLevel={generationLevel}
          onLevelChange={setGenerationLevel}
          totalTiles={polygons.length}
        />

        {/* Center: Canvas Viewport */}
        <div className="flex-1 h-full min-h-[320px] relative overflow-hidden">
          <TileCanvas
            polygons={polygons}
            colorScheme={activeColorScheme}
            showOutlines={showOutlines}
            highlightReflected={highlightReflected}
            showCenters={showCenters}
            currentShapeName={SHAPE_DEFINITIONS[currentShape].chineseName}
            generationLevel={generationLevel}
            onLevelChange={setGenerationLevel}
            onTileClick={handleTileClick}
          />
        </div>

        {/* Optional Right Panel: Color Scheme, Outlines, Chirality, Math Detail (No duplicate selectors) */}
        {isSettingsOpen && (
          <ControlPanel
            currentShape={currentShape}
            colorTheme={colorTheme}
            onThemeChange={setColorTheme}
            showOutlines={showOutlines}
            onToggleOutlines={() => setShowOutlines((v) => !v)}
            highlightReflected={highlightReflected}
            onToggleHighlightReflected={() => setHighlightReflected((v) => !v)}
            showCenters={showCenters}
            onToggleShowCenters={() => setShowCenters((v) => !v)}
            stats={stats}
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Area: Shape Selection (Comet, Turtle, Spectre, Hat, Chevron) + Continuous Deformation Slider */}
      <BottomShapeBar
        currentShape={currentShape}
        onSelectShape={handleSelectShape}
        sliderValue={sliderValue}
        onSliderChange={handleSliderChange}
        stats={stats}
      />

      {/* Mathematical Detail Modal */}
      <TileDetailModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
