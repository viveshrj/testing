"use client"

import { useEffect, useRef } from "react"

interface MoodEntry {
  mood: number
  date: string
}

interface MoodChartProps {
  data: MoodEntry[]
}

export function MoodChart({ data }: MoodChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up dimensions
    const padding = 40
    const chartWidth = canvas.width - 2 * padding
    const chartHeight = canvas.height - 2 * padding

    // Draw axes
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw mood line
    if (data.length > 1) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((entry, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = canvas.height - padding - ((entry.mood - 1) / 4) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      ctx.fillStyle = "#3b82f6"
      data.forEach((entry, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = canvas.height - padding - ((entry.mood - 1) / 4) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // Y-axis labels
    for (let i = 1; i <= 5; i++) {
      const y = canvas.height - padding - ((i - 1) / 4) * chartHeight
      ctx.fillText(i.toString(), padding - 20, y + 4)
    }
  }, [data])

  return <canvas ref={canvasRef} width={400} height={200} className="w-full h-48 border rounded" />
}
