/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RenderedPolygon, ColorScheme } from '../types/monotile';
import { computeBoundingBox } from '../lib/monotileEngine';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface TileCanvasProps {
  polygons: RenderedPolygon[];
  colorScheme: ColorScheme;
  showOutlines: boolean;
  highlightReflected: boolean;
  showCenters: boolean;
  currentShapeName?: string;
  generationLevel?: number;
  onLevelChange?: (lvl: number) => void;
  onTileClick?: (tile: RenderedPolygon) => void;
}

export const TileCanvas: React.FC<TileCanvasProps> = ({
  polygons,
  colorScheme,
  showOutlines,
  highlightReflected,
  showCenters,
  currentShapeName,
  generationLevel,
  onLevelChange,
  onTileClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport transform state
  const [transform, setTransform] = useState<{ scale: number; offsetX: number; offsetY: number }>({
    scale: 24,
    offsetX: 0,
    offsetY: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredTile, setHoveredTile] = useState<RenderedPolygon | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Manual fit to viewport (triggered ONLY when user clicks the "适应画布" button)
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || polygons.length === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const bbox = computeBoundingBox(polygons);

    if (bbox.width === 0 || bbox.height === 0) return;

    const padding = 60;
    const availableW = clientWidth - padding * 2;
    const availableH = clientHeight - padding * 2;

    const scaleX = availableW / bbox.width;
    const scaleY = availableH / bbox.height;
    const newScale = Math.max(2, Math.min(scaleX, scaleY));

    // Center in screen
    const newOffsetX = clientWidth * 0.5 - bbox.centerX * newScale;
    const newOffsetY = clientHeight * 0.5 - bbox.centerY * newScale;

    setTransform({
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY
    });
  }, [polygons]);

  // One-time initial camera setup on component mount ONLY.
  // NO UI interaction (level switch, slider, shape selection, toggles) will ever reset or transform the camera.
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (!containerRef.current || polygons.length === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    const bbox = computeBoundingBox(polygons);
    if (bbox.width === 0 || bbox.height === 0) return;

    const padding = 60;
    const availableW = clientWidth - padding * 2;
    const availableH = clientHeight - padding * 2;

    const scaleX = availableW / bbox.width;
    const scaleY = availableH / bbox.height;
    const initScale = Math.max(2, Math.min(scaleX, scaleY));

    setTransform({
      scale: initScale,
      offsetX: clientWidth * 0.5 - bbox.centerX * initScale,
      offsetY: clientHeight * 0.5 - bbox.centerY * initScale
    });

    hasInitializedRef.current = true;
  }, [polygons]);

  // Point in polygon test (Ray-casting)
  const isPointInPolygon = (px: number, py: number, poly: { x: number; y: number }[]): boolean => {
    let inside = false;
    const n = poly.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = poly[i].x;
      const yi = poly[i].y;
      const xj = poly[j].x;
      const yj = poly[j].y;

      const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Convert mouse screen coordinates to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      return {
        x: (screenX - transform.offsetX) / transform.scale,
        y: (screenY - transform.offsetY) / transform.scale
      };
    },
    [transform]
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Background fill
    ctx.fillStyle = colorScheme.canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Background dot/grid pattern
    ctx.strokeStyle = colorScheme.gridLine;
    ctx.lineWidth = 0.5;
    const gridSize = 40;
    const startX = transform.offsetX % gridSize;
    const startY = transform.offsetY % gridSize;

    ctx.beginPath();
    for (let x = startX; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = startY; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Transform setup
    ctx.translate(transform.offsetX, transform.offsetY);
    ctx.scale(transform.scale, transform.scale);

    // Draw all polygons
    for (let i = 0; i < polygons.length; i++) {
      const poly = polygons[i];
      if (poly.pts.length === 0) continue;

      const isHovered = hoveredTile?.id === poly.id;

      ctx.beginPath();
      ctx.moveTo(poly.pts[0].x, poly.pts[0].y);
      for (let j = 1; j < poly.pts.length; j++) {
        ctx.lineTo(poly.pts[j].x, poly.pts[j].y);
      }
      ctx.closePath();

      // Determine fill color
      let fillCol = colorScheme.unflippedFill;
      if (poly.label === 'flipped') {
        fillCol = highlightReflected ? colorScheme.flippedFill : colorScheme.unflippedFill;
      } else if (poly.label === 'single') {
        fillCol = colorScheme.singleFill;
      }

      if (isHovered) {
        ctx.fillStyle = colorScheme.accent;
      } else {
        ctx.fillStyle = fillCol;
      }
      ctx.fill();

      // Stroke
      if (showOutlines) {
        ctx.strokeStyle = isHovered ? '#000000' : colorScheme.stroke;
        ctx.lineWidth = (isHovered ? 2.5 : colorScheme.strokeWidth) / transform.scale;
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Center dots
      if (showCenters) {
        ctx.fillStyle = poly.label === 'flipped' ? '#EF4444' : '#3B82F6';
        ctx.beginPath();
        ctx.arc(poly.center.x, poly.center.y, 2 / transform.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }, [
    polygons,
    transform,
    colorScheme,
    showOutlines,
    highlightReflected,
    showCenters,
    hoveredTile
  ]);

  // Mouse drag pan handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.offsetX, y: e.clientY - transform.offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        offsetX: e.clientX - dragStart.x,
        offsetY: e.clientY - dragStart.y
      }));
      setHoveredTile(null);
      setHoverPos(null);
      return;
    }

    // Hit-testing hovered tile
    const world = screenToWorld(clientX, clientY);
    let found: RenderedPolygon | null = null;

    // Check in reverse order so top-drawn tiles take precedence
    for (let i = polygons.length - 1; i >= 0; i--) {
      if (isPointInPolygon(world.x, world.y, polygons[i].pts)) {
        found = polygons[i];
        break;
      }
    }

    setHoveredTile(found);
    if (found) {
      setHoverPos({ x: clientX, y: clientY });
    } else {
      setHoverPos(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 光标离开 canvas（进入浮动 UI 控件、侧栏、底栏等）时，清除悬浮窗
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredTile(null);
    setHoverPos(null);
  };
  const transformRef = useRef(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);
  // Mouse wheel zoom handler (zooms toward mouse pointer)
  // 原生 wheel 事件监听（非 passive，允许 preventDefault）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const t = transformRef.current;
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.max(1, Math.min(200, t.scale * zoomFactor));

      // Keep point under mouse fixed
      const newOffsetX = mouseX - (mouseX - t.offsetX) * (newScale / t.scale);
      const newOffsetY = mouseY - (mouseY - t.offsetY) * (newScale / t.scale);

      setTransform({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY
      });
    };

    canvas.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheelNative);
    };
  }, []); // 空依赖：只注册一次，通过 transformRef 读取最新值

  const zoomIn = () => {
    if (!containerRef.current) return;
    const cx = containerRef.current.clientWidth / 2;
    const cy = containerRef.current.clientHeight / 2;
    const newScale = Math.min(200, transform.scale * 1.25);
    const newOffsetX = cx - (cx - transform.offsetX) * (newScale / transform.scale);
    const newOffsetY = cy - (cy - transform.offsetY) * (newScale / transform.scale);
    setTransform({ scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY });
  };

  const zoomOut = () => {
    if (!containerRef.current) return;
    const cx = containerRef.current.clientWidth / 2;
    const cy = containerRef.current.clientHeight / 2;
    const newScale = Math.max(1, transform.scale / 1.25);
    const newOffsetX = cx - (cx - transform.offsetX) * (newScale / transform.scale);
    const newOffsetY = cy - (cy - transform.offsetY) * (newScale / transform.scale);
    setTransform({ scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY });
  };

  const handleCanvasClick = () => {
    if (hoveredTile && onTileClick) {
      onTileClick(hoveredTile);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-50 dark:bg-slate-950 flex flex-col"
    >
      <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className={`w-full h-full block touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
      />

      {/* On-Canvas Status Badge */}
      {currentShapeName !== undefined && generationLevel !== undefined && (
        <div className="absolute top-3 left-3 flex items-center gap-2 p-1.5 px-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs z-20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>{currentShapeName}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="text-sky-600 dark:text-sky-400 font-semibold font-mono">
            第 {generationLevel} 阶
          </span>

          <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] tabular-nums">
            ({polygons.length} 片)
          </span>
        </div>
      )}

      {/* Floating Viewport Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-md z-20">
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
          title="放大 (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={zoomOut}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
          title="缩小 (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={fitToScreen}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
          title="适应画布 (Fit to Screen)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => fitToScreen()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
          title="重置视角 (Reset View)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredTile && hoverPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 bg-slate-900/95 text-white dark:bg-slate-800/95 text-xs rounded-lg shadow-xl border border-slate-700 backdrop-blur-xs whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sky-400">
              瓷砖 #{hoveredTile.id}
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-[11px] text-slate-300">
              {hoveredTile.label === 'flipped' ? '反射镜像 (Flipped)' : '标准定向 (Normal)'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span>中心: ({hoveredTile.center.x.toFixed(2)}, {hoveredTile.center.y.toFixed(2)})</span>
            <span>面积: {hoveredTile.area.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
