'use client'

import type React from 'react'

import { useState, useRef, useCallback, useEffect } from 'react'

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  MousePointer,
  Keyboard,
  Info,
} from 'lucide-react'

interface Transform {
  scale: number
  translateX: number
  translateY: number
}

interface Point {
  x: number
  y: number
}

export default function ZoomPanApp() {
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })
  const [transformStart, setTransformStart] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpacePressed(true)
      }
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
        setIsDragging(false)
      }
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle zoom with mouse wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!isCtrlPressed) return

      e.preventDefault()

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(5, transform.scale * delta))

      // Calculate zoom origin
      const scaleChange = newScale / transform.scale
      const newTranslateX =
        mouseX - (mouseX - transform.translateX) * scaleChange
      const newTranslateY =
        mouseY - (mouseY - transform.translateY) * scaleChange

      setTransform({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      })
    },
    [isCtrlPressed, transform],
  )

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isSpacePressed) return

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setTransformStart({ ...transform })
    },
    [isSpacePressed, transform],
  )

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !isSpacePressed) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setTransform({
        ...transformStart,
        translateX: transformStart.translateX + deltaX,
        translateY: transformStart.translateY + deltaY,
      })
    },
    [isDragging, isSpacePressed, dragStart, transformStart],
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Zoom controls - center-focused
  const zoomIn = () => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    const newScale = Math.min(5, transform.scale * 1.2)
    const scaleChange = newScale / transform.scale

    // Calculate new translation to keep center point fixed
    const newTranslateX =
      centerX - (centerX - transform.translateX) * scaleChange
    const newTranslateY =
      centerY - (centerY - transform.translateY) * scaleChange

    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    })
  }

  const zoomOut = () => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    const newScale = Math.max(0.1, transform.scale * 0.8)
    const scaleChange = newScale / transform.scale

    // Calculate new translation to keep center point fixed
    const newTranslateX =
      centerX - (centerX - transform.translateX) * scaleChange
    const newTranslateY =
      centerY - (centerY - transform.translateY) * scaleChange

    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    })
  }

  const resetTransform = () => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    // Center the content in the viewport
    setTransform({
      scale: 1,
      translateX: centerX - 400, // Assuming content is roughly 800px wide, so center it
      translateY: centerY - 300, // Assuming content is roughly 600px tall, so center it
    })
  }

  const fitToScreen = () => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const padding = 50
    const availableWidth = containerRect.width - padding * 2
    const availableHeight = containerRect.height - padding * 2

    // Assuming content is roughly 800x600
    const contentWidth = 800
    const contentHeight = 600

    const scaleX = availableWidth / contentWidth
    const scaleY = availableHeight / contentHeight
    const newScale = Math.min(scaleX, scaleY, 1)

    const centerX = containerRect.width / 2 - (contentWidth * newScale) / 2
    const centerY = containerRect.height / 2 - (contentHeight * newScale) / 2

    setTransform({
      scale: newScale,
      translateX: centerX,
      translateY: centerY,
    })
  }

  const getCursor = () => {
    if (isSpacePressed) return isDragging ? 'grabbing' : 'grab'
    return 'default'
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Zoom & Pan Canvas</h1>
          <span  className="text-xs">
            Scale: {(transform.scale * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button   onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </button>
          <button   onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </button>
          <button   onClick={resetTransform}>
            <RotateCcw className="h-4 w-4" />
          </button>
          <button   onClick={fitToScreen}>
            Fit to Screen
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="flex items-center gap-4 border-b bg-blue-50 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-blue-600" />
          <span>
            <kbd className="rounded border bg-white px-1 py-0.5 text-xs">
              Ctrl
            </kbd>{' '}
            + Scroll to zoom
          </span>
        </div>
        <div  className="h-4" />
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-blue-600" />
          <span>
            <kbd className="rounded border bg-white px-1 py-0.5 text-xs">
              Space
            </kbd>{' '}
            + Drag to pan
          </span>
        </div>
        <div  className="h-4" />
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700">
            {isSpacePressed
              ? 'Pan mode active'
              : isCtrlPressed
                ? 'Zoom mode active'
                : 'Normal mode'}
          </span>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ cursor: getCursor() }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Demo Content */}
          <div className="space-y-6 p-8">
            {/* Grid of divs */}
            <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="text-2xl font-bold text-gray-600">
                        #{i + 1}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        div Title {i + 1}
                      </h3>
                      <p className="text-sm text-gray-600">
                        This is a demo div to showcase the zoom and pan
                        functionality. You can zoom in and out using Ctrl +
                        scroll wheel.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span >Tag {i + 1}</span>
                      <span >Demo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional content */}
            <div className="max-w-4xl space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8">
                <h2 className="mb-4 text-2xl font-bold">Interactive Canvas</h2>
                <p className="mb-4 text-gray-700">
                  This canvas demonstrates smooth zoom and pan interactions
                  similar to design tools like Figma and Excalidraw.
                </p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'].map(
                    (feature, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white p-4 shadow-sm"
                      >
                        <div className="mb-2 h-8 w-8 rounded-full bg-blue-500"></div>
                        <div className="font-medium">{feature}</div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6">
                  <h3 className="mb-3 font-semibold">Zoom Controls</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Hold Ctrl/Cmd + scroll to zoom</li>
                    <li>• Use zoom buttons in header</li>
                    <li>• Zoom range: 10% - 500%</li>
                    <li>• Zoom towards cursor position</li>
                  </ul>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 font-semibold">Pan Controls</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Hold Space + drag to pan</li>
                    <li>• Smooth momentum scrolling</li>
                    <li>• Visual cursor feedback</li>
                    <li>• Reset to center anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute top-4 right-4 space-y-2">
          {isSpacePressed && (
            <span className="bg-green-500 text-white">
              <Move className="mr-1 h-3 w-3" />
              Pan Mode
            </span>
          )}
          {isCtrlPressed && (
            <span className="bg-blue-500 text-white">
              <MousePointer className="mr-1 h-3 w-3" />
              Zoom Mode
            </span>
          )}
        </div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 left-4">
          <span  className="bg-white/90 backdrop-blur-sm">
            {(transform.scale * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}
